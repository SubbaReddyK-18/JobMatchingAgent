import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  ChevronRight,
  UserCheck,
  Calendar,
  Lock,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import RadialGauge from '../components/RadialGauge';
import { useAuth } from '../context/AuthContext';

export default function TPCandidateRanking({ defaultJobId = 'job_google_swe' }) {
  const { user } = useAuth();
  const isHOD = user?.role === 'HOD';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(defaultJobId);
  const [candidateData, setCandidateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shortlistedMap, setShortlistedMap] = useState({});

  useEffect(() => {
    async function loadJobsList() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/jobs', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    }
    loadJobsList();
  }, []);

  useEffect(() => {
    async function loadRankedCandidates() {
      setLoading(true);
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch(`/api/matching/job-candidates/${selectedJobId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setCandidateData(data);
        }
      } catch (err) {
        console.error('Error ranking candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    if (selectedJobId) {
      loadRankedCandidates();
    }
  }, [selectedJobId]);

  const handleShortlist = (studentId) => {
    if (isHOD) return;
    setShortlistedMap(prev => ({ ...prev, [studentId]: true }));
  };

  const candidates = candidateData?.candidates || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
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
              Candidate Matching & Ranking
            </h1>
            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} />
              <span>Agent 50 Engine</span>
            </span>
            {isHOD && (
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} />
                <span>Read-Only</span>
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Instantly rank eligible student candidates using multi-factor technical and placement signals.
          </p>
        </div>

        {/* Job Opening Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>Select Opening:</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="form-input"
            style={{ width: '280px', fontWeight: 700, color: '#4F46E5', backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' }}
          >
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.company_name} - {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Students Evaluated</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
            {candidateData?.total_students_evaluated || 8}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Eligible Candidates</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '4px' }}>
            {candidateData?.eligible_candidates_count || 6}
          </div>
        </div>

        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Top Candidate Match Score</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4F46E5', marginTop: '4px' }}>
            {candidates[0]?.overall_match || 94}%
          </div>
        </div>
      </div>

      {/* Candidates Ranked Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            Ranking candidates with Agent 50 algorithm...
          </div>
        ) : (
          candidates.map((cand, idx) => {
            const std = cand.student;
            const isTopRanked = idx === 0;
            const isShortlisted = !!shortlistedMap[std.id];

            return (
              <div
                key={std.id}
                className="card"
                style={{
                  padding: '22px 26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  border: isTopRanked ? '2px solid #818CF8' : '1px solid #E2E8F0',
                  backgroundColor: !cand.is_eligible ? '#F8FAFC' : '#FFFFFF',
                  opacity: !cand.is_eligible ? 0.75 : 1
                }}
              >
                {/* Left: Rank & Avatar & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isTopRanked ? '#4F46E5' : '#F1F5F9',
                    color: isTopRanked ? 'white' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    #{idx + 1}
                  </div>

                  <img
                    src={std.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={std.full_name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #EEF2FF' }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>{std.full_name}</h3>
                      <span className="badge badge-purple">{std.branch}</span>
                      <span className="badge badge-gray">CGPA {std.cgpa}</span>
                      {!cand.is_eligible && <span className="badge badge-red">Ineligible</span>}
                    </div>

                    <div style={{ fontSize: '0.78125rem', color: '#64748B', marginTop: '3px' }}>
                      USN: {std.usn} • Class of {std.graduation_year} • Readiness: {cand.readiness_score}%
                    </div>

                    {/* Verified Skills */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {(cand.skills || []).slice(0, 5).map((sk, sIdx) => (
                        <span key={sIdx} className="badge badge-blue" style={{ fontSize: '0.625rem' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Center: Match Gauge & Multi-factor reasoning */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '280px' }}>
                  <RadialGauge
                    value={cand.overall_match}
                    size={76}
                    strokeWidth={7}
                    color="auto"
                    label="Match"
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.71875rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>
                      Agent 50 Reasoning:
                    </div>
                    {(cand.why_strong_candidate || []).slice(0, 2).map((r, rIdx) => (
                      <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#334155' }}>
                        <CheckCircle2 size={12} color="#10B981" style={{ flexShrink: 0 }} />
                        <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r}</span>
                      </div>
                    ))}
                    {!cand.is_eligible && (
                      <div style={{ color: '#EF4444', fontWeight: 600 }}>
                        {(cand.eligibility_reasons || [])[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Shortlist Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '120px' }}>
                  {!isHOD ? (
                    <button
                      onClick={() => handleShortlist(std.id)}
                      disabled={isShortlisted || !cand.is_eligible}
                      className={`btn btn-sm ${isShortlisted ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ width: '100%' }}
                    >
                      <UserCheck size={14} />
                      <span>{isShortlisted ? 'Shortlisted ✓' : 'Shortlist Candidate'}</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Read Only</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
