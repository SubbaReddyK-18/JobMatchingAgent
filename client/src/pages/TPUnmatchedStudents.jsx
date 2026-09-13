import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  BookOpen,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import DonutChart from '../components/DonutChart';
import RadialGauge from '../components/RadialGauge';

export default function TPUnmatchedStudents({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUnmatched() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/matching/unmatched-students', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Error fetching unmatched students:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUnmatched();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Analyzing unmatched student cohort bottlenecks...
      </div>
    );
  }

  const students = data?.students || [];
  const bottlenecks = data?.bottlenecks_distribution || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Unmatched Student Intelligence
            </h1>
            <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={12} />
              <span>Attention Required</span>
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Identify students with limited opportunity fit, analyze root causes, and prescribe corrective interventions.
          </p>
        </div>

        <div className="font-script" style={{ color: '#F59E0B', fontSize: '1.25rem' }}>
          "No student left behind."
        </div>
      </div>

      {/* Top Row: Bottleneck Composition Visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Bottleneck Factors Donut & Breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
            Root Cause Bottleneck Analysis
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px' }}>
            Why are these students not matching with current company opportunities?
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <DonutChart
              size={130}
              strokeWidth={14}
              totalCount={data?.total_unmatched_or_at_risk || 3}
              totalLabel="At-Risk"
              showLegend={true}
              data={[
                { label: 'Cloud/DevOps Skill Gap (40%)', count: 6, color: '#3B82F6' },
                { label: 'CGPA Cutoff < 7.5 (27%)', count: 4, color: '#F59E0B' },
                { label: 'Lack of Projects (20%)', count: 3, color: '#EC4899' },
                { label: 'Location Constraint (13%)', count: 2, color: '#8B5CF6' }
              ]}
            />
          </div>
        </div>

        {/* Action Strategy Card */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#B45309" />
            Prescribed Interventions
          </h3>
          <p style={{ fontSize: '0.78125rem', color: '#B45309', marginBottom: '16px' }}>
            Agent 50 automatic institutional recommendations:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8125rem', color: '#78350F' }}>
              <CheckCircle2 size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Enroll students in 2-week Docker & AWS Hands-on Bootcamp.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8125rem', color: '#78350F' }}>
              <CheckCircle2 size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Schedule 1-on-1 technical mock interview with Alumni Mentors.</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8125rem', color: '#78350F' }}>
              <CheckCircle2 size={16} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>Advise portfolio project additions in Full-Stack and Cloud deployment.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unmatched / At-Risk Students Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
          Students Requiring Placement Intervention ({students.length})
        </h3>

        {students.map((rep, idx) => {
          const s = rep.student;

          return (
            <div
              key={s.id}
              className="card"
              style={{
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '24px',
                border: '1.5px solid #FDE68A',
                backgroundColor: '#FFFFFF'
              }}
            >
              {/* Left: Student Info */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: '240px' }}>
                <img
                  src={s.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'}
                  alt={s.full_name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FDE68A' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>{s.full_name}</h4>
                    <span className="badge badge-amber">{s.branch}</span>
                  </div>
                  <div style={{ fontSize: '0.78125rem', color: '#64748B', marginTop: '2px' }}>
                    USN: {s.usn} • CGPA: {s.cgpa}
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: '#DC2626', fontWeight: 700, marginTop: '4px' }}>
                    {rep.eligible_opportunities_count} eligible opportunities found
                  </div>
                </div>
              </div>

              {/* Center: Contributing Factors */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78125rem', fontWeight: 800, color: '#92400E', marginBottom: '6px' }}>
                  Contributing Factors:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: '#475569' }}>
                  {(rep.contributing_factors || []).map((fact, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#D97706' }}>•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Prescribed Intervention Action */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', minWidth: '180px' }}>
                <RadialGauge value={rep.readiness_score} size={64} strokeWidth={6} color="#F59E0B" label="Readiness" />
                <button
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: '8px', fontSize: '0.75rem', background: '#D97706' }}
                >
                  <span>Assign Skill Plan</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
