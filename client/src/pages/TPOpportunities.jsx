import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle2,
  Lock,
  Eye,
  Search,
  Filter,
  ExternalLink,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TPOpportunities({ onNavigate, onViewCandidates, onSelectJobForCandidates }) {
  const { user } = useAuth();
  const isHOD = user?.role === 'HOD';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [rawJdText, setRawJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    company_name: '',
    title: '',
    role_type: 'Full-time',
    work_mode: 'Hybrid',
    location: '',
    ctc_min: '',
    ctc_max: '',
    min_cgpa: 7.0,
    eligible_branches: ['CSE', 'ISE', 'ECE'],
    required_skills: ['Python', 'Data Structures', 'Algorithms', 'SQL'],
    preferred_skills: ['Docker', 'Cloud (AWS)'],
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    async function loadJobs() {
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
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const handleAnalyzeJD = async () => {
    if (!rawJdText || !rawJdText.trim()) {
      alert('Please paste a job description text to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzedSuccess(false);
    try {
      const token = localStorage.getItem('jobmatch_token');
      const res = await fetch('/api/jobs/analyze-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ raw_text: rawJdText, company_name: formData.company_name })
      });

      if (res.ok) {
        const data = await res.json();
        const s = data.structured;
        setFormData({
          company_name: s.company_name || formData.company_name || '',
          title: s.title || 'Software Development Engineer',
          role_type: s.role_type || 'Full-time',
          work_mode: s.work_mode || 'Hybrid',
          location: s.location || 'Bengaluru, India',
          ctc_min: (s.ctc_min !== null && s.ctc_min !== undefined) ? s.ctc_min : '',
          ctc_max: (s.ctc_max !== null && s.ctc_max !== undefined) ? s.ctc_max : '',
          min_cgpa: s.min_cgpa !== undefined ? s.min_cgpa : 7.0,
          eligible_branches: Array.isArray(s.eligible_branches) && s.eligible_branches.length > 0 ? s.eligible_branches : ['CSE', 'ISE', 'ECE'],
          required_skills: Array.isArray(s.required_skills) && s.required_skills.length > 0 ? s.required_skills : ['Python', 'Java', 'Data Structures', 'Algorithms'],
          preferred_skills: Array.isArray(s.preferred_skills) ? s.preferred_skills : ['Docker', 'Cloud (AWS)'],
          description: rawJdText
        });
        setAnalyzedSuccess(true);
      }
    } catch (err) {
      console.error('Error analyzing JD:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (isHOD) return;

    setSubmitting(true);
    setFeedback('');
    try {
      const token = localStorage.getItem('jobmatch_token');
      const res = await fetch('/api/jobs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create opportunity');

      // Reload
      const reload = await fetch('/api/jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const reData = await reload.json();
      setJobs(reData.jobs || []);
      setShowModal(false);
      setFeedback('New Company Opportunity successfully structured and published!');
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading company opportunities...
      </div>
    );
  }

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
              Events & Opportunities
            </h1>
            {isHOD && (
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} />
                <span>HOD View (Read Only)</span>
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Discover and manage campus placement drives, internships, and company openings.
          </p>
        </div>

        {/* Action Buttons */}
        <div>
          {!isHOD ? (
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              <span>Create Opportunity with AI</span>
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              color: '#92400E',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              <Lock size={13} />
              <span>HOD Mutation Disabled</span>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div style={{ padding: '12px 16px', backgroundColor: '#ECFDF5', color: '#065F46', borderRadius: '10px', fontSize: '0.8125rem' }}>
          {feedback}
        </div>
      )}

      {/* Opportunities List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
        {jobs.map((job) => (
          <div
            key={job.id}
            className="card"
            style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    flexShrink: 0
                  }}>
                    <img src={job.company_logo} alt={job.company_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>{job.title}</h3>
                    <div style={{ fontSize: '0.8125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontWeight: 700, color: '#334155' }}>{job.company_name}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                <span className="badge badge-purple">{job.role_type}</span>
              </div>

              {/* Package & Eligibility */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px', fontSize: '0.8125rem' }}>
                <div style={{ fontWeight: 800, color: '#059669' }}>
                  {job.ctc_display}
                </div>
                <div style={{ color: '#64748B' }}>
                  Min CGPA: <span style={{ fontWeight: 700, color: '#0F172A' }}>{job.min_cgpa}</span>
                </div>
                <div style={{ color: '#64748B' }}>
                  Batches: <span style={{ fontWeight: 700, color: '#0F172A' }}>{(job.eligible_grad_years || []).join(', ')}</span>
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                {(job.required_skills || []).slice(0, 4).map((sk, idx) => (
                  <span key={idx} className="badge badge-blue" style={{ fontSize: '0.6875rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', marginTop: '16px', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} />
                <span>Deadline: {job.deadline_date}</span>
              </div>

              <button
                onClick={() => {
                  const handler = onViewCandidates || onSelectJobForCandidates;
                  if (typeof handler === 'function') {
                    handler(job.id);
                  } else if (typeof onNavigate === 'function') {
                    onNavigate('tp-candidate-ranking');
                  }
                }}
                className="btn btn-primary btn-sm"
              >
                <Sparkles size={13} />
                <span>Rank Candidates</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Opportunity with AI JD Structuring Modal */}
      {showModal && !isHOD && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Create Opportunity with AI JD Analysis</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Paste unstructured job description or enter details</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* AI Paste Section */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
              <label style={{ fontSize: '0.78125rem', fontWeight: 800, color: '#1E1B4B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Bot size={15} color="#4F46E5" />
                <span>Paste Raw Job Description (AI Structuring Engine)</span>
              </label>
              <textarea
                rows={4}
                value={rawJdText}
                onChange={(e) => setRawJdText(e.target.value)}
                placeholder="Paste the company's hiring announcement, email, or JD text here. e.g. 'Google is hiring Software Engineers in Bengaluru for 30-45 LPA, requiring Python, DSA, SQL, Docker with CGPA >= 8.0'..."
                className="form-input"
                style={{ fontSize: '0.8125rem' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleAnalyzeJD}
                  disabled={isAnalyzing}
                  className="btn btn-primary btn-sm"
                >
                  <Sparkles size={14} />
                  <span>{isAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI'}</span>
                </button>

                {analyzedSuccess && (
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} />
                    <span>Structured successfully by AI!</span>
                  </span>
                )}
              </div>
            </div>

            {/* Structured Form */}
            <form onSubmit={handleCreateOpportunity} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Company Name</label>
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Role Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Min CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 18 (or specify)"
                    value={formData.ctc_min}
                    onChange={(e) => setFormData({ ...formData, ctc_min: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Max CTC (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 32 (or specify)"
                    value={formData.ctc_max}
                    onChange={(e) => setFormData({ ...formData, ctc_max: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Min CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formData.min_cgpa}
                    onChange={(e) => setFormData({ ...formData, min_cgpa: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Eligible Branches (comma separated)</label>
                  <input
                    type="text"
                    value={formData.eligible_branches.join(', ')}
                    onChange={(e) => setFormData({ ...formData, eligible_branches: e.target.value.split(',').map(b => b.trim()) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.required_skills.join(', ')}
                  onChange={(e) => setFormData({ ...formData, required_skills: e.target.value.split(',').map(s => s.trim()) })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? 'Publishing...' : 'Publish & Run Matching'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
