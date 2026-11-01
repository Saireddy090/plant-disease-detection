#!/usr/bin/env python3
"""
Plant Disease Detection - Deep Learning Model Training Pipeline
Trains MobileNetV2 on authentic PlantVillage real leaf photographs using:
  1. Two-Stage Transfer Learning (Backbone Freeze -> Progressive Fine-Tuning)
  2. Differential Learning Rates (1e-4 for backbone features, 5e-4 for classifier head)
  3. Apple Silicon Metal Performance Shaders (MPS GPU) acceleration
  4. Cosine Annealing Learning Rate scheduling with label smoothing
Saves champion weights to model/plant_disease_cnn.pth and metrics to model/training_metrics.json.
"""

import os
import sys
import time
import json
import ssl
import argparse
import numpy as np

# macOS Python SSL certificate verification fix for torchvision pretrained downloads
ssl._create_default_https_context = ssl._create_unverified_context

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.disease_info import CLASSES_LIST
DATASET_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_DIR = os.path.join(BASE_DIR, "model")
IMG_SIZE = 224
NUM_CLASSES = len(CLASSES_LIST)


class PlantDiseaseMobileNet(nn.Module):
    """
    Champion Model Architecture:
    MobileNetV2 backbone pretrained on ImageNet + custom classification head with dropout.
    """
    def __init__(self, num_classes=38, dropout_rate=0.35):
        super(PlantDiseaseMobileNet, self).__init__()
        try:
            weights = models.MobileNet_V2_Weights.DEFAULT
            self.backbone = models.mobilenet_v2(weights=weights)
        except Exception as e:
            print(f"[Warning] Loading ImageNet weights with fallback: {e}")
            self.backbone = models.mobilenet_v2(weights=None)

        in_features = self.backbone.last_channel
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=dropout_rate),
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(p=dropout_rate * 0.7),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)


def get_transforms():
    """Augmentation pipeline with spatial, rotation, and color-jitter perturbations."""
    train_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(degrees=20),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    return train_transform, val_transform


def train(warmup_epochs=4, finetune_epochs=6, batch_size=16, lr_head=1e-3, lr_backbone=1e-4, dropout=0.35, output_model="model/plant_disease_cnn.pth"):
    # Detect Apple Silicon MPS (Metal GPU) or CUDA or fallback to CPU
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print("[Hardware] Utilizing Apple Silicon Metal Performance Shaders (MPS GPU)")
    elif torch.cuda.is_available():
        device = torch.device("cuda")
        print("[Hardware] Utilizing NVIDIA CUDA GPU")
    else:
        device = torch.device("cpu")
        print("[Hardware] Utilizing multi-core CPU")

    train_dir = os.path.join(DATASET_DIR, "train")
    val_dir = os.path.join(DATASET_DIR, "val")

    if not os.path.exists(train_dir):
        print(f"Error: Training dataset not found at {train_dir}. Run model/download_dataset.py first.")
        sys.exit(1)

    train_trans, val_trans = get_transforms()

    train_dataset = datasets.ImageFolder(train_dir, transform=train_trans)
    val_dataset = datasets.ImageFolder(val_dir, transform=val_trans) if os.path.exists(val_dir) else train_dataset

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    dataset_classes = train_dataset.classes
    print(f"[Dataset] Loaded {len(train_dataset)} real leaf training images across {len(dataset_classes)} classes.")
    print(f"[Dataset] Loaded {len(val_dataset)} real leaf validation images.")

    # Save class to index mapping
    class_to_idx = {cls_name: idx for idx, cls_name in enumerate(CLASSES_LIST)}
    with open(os.path.join(MODEL_DIR, "class_indices.json"), "w") as f:
        json.dump(class_to_idx, f, indent=2)

    # Initialize model with pretrained ImageNet weights
    model = PlantDiseaseMobileNet(num_classes=NUM_CLASSES, dropout_rate=dropout).to(device)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.08)

    # Map dataset folder indices to global 38-class index
    folder_to_global = [CLASSES_LIST.index(c) if c in CLASSES_LIST else 0 for c in dataset_classes]
    folder_to_global_tensor = torch.tensor(folder_to_global, dtype=torch.long).to(device)

    best_val_acc = 0.0
    metrics_history = []
    os.makedirs(os.path.dirname(output_model), exist_ok=True)

    # =========================================================================
    # STAGE 1: Classifier Warmup (Backbone Features Frozen)
    # =========================================================================
    print("\n" + "=" * 80)
    print(f"STAGE 1: Classifier Head Warmup ({warmup_epochs} Epochs with Frozen ImageNet Backbone)")
    print("=" * 80)
    print(f"{'Epoch':<8} {'Phase':<12} {'Train Loss':<12} {'Train Acc':<12} {'Val Loss':<12} {'Val Acc':<12} {'Time':<8}")
    print("-" * 80)

    for p in model.backbone.features.parameters():
        p.requires_grad = False

    optimizer_warmup = optim.AdamW(model.backbone.classifier.parameters(), lr=lr_head, weight_decay=1e-4)

    for epoch in range(1, warmup_epochs + 1):
        t0 = time.perf_counter()
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images = images.to(device)
            target_labels = folder_to_global_tensor[labels.to(device)]

            optimizer_warmup.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, target_labels)
            loss.backward()
            optimizer_warmup.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == target_labels).item()
            total_train += images.size(0)

        epoch_train_loss = running_loss / max(total_train, 1)
        epoch_train_acc = (correct_train / max(total_train, 1)) * 100.0

        # Validation
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                target_labels = folder_to_global_tensor[labels.to(device)]
                outputs = model(images)
                loss = criterion(outputs, target_labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == target_labels).item()
                total_val += images.size(0)

        epoch_val_loss = val_loss / max(total_val, 1)
        epoch_val_acc = (correct_val / max(total_val, 1)) * 100.0
        elapsed_sec = round(time.perf_counter() - t0, 1)

        saved_flag = ""
        if epoch_val_acc >= best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), output_model)
            saved_flag = " ★ [BEST]"

        metrics_history.append({
            "stage": "warmup",
            "epoch": epoch,
            "train_loss": round(epoch_train_loss, 4),
            "train_acc": round(epoch_train_acc, 2),
            "val_loss": round(epoch_val_loss, 4),
            "val_acc": round(epoch_val_acc, 2)
        })

        print(f"{epoch:<8} {'Warmup':<12} {epoch_train_loss:<12.4f} {epoch_train_acc:<11.1f}% {epoch_val_loss:<12.4f} {epoch_val_acc:<11.1f}% {elapsed_sec:<6}s{saved_flag}")

    # =========================================================================
    # STAGE 2: Progressive Fine-Tuning with Differential Learning Rates
    # =========================================================================
    print("\n" + "=" * 80)
    print(f"STAGE 2: Progressive Fine-Tuning ({finetune_epochs} Epochs with Differential LR & Cosine Decay)")
    print("=" * 80)
    print(f"{'Epoch':<8} {'Phase':<12} {'Train Loss':<12} {'Train Acc':<12} {'Val Loss':<12} {'Val Acc':<12} {'Time':<8}")
    print("-" * 80)

    for p in model.backbone.features.parameters():
        p.requires_grad = True

    optimizer_ft = optim.AdamW([
        {'params': model.backbone.features.parameters(), 'lr': lr_backbone},
        {'params': model.backbone.classifier.parameters(), 'lr': lr_head * 0.5}
    ], weight_decay=1e-4)

    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer_ft, T_max=finetune_epochs, eta_min=1e-6)

    for epoch in range(1, finetune_epochs + 1):
        t0 = time.perf_counter()
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images = images.to(device)
            target_labels = folder_to_global_tensor[labels.to(device)]

            optimizer_ft.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, target_labels)
            loss.backward()
            optimizer_ft.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == target_labels).item()
            total_train += images.size(0)

        scheduler.step()
        epoch_train_loss = running_loss / max(total_train, 1)
        epoch_train_acc = (correct_train / max(total_train, 1)) * 100.0

        # Validation
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                target_labels = folder_to_global_tensor[labels.to(device)]
                outputs = model(images)
                loss = criterion(outputs, target_labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == target_labels).item()
                total_val += images.size(0)

        epoch_val_loss = val_loss / max(total_val, 1)
        epoch_val_acc = (correct_val / max(total_val, 1)) * 100.0
        elapsed_sec = round(time.perf_counter() - t0, 1)

        saved_flag = ""
        if epoch_val_acc >= best_val_acc:
            best_val_acc = epoch_val_acc
            torch.save(model.state_dict(), output_model)
            saved_flag = " ★ [BEST]"

        total_epoch_num = warmup_epochs + epoch
        metrics_history.append({
            "stage": "finetune",
            "epoch": total_epoch_num,
            "train_loss": round(epoch_train_loss, 4),
            "train_acc": round(epoch_train_acc, 2),
            "val_loss": round(epoch_val_loss, 4),
            "val_acc": round(epoch_val_acc, 2)
        })

        print(f"{total_epoch_num:<8} {'FineTune':<12} {epoch_train_loss:<12.4f} {epoch_train_acc:<11.1f}% {epoch_val_loss:<12.4f} {epoch_val_acc:<11.1f}% {elapsed_sec:<6}s{saved_flag}")

    # Save training history metrics
    metrics_path = os.path.join(MODEL_DIR, "training_metrics.json")
    with open(metrics_path, "w") as f:
        json.dump({
            "best_val_acc": round(best_val_acc, 2),
            "warmup_epochs": warmup_epochs,
            "finetune_epochs": finetune_epochs,
            "history": metrics_history
        }, f, indent=2)

    print("=" * 80)
    print(f"\n[Result] Two-Stage Training Complete! Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"[Checkpoints] Saved champion CNN weights to: {output_model}")
    print(f"[Metrics] Saved training curves to: {metrics_path}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train CNN on real leaf images with two-stage transfer learning")
    parser.add_argument("--epochs", type=int, default=None, help="Total epochs (auto-splits into warmup & finetune)")
    parser.add_argument("--warmup-epochs", type=int, default=4, help="Warmup epochs with frozen backbone")
    parser.add_argument("--finetune-epochs", type=int, default=6, help="Fine-tuning epochs with unfreezing")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--lr", type=float, default=None, help="Base learning rate")
    parser.add_argument("--lr-head", type=float, default=1e-3, help="Classifier head learning rate")
    parser.add_argument("--lr-backbone", type=float, default=1e-4, help="Backbone feature learning rate")
    parser.add_argument("--dropout", type=float, default=0.35, help="Dropout")
    parser.add_argument("--output", type=str, default="model/plant_disease_cnn.pth", help="Output model path")
    args = parser.parse_args()

    warmup = args.warmup_epochs
    finetune = args.finetune_epochs
    if args.epochs is not None:
        warmup = max(1, args.epochs // 3)
        finetune = max(1, args.epochs - warmup)

    lr_head = args.lr_head if args.lr is None else args.lr
    lr_backbone = args.lr_backbone if args.lr is None else args.lr * 0.3

    train(
        warmup_epochs=warmup,
        finetune_epochs=finetune,
        batch_size=args.batch_size,
        lr_head=lr_head,
        lr_backbone=lr_backbone,
        dropout=args.dropout,
        output_model=args.output
    )
