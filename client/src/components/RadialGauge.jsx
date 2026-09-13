import React from 'react';

export default function RadialGauge({
  value = 0,
  size = 120,
  strokeWidth = 10,
  color = '#4F46E5',
  bgColor = '#E2E8F0',
  label = '',
  sublabel = '',
  showPercentage = true,
  badge = null
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  // Determine gradient / color based on value if default
  let strokeColor = color;
  if (color === 'auto') {
    if (value >= 85) strokeColor = '#10B981'; // Green
    else if (value >= 70) strokeColor = '#3B82F6'; // Blue
    else if (value >= 50) strokeColor = '#F59E0B'; // Amber
    else strokeColor = '#EF4444'; // Red
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Value Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      {/* Center Label */}
      <div style={{
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        {showPercentage && (
          <span style={{ fontSize: size > 90 ? '1.5rem' : '1.125rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
            {value}%
          </span>
        )}
        {label && (
          <span style={{ fontSize: size > 90 ? '0.75rem' : '0.6875rem', fontWeight: 600, color: '#64748B', marginTop: '2px' }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span style={{ fontSize: '0.625rem', color: '#94A3B8' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
