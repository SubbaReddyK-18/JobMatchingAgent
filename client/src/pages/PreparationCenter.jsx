import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Code,
  Layers,
  Clock,
  ArrowRight
} from 'lucide-react';
import RadialGauge from '../components/RadialGauge';
import DonutChart from '../components/DonutChart';
import SkillCompanyGraph from '../components/SkillCompanyGraph';

export default function PreparationCenter({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skill_gaps');

  useEffect(() => {
    async function loadPrep() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/preparation/summary', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Error fetching preparation data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrep();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading Preparation Intelligence...
      </div>
    );
  }

  const readinessScore = data?.readiness?.overall_readiness_score || 82;
  const metrics = data?.metrics || { overall_readiness: 82, skills_to_improve: 8, high_priority_skills: 6, recommended_resources: 12 };
  const topGaps = data?.top_skill_gaps || [];

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            Preparation <span style={{ color: '#4F46E5' }}>Center</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Bridge your skill gaps with personalized learning paths based on real institutional opportunities.
          </p>
        </div>

        <div className="font-script" style={{ color: '#4F46E5', fontSize: '1.25rem' }}>
          Learn • Practice • Grow • Succeed
        </div>
      </div>

      {/* 4 Top Metric Cards (Page 5 Bottom) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        {/* Metric 1 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <RadialGauge value={readinessScore} size={72} strokeWidth={7} color="#10B981" />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Overall Readiness</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>You're on the right track!</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>↑ 6% from last month</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FDF2F8', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.skills_to_improve}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Skills to Improve</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Across 18 opportunities</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.high_priority_skills}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>High Priority</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Skills needed soon</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.recommended_resources}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Learning Resources</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Recommended for you</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('skill_gaps')}
          className={`btn btn-sm ${activeTab === 'skill_gaps' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Skill Gaps</span>
        </button>
        <button
          onClick={() => setActiveTab('role_prep')}
          className={`btn btn-sm ${activeTab === 'role_prep' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Role-wise Preparation</span>
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`btn btn-sm ${activeTab === 'resources' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Learning Resources</span>
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`btn btn-sm ${activeTab === 'progress' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Progress Tracking</span>
        </button>
      </div>

      {/* Center 2 Columns: Top Skill Gaps vs Demand Donut & Skill-Company Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
        {/* Left: Your Top Skill Gaps */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Your Top Skill Gaps</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748B' }}>These skills are required in multiple opportunities you are eligible for.</p>
            </div>
            <span style={{ fontSize: '0.71875rem', color: '#64748B', fontWeight: 600 }}>Sort by: Relevance</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topGaps.map((gap, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>{gap.skill}</span>
                    <span className="badge badge-amber" style={{ fontSize: '0.625rem' }}>{gap.urgency}</span>
                  </div>
                  <div style={{ fontSize: '0.71875rem', color: '#64748B', marginTop: '3px' }}>
                    Required in {gap.required_in_count} opportunities • {gap.learning_time}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {gap.companies.map((c, cIdx) => (
                      <span key={cIdx} className="badge badge-blue" style={{ fontSize: '0.625rem' }}>
                        {c.name}
                      </span>
                    ))}
                    {gap.remaining_companies_count > 0 && (
                      <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>
                        +{gap.remaining_companies_count}
                      </span>
                    )}
                  </div>

                  <button
                    style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    <span>View</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skill Demand Donut + Interactive Skill-Company Graph */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Skill Demand Across Opportunities */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Skill Demand Across Opportunities</h4>
                <p style={{ fontSize: '0.71875rem', color: '#64748B' }}>Which skill categories are most in demand in your pool</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
              <DonutChart
                size={120}
                strokeWidth={12}
                totalCount={18}
                totalLabel="Opportunities"
                showLegend={true}
                data={data?.skill_demand_distribution?.map(d => ({ label: `${d.category} (${d.percentage}%)`, count: d.percentage, color: d.color })) || []}
              />
            </div>
          </div>

          {/* Interactive Skill-Company Graph */}
          <SkillCompanyGraph initialSkill="Docker" />
        </div>
      </div>

      {/* Bottom Row: Recommended Learning Path + Learning Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Recommended Learning Path */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>Recommended Learning Path</h3>
              <p style={{ fontSize: '0.71875rem', color: '#64748B' }}>A personalized path to improve your high-priority skills.</p>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#4F46E5', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              View Full Path →
            </button>
          </div>

          {/* Stepper Roadmap */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            {[
              { step: 1, title: 'Docker Basics', time: '2 weeks' },
              { step: 2, title: 'Container Deployment', time: '2 weeks' },
              { step: 3, title: 'AWS Fundamentals', time: '3 weeks' },
              { step: 4, title: 'System Design Essentials', time: '3 weeks' },
              { step: 5, title: 'Mock Interviews', time: '2 weeks' }
            ].map((st, sIdx) => (
              <React.Fragment key={st.step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: st.step === 1 ? '#4F46E5' : '#EEF2FF',
                    color: st.step === 1 ? 'white' : '#4F46E5',
                    fontWeight: 800,
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #C7D2FE'
                  }}>
                    {st.step}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A', marginTop: '6px', maxWidth: '80px' }}>
                    {st.title}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: '#64748B', marginTop: '2px' }}>
                    {st.time}
                  </div>
                </div>

                {sIdx < 4 && (
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#E2E8F0', margin: '0 4px', marginBottom: '28px' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Your Learning Progress */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Your Learning Progress</h3>
            <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700, cursor: 'pointer' }}>View Progress →</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            {(data?.learning_progress || [
              { skill: 'Python', percentage: 70, color: '#10B981' },
              { skill: 'SQL', percentage: 60, color: '#3B82F6' },
              { skill: 'System Design', percentage: 40, color: '#8B5CF6' },
              { skill: 'AWS', percentage: 30, color: '#F59E0B' }
            ]).map((lp, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <RadialGauge value={lp.percentage} size={64} strokeWidth={6} color={lp.color} />
                <span style={{ fontSize: '0.71875rem', fontWeight: 700, color: '#334155', marginTop: '6px' }}>{lp.skill}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-script" style={{ color: '#4F46E5', fontSize: '0.9375rem' }}>
              "A more skilled you means a brighter tomorrow."
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
