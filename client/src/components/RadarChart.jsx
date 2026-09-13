import React from 'react';

export default function RadarChart({
  size = 180,
  data = [
    { label: 'Programming', value: 92 },
    { label: 'Problem Solving', value: 88 },
    { label: 'Projects', value: 95 },
    { label: 'Domain Knowledge', value: 80 },
    { label: 'Communication', value: 78 }
  ]
}) {
  const centerX = size / 2;
  const centerY = size / 2;
  const maxRadius = (size / 2) - 32;
  const numPoints = data.length;

  const getCoordinates = (index, value) => {
    const angle = (index / numPoints) * 2 * Math.PI - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Polygon path points for student scores
  const polygonPoints = data.map((d, i) => {
    const { x, y } = getCoordinates(i, d.value);
    return `${x},${y}`;
  }).join(' ');

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Grid Concentric Polygons */}
        {rings.map((ring, rIdx) => {
          const ringPoints = data.map((_, i) => {
            const { x, y } = getCoordinates(i, ring * 100);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={`ring-${rIdx}`}
              points={ringPoints}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={`axis-${i}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#E2E8F0"
              strokeWidth="1"
            />
          );
        })}

        {/* Filled Student Polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(79, 70, 229, 0.25)"
          stroke="#4F46E5"
          strokeWidth="2"
        />

        {/* Vertex points */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.value);
          return (
            <circle
              key={`pt-${i}`}
              cx={x}
              cy={y}
              r="3.5"
              fill="#4F46E5"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = (i / numPoints) * 2 * Math.PI - Math.PI / 2;
          const labelRadius = maxRadius + 18;
          const lx = centerX + labelRadius * Math.cos(angle);
          const ly = centerY + labelRadius * Math.sin(angle);

          let anchor = 'middle';
          if (Math.cos(angle) > 0.3) anchor = 'start';
          else if (Math.cos(angle) < -0.3) anchor = 'end';

          return (
            <text
              key={`lbl-${i}`}
              x={lx}
              y={ly + 3}
              textAnchor={anchor}
              fontSize="7.5"
              fontWeight="600"
              fill="#64748B"
              fontFamily="inherit"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
