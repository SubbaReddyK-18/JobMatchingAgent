import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  Share2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  Code,
  FileCode,
  Check
} from 'lucide-react';
import RadialGauge from '../components/RadialGauge';
import confetti from 'canvas-confetti';

export default function OpportunityDetails({ jobId, onBack, onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('match_overview');
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    async function loadDeepDive() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch(`/api/matching/opportunity-deep-dive/${jobId || 'job_google_swe'}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
          if (resData.job.has_applied) setApplied(true);
        }
      } catch (err) {
        console.error('Error fetching opportunity deep dive:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeepDive();
  }, [jobId]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('jobmatch_token');
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_opening_id: jobId || 'job_google_swe' })
      });
      if (res.ok) {
        setApplied(true);
        try {
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error applying:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Synthesizing Agent 50 multi-factor match intelligence...
      </div>
    );
  }

  const job = data?.job || {};
  const match = data?.match_analysis || {};
  const compScores = match.component_scores || { skill_match: 92, project_relevance: 96, role_interest_fit: 90, location_fit: 100 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#4F46E5', fontWeight: 700, fontSize: '0.84375rem', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Matches</span>
        </button>
      </div>

      {/* Main Job Banner Card */}
      <div className="card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px',
              flexShrink: 0
            }}>
              <img src={job.company_logo} alt={job.company_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{job.title}</h1>
                <span className="badge badge-green">Eligible ✓</span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontWeight: 700, color: '#334155' }}>{job.company_name}</span>
                <span>•</span>
                <span>{job.role_type}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={13} /> {job.location}</span>
                <span>•</span>
                <span style={{ fontWeight: 700, color: '#059669' }}>{job.ctc_display}</span>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                <span className="badge badge-blue">Software Development</span>
                <span className="badge badge-purple">Backend</span>
                <span className="badge badge-blue">Cloud</span>
                <span className="badge badge-gray">Engineering</span>
              </div>
            </div>
          </div>

          {/* Right Top Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="btn btn-outline btn-sm" style={{ padding: '8px' }}>
                <Bookmark size={16} />
              </button>

              <button
                onClick={handleApply}
                disabled={applied || applying}
                className={`btn btn-lg ${applied ? 'btn-secondary' : 'btn-primary'}`}
                style={{ borderRadius: '10px', padding: '10px 24px' }}
              >
                <span>{applied ? 'Application Submitted ✓' : applying ? 'Applying...' : 'Apply Now →'}</span>
              </button>
            </div>

            <div style={{ fontSize: '0.71875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              <span>Application deadline: 25 Sep 2026</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #F1F5F9', marginTop: '20px', paddingTop: '14px', fontSize: '0.84375rem', fontWeight: 600 }}>
          <span
            onClick={() => setActiveTab('match_overview')}
            style={{ color: activeTab === 'match_overview' ? '#4F46E5' : '#64748B', borderBottom: activeTab === 'match_overview' ? '2px solid #4F46E5' : 'none', paddingBottom: '6px', cursor: 'pointer' }}
          >
            Match Overview
          </span>
          <span
            onClick={() => setActiveTab('job_details')}
            style={{ color: activeTab === 'job_details' ? '#4F46E5' : '#64748B', borderBottom: activeTab === 'job_details' ? '2px solid #4F46E5' : 'none', paddingBottom: '6px', cursor: 'pointer' }}
          >
            Job Details
          </span>
          <span
            onClick={() => setActiveTab('eligibility')}
            style={{ color: activeTab === 'eligibility' ? '#4F46E5' : '#64748B', borderBottom: activeTab === 'eligibility' ? '2px solid #4F46E5' : 'none', paddingBottom: '6px', cursor: 'pointer' }}
          >
            Eligibility
          </span>
          <span
            onClick={() => setActiveTab('skills')}
            style={{ color: activeTab === 'skills' ? '#4F46E5' : '#64748B', borderBottom: activeTab === 'skills' ? '2px solid #4F46E5' : 'none', paddingBottom: '6px', cursor: 'pointer' }}
          >
            Required & Preferred Skills
          </span>
          <span
            onClick={() => setActiveTab('company')}
            style={{ color: activeTab === 'company' ? '#4F46E5' : '#64748B', borderBottom: activeTab === 'company' ? '2px solid #4F46E5' : 'none', paddingBottom: '6px', cursor: 'pointer' }}
          >
            Company Insights
          </span>
        </div>
      </div>

      {/* Your Match Score Component Breakdown (Page 4 Core Feature) */}
      <div className="card" style={{ padding: '24px 28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#4F46E5" />
              Your Match Score
            </h3>
            <p style={{ fontSize: '0.78125rem', color: '#64748B', marginTop: '2px' }}>
              A holistic evaluation based on your profile, skills, interests and past outcomes.
            </p>
          </div>

          <div className="font-script" style={{ color: '#4F46E5', fontSize: '1.25rem' }}>
            Great Fit! Keep Going! →
          </div>
        </div>

        {/* 5 Circular/Radial Gauges in a Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '24px' }}>
          {/* Main Overall Match */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid #F1F5F9', paddingRight: '16px' }}>
            <RadialGauge value={match.overall_match || 94} size={110} strokeWidth={10} color="#10B981" />
            <div style={{ marginTop: '8px', textAlign: 'center' }}>
              <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>★ Top Match</span>
              <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>Overall Match</div>
            </div>
          </div>

          {/* Skill Match */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <RadialGauge value={compScores.skill_match || 92} size={80} strokeWidth={8} color="#06B6D4" />
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>Skill Match</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px', maxWidth: '120px' }}>Your skills align with required stack</div>
          </div>

          {/* Project Relevance */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <RadialGauge value={compScores.project_relevance || 96} size={80} strokeWidth={8} color="#6366F1" />
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>Project Relevance</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px', maxWidth: '120px' }}>Your projects are highly relevant</div>
          </div>

          {/* Role / Interest Fit */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <RadialGauge value={compScores.role_interest_fit || 90} size={80} strokeWidth={8} color="#3B82F6" />
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>Role / Interest Fit</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px', maxWidth: '120px' }}>Matches your career goals</div>
          </div>

          {/* Location Preference */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <RadialGauge value={compScores.location_fit || 100} size={80} strokeWidth={8} color="#F59E0B" />
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A', marginTop: '8px' }}>Location Fit</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px', maxWidth: '120px' }}>Matches your preferred city</div>
          </div>
        </div>

        {/* 3 Columns: Skill Alignment, Relevant Projects, Preparation Gaps */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '24px' }}>
          {/* Skill Alignment Table */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Skill Alignment</h4>
              <div style={{ display: 'flex', gap: '6px', fontSize: '0.625rem' }}>
                <span style={{ color: '#10B981', fontWeight: 600 }}>• Strong</span>
                <span style={{ color: '#F59E0B', fontWeight: 600 }}>• Partial</span>
                <span style={{ color: '#EF4444', fontWeight: 600 }}>• Gap</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(match.skill_alignment || [
                { skill: 'Python', level: 'Excellent', status: 'Strong Match' },
                { skill: 'Data Structures', level: 'Excellent', status: 'Strong Match' },
                { skill: 'Algorithms', level: 'Good', status: 'Strong Match' },
                { skill: 'System Design', level: 'Partial', status: 'Partial Match' },
                { skill: 'Distributed Systems', level: 'Partial', status: 'Partial Match' },
                { skill: 'Cloud (GCP)', level: 'Gap', status: 'Gap' },
                { skill: 'CI/CD', level: 'Gap', status: 'Gap' },
                { skill: 'SQL', level: 'Excellent', status: 'Strong Match' }
              ]).map((sk, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78125rem', padding: '4px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{sk.skill}</span>
                  <span style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    color: sk.status === 'Strong Match' ? '#10B981' : sk.status === 'Partial Match' ? '#D97706' : '#DC2626'
                  }}>
                    {sk.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Projects */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
              Relevant Projects
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>E-Commerce Backend System</span>
                  <Check size={14} color="#10B981" />
                </div>
                <p style={{ fontSize: '0.71875rem', color: '#64748B', marginTop: '4px' }}>
                  Built scalable backend with Flask, PostgreSQL & Docker.
                </p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>Python</span>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>Flask</span>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>PostgreSQL</span>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>Docker</span>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>Real-time Chat Application</span>
                  <Check size={14} color="#10B981" />
                </div>
                <p style={{ fontSize: '0.71875rem', color: '#64748B', marginTop: '4px' }}>
                  Developed real-time chat app using WebSockets and deployed on AWS.
                </p>
                <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>Node.js</span>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>WebSockets</span>
                  <span className="badge badge-gray" style={{ fontSize: '0.625rem' }}>AWS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Gaps */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
              Preparation Gaps
            </h4>
            <p style={{ fontSize: '0.71875rem', color: '#64748B', marginBottom: '12px' }}>
              Focus on these skills to strengthen your profile for this opening.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400E' }}>Cloud (GCP)</span>
                  <span className="badge badge-red" style={{ fontSize: '0.625rem' }}>High Impact</span>
                </div>
                <p style={{ fontSize: '0.6875rem', color: '#B45309', marginTop: '4px' }}>
                  Learn GCP fundamentals and deployment workflows.
                </p>
              </div>

              <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#92400E' }}>CI/CD Pipelines</span>
                  <span className="badge badge-red" style={{ fontSize: '0.625rem' }}>High Impact</span>
                </div>
                <p style={{ fontSize: '0.6875rem', color: '#B45309', marginTop: '4px' }}>
                  Practice GitHub Actions and automated build pipelines.
                </p>
              </div>

              <button
                onClick={() => onNavigate('student-preparation')}
                style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', textAlign: 'left', marginTop: '4px' }}
              >
                Start Learning Path →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Why You Are a Strong Candidate + Alumni Success Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Why Strong Candidate */}
        <div className="card">
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="#4F46E5" />
            Why You Are a Strong Candidate
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(match.why_strong_candidate || [
              'Strong programming skills in Python and problem solving',
              'Relevant project experience in backend development',
              'Good alignment with the role and your career interests',
              'Preferred location matches your choice',
              'Your profile matches the characteristics of past successful candidates'
            ]).map((reason, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alumni & Success Insights */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px' }}>
          <RadialGauge value={78} size={90} strokeWidth={8} color="#3B82F6" label="Interview Conversion" />

          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>Alumni & Success Insights</h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
              Students with a similar profile have a 78% interview conversion rate for this role.
            </p>
            <div style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', fontSize: '0.75rem', color: '#065F46', fontWeight: 700 }}>
              🚀 1.4x more likely to be shortlisted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
