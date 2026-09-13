import React, { useState, useEffect } from 'react';
import { Network, Sparkles, Building2, ChevronDown } from 'lucide-react';

export default function SkillCompanyGraph({ initialSkill = 'Docker' }) {
  const [selectedSkill, setSelectedSkill] = useState(initialSkill);
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);

  useEffect(() => {
    async function fetchGraph() {
      setLoading(true);
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch(`/api/preparation/skill-network-graph?skill=${encodeURIComponent(selectedSkill)}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setGraphData(data);
        }
      } catch (err) {
        console.error('Error fetching graph data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGraph();
  }, [selectedSkill]);

  const availableSkills = ['Docker', 'AWS', 'System Design'];

  const width = 480;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 105;

  const companies = graphData?.companies || [];
  const nodePositions = companies.map((c, idx) => {
    const angle = (idx / companies.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { ...c, x, y, angle };
  });

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Header with dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Network size={16} color="#4F46E5" />
            Skill–Company Map
          </h4>
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Select a skill to see which companies require it.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            style={{
              appearance: 'none',
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              fontWeight: 700,
              fontSize: '0.8125rem',
              padding: '6px 28px 6px 12px',
              borderRadius: '8px',
              border: '1px solid #C7D2FE',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {availableSkills.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={14} color="#4F46E5" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div style={{ position: 'relative', width: '100%', height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading ? (
          <div style={{ color: '#94A3B8', fontSize: '0.875rem' }}>Loading map...</div>
        ) : (
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
            {/* Background ambient decorative rings */}
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx={centerX} cy={centerY} r={radius * 0.6} fill="none" stroke="#F8FAFC" strokeWidth="1" />

            {/* Connecting Lines */}
            {nodePositions.map((node, i) => (
              <g key={`link-${i}`}>
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={node.x}
                  y2={node.y}
                  stroke={hoveredNode === node.id ? '#4F46E5' : '#CBD5E1'}
                  strokeWidth={hoveredNode === node.id ? '2.5' : '1.5'}
                  strokeDasharray={hoveredNode === node.id ? 'none' : '2 2'}
                  style={{ transition: 'all 0.2s ease' }}
                />
                {/* Flowing animated pulse particle */}
                <circle
                  cx={(centerX + node.x) / 2}
                  cy={(centerY + node.y) / 2}
                  r="2.5"
                  fill="#818CF8"
                />
              </g>
            ))}

            {/* Central Skill Hub Node */}
            <g style={{ cursor: 'pointer' }}>
              <circle
                cx={centerX}
                cy={centerY}
                r="36"
                fill="url(#centerGrad)"
                stroke="#4F46E5"
                strokeWidth="3"
                style={{ filter: 'drop-shadow(0 4px 10px rgba(79, 70, 229, 0.25))' }}
              />
              <text
                x={centerX}
                y={centerY - 4}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="800"
                fontFamily="inherit"
              >
                {graphData?.skill}
              </text>
              <text
                x={centerX}
                y={centerY + 12}
                textAnchor="middle"
                fill="#E0E7FF"
                fontSize="9"
                fontWeight="600"
                fontFamily="inherit"
              >
                {graphData?.total_opportunities} Opportunities
              </text>
            </g>

            {/* Surrounding Company Satellite Nodes */}
            {nodePositions.map((node, i) => {
              const isHovered = hoveredNode === node.id;
              const badgeWidth = 90;
              const badgeHeight = 32;

              return (
                <g
                  key={`node-${i}`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  <rect
                    x={-badgeWidth / 2}
                    y={-badgeHeight / 2}
                    width={badgeWidth}
                    height={badgeHeight}
                    rx="8"
                    fill="#FFFFFF"
                    stroke={isHovered ? '#4F46E5' : '#E2E8F0'}
                    strokeWidth={isHovered ? '2' : '1'}
                    style={{
                      filter: isHovered ? 'drop-shadow(0 6px 12px rgba(79, 70, 229, 0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.04))',
                      transition: 'all 0.15s ease'
                    }}
                  />
                  <text
                    x={0}
                    y={-2}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="inherit"
                  >
                    {node.name}
                  </text>
                  <text
                    x={0}
                    y={10}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="8"
                    fontWeight="500"
                    fontFamily="inherit"
                  >
                    {node.role}
                  </text>
                </g>
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="centerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </div>
  );
}
