#!/usr/bin/env python3
"""
Plant Disease Detection - Deep Learning Model Training Pipeline
Trains MobileNetV2 on authentic PlantVillage real leaf photographs with OpenCV augmentations.
Saves trained weights to model/plant_disease_cnn.pth.
"""

import os
import sys
import time
import json
import argparse
import numpy as np
from PIL import Image

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
        except Exception:
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


def train(epochs=8, batch_size=16, lr=0.0003, dropout=0.35, output_model="model/plant_disease_cnn.pth"):
    # Detect Apple Silicon MPS (Metal GPU) or fallback to CPU
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

    # Initialize model
    model = PlantDiseaseMobileNet(num_classes=NUM_CLASSES, dropout_rate=dropout).to(device)
    criterion = nn.CrossEntropyLoss(label_smoothing=0.08)
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs, eta_min=1e-6)

    # Map dataset folder indices to global 38-class index
    folder_to_global = [CLASSES_LIST.index(c) if c in CLASSES_LIST else 0 for c in dataset_classes]
    folder_to_global_tensor = torch.tensor(folder_to_global, dtype=torch.long).to(device)

    print(f"\nTraining Champion CNN Model ({epochs} Epochs on Real Leaf Photos):")
    print("=" * 80)
    print(f"{'Epoch':<8} {'Train Loss':<14} {'Train Acc':<14} {'Val Loss':<14} {'Val Acc':<14} {'Time':<8}")
    print("-" * 80)

    best_val_acc = 0.0
    os.makedirs(os.path.dirname(output_model), exist_ok=True)

    for epoch in range(1, epochs + 1):
        t0 = time.perf_counter()
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images = images.to(device)
            target_labels = folder_to_global_tensor[labels.to(device)]

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, target_labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == target_labels).item()
            total_train += images.size(0)

        scheduler.step()
        epoch_train_loss = running_loss / max(total_train, 1)
        epoch_train_acc = (correct_train / max(total_train, 1)) * 100.0

        # Validation phase
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

        print(f"{epoch:<8} {epoch_train_loss:<14.4f} {epoch_train_acc:<13.1f}% {epoch_val_loss:<14.4f} {epoch_val_acc:<13.1f}% {elapsed_sec:<6}s{saved_flag}")

    print("=" * 80)
    print(f"\n[Result] Training Complete! Best Validation Accuracy: {best_val_acc:.2f}%")
    print(f"[Checkpoints] Saved champion CNN weights to: {output_model}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train CNN on real leaf images")
    parser.add_argument("--epochs", type=int, default=8, help="Number of epochs")
    parser.add_argument("--batch-size", type=int, default=16, help="Batch size")
    parser.add_argument("--lr", type=float, default=0.0003, help="Learning rate")
    parser.add_argument("--dropout", type=float, default=0.35, help="Dropout")
    parser.add_argument("--output", type=str, default="model/plant_disease_cnn.pth", help="Output model path")
    args = parser.parse_args()

    train(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr, dropout=args.dropout, output_model=args.output)
