import React from 'react';

export default function DonutChart({
  data = [],
  totalLabel = 'Total',
  totalCount = null,
  size = 140,
  strokeWidth = 14,
  showLegend = true
}) {
  const calculatedTotal = data.reduce((acc, curr) => acc + (curr.count || curr.value || 0), 0);
  const total = totalCount !== null ? totalCount : calculatedTotal;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const val = item.count || item.value || 0;
    const pct = total > 0 ? val / total : 0;
    const strokeDasharray = `${pct * circumference} ${circumference}`;
    const strokeDashoffset = -currentAngle * circumference;
    currentAngle += pct;

    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      color: item.color || ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444'][index % 5]
    };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Base empty track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Segments */}
          {segments.map((seg, idx) => (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              style={{ transition: 'all 0.6s ease' }}
            />
          ))}
        </svg>
        {/* Center Text */}
        <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
            {total}
          </span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>
            {totalLabel}
          </span>
        </div>
      </div>

      {showLegend && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
          {data.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color || segments[idx]?.color, flexShrink: 0 }} />
              <span style={{ color: '#64748B', minWidth: '18px', fontWeight: 700 }}>
                {item.count || item.value}
              </span>
              <span style={{ color: '#334155', fontWeight: 500 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
