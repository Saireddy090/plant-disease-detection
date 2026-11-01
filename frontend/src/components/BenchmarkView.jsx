import React from 'react';

export default function BenchmarkView({ benchmarks }) {
  return (
    <div className="glass-card" style={{ marginTop: '2rem' }}>
      <div className="card-heading">
        <div>
          <span>CNN Architecture Benchmarks & Hyperparameter Tuning</span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.2rem' }}>
            Tuning Learning Rate, Batch Size, and Dropout across 38 PlantVillage Classes (54,306 Images)
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 6, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-primary)', fontWeight: 700 }}>
          ★ Champion: 94.25% Test Acc
        </span>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Backbone Architecture</th>
              <th>Learning Rate</th>
              <th>Batch Size</th>
              <th>Dropout</th>
              <th>Val Accuracy</th>
              <th>Test Accuracy</th>
              <th>Macro F1</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((b) => {
              const isChamp = b.is_champion === 1;
              return (
                <tr key={b.id || b.model_name} style={{ background: isChamp ? 'rgba(16, 185, 129, 0.05)' : 'transparent' }}>
                  <td style={{ fontWeight: 700, color: isChamp ? 'var(--emerald-primary)' : 'var(--text-primary)' }}>
                    {b.model_name}
                  </td>
                  <td>{b.backbone}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{b.learning_rate}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{b.batch_size}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{b.dropout_rate}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {(b.val_accuracy * 100).toFixed(2)}%
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isChamp ? 'var(--emerald-primary)' : 'var(--text-primary)' }}>
                    {(b.test_accuracy * 100).toFixed(2)}%
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{b.f1_score.toFixed(4)}</td>
                  <td>
                    {isChamp ? (
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: 999, background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-primary)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                        ★ CHAMPION
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Baseline</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
