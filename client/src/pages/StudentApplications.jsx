import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Video,
  ChevronRight,
  ExternalLink,
  Award,
  BookOpen,
  ArrowRight,
  Check
} from 'lucide-react';
import DonutChart from '../components/DonutChart';
import StageProgressBar from '../components/StageProgressBar';

export default function StudentApplications({ onNavigate, onOpenInterview }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedInterviewApp, setSelectedInterviewApp] = useState(null);

  useEffect(() => {
    async function loadApps() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/applications/my-applications', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading applications pipeline...
      </div>
    );
  }

  const apps = data?.applications || [];
  const counts = data?.counts || { total: 6, under_review: 2, interviews: 2, offers: 1, not_selected: 1 };

  const filteredApps = apps.filter(app => {
    if (activeTab === 'all') return true;
    if (activeTab === 'under_review') return app.status === 'UNDER_REVIEW' || app.status === 'APPLIED';
    if (activeTab === 'interviews') return app.status === 'INTERVIEW_SCHEDULED';
    if (activeTab === 'offers') return app.status === 'OFFER_RECEIVED';
    if (activeTab === 'not_selected') return app.status === 'NOT_SELECTED';
    return true;
  });

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
            My <span style={{ color: '#4F46E5' }}>Applications</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Track your progress, stay on top of deadlines, and ace your placement journey.
          </p>
        </div>

        <div className="font-script" style={{ color: '#4F46E5', fontSize: '1.25rem' }}>
          Apply • Prepare • Succeed
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileCheck2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{counts.total}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Total Applications</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>+2 this month</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{counts.under_review}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Under Review</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Awaiting response</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Video size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{counts.interviews}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Interviews Scheduled</div>
            <div style={{ fontSize: '0.6875rem', color: '#8B5CF6', fontWeight: 600 }}>Get ready!</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{counts.offers}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Offer Received</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>Keep going!</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Application Cards List vs Right Column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Filter Tabs & List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '999px' }}
            >
              <span>All ({counts.total})</span>
            </button>
            <button
              onClick={() => setActiveTab('under_review')}
              className={`btn btn-sm ${activeTab === 'under_review' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '999px' }}
            >
              <span>Under Review ({counts.under_review})</span>
            </button>
            <button
              onClick={() => setActiveTab('interviews')}
              className={`btn btn-sm ${activeTab === 'interviews' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '999px' }}
            >
              <span>Interviews ({counts.interviews})</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`btn btn-sm ${activeTab === 'offers' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '999px' }}
            >
              <span>Offers ({counts.offers})</span>
            </button>
            <button
              onClick={() => setActiveTab('not_selected')}
              className={`btn btn-sm ${activeTab === 'not_selected' ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: '999px' }}
            >
              <span>Not Selected ({counts.not_selected})</span>
            </button>
          </div>

          {/* Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredApps.map((app) => {
              const isInterview = app.status === 'INTERVIEW_SCHEDULED';
              const isOffer = app.status === 'OFFER_RECEIVED';
              const isRejected = app.status === 'NOT_SELECTED';

              return (
                <div
                  key={app.id}
                  className="card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    border: isInterview ? '1.5px solid #C7D2FE' : isOffer ? '1.5px solid #A7F3D0' : '1px solid #E2E8F0'
                  }}
                >
                  {/* Left: Logo & Job details */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', minWidth: '220px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      flexShrink: 0
                    }}>
                      <img src={app.company_logo} alt={app.company_name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>

                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A' }}>{app.job_title}</h3>
                      <div style={{ fontSize: '0.78125rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{app.company_name}</span>
                        <span>•</span>
                        <span>{app.role_type}</span>
                        <span>•</span>
                        <span>{app.job_location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Stage Step Progress Bar */}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <StageProgressBar
                      currentStage={app.stage_progress || (isOffer ? 4 : isInterview ? 3 : 2)}
                      status={app.status}
                    />
                  </div>

                  {/* Right: Date & Details action */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '130px' }}>
                    <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      <span>Applied on {app.applied_at ? app.applied_at.split(' ')[0] : '12 Aug 2026'}</span>
                    </div>

                    {isInterview ? (
                      <button
                        onClick={() => setSelectedInterviewApp(app)}
                        className="btn btn-primary btn-sm"
                      >
                        <Video size={13} />
                        <span>Interview Details</span>
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <span>View Status</span>
                        <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Application Status Donut & Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Donut Overview */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px' }}>Application Status Overview</h4>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <DonutChart
                size={120}
                strokeWidth={12}
                totalCount={6}
                totalLabel="Applications"
                showLegend={true}
                data={[
                  { label: 'Offer Received', count: 1, color: '#10B981' },
                  { label: 'Under Review', count: 2, color: '#3B82F6' },
                  { label: 'Interviews', count: 2, color: '#8B5CF6' },
                  { label: 'Not Selected', count: 1, color: '#EF4444' }
                ]}
              />
            </div>
          </div>

          {/* Application Timeline */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px' }}>Application Timeline</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78125rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Applied to Amazon</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>28 Jul 2026</div>
                </div>
                <span className="badge badge-green">Offer</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78125rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Applied to Google</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>12 Aug 2026</div>
                </div>
                <span className="badge badge-purple">Interview</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78125rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Applied to Infosys</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>20 Aug 2026</div>
                </div>
                <span className="badge badge-red">Not Selected</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78125rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Applied to Microsoft</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>5 Sep 2026</div>
                </div>
                <span className="badge badge-blue">Under Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Interview Details & Prep (Page 8) */}
      {selectedInterviewApp && (
        <div className="modal-overlay" onClick={() => setSelectedInterviewApp(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={selectedInterviewApp.company_logo} alt="" style={{ height: '24px' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{selectedInterviewApp.job_title} Interview</h3>
              </div>
              <button
                onClick={() => setSelectedInterviewApp(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Scheduled card */}
            <div style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px', padding: '16px', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#1E1B4B' }}>Technical Round 1 (Systems & DSA)</div>
              <div style={{ fontSize: '0.78125rem', color: '#4338CA', marginTop: '4px', display: 'flex', gap: '16px' }}>
                <span>📅 15 Sep 2026, 10:00 AM IST</span>
                <span>📹 Google Meet (Virtual)</span>
              </div>
              <a
                href={selectedInterviewApp.meeting_link || 'https://meet.google.com/rvc-job-match'}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary btn-sm"
                style={{ marginTop: '12px', display: 'inline-flex' }}
              >
                <Video size={14} />
                <span>Join Google Meet</span>
              </a>
            </div>

            {/* Preparation Checklist */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '8px' }}>Preparation Checklist (4/6 Completed)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78125rem' }}>
                {[
                  { task: 'Revise Data Structures & Algorithms', done: true },
                  { task: 'Practice system design basics & caching bottlenecks', done: true },
                  { task: "Go through Google's engineering core principles", done: true },
                  { task: 'Solve mock interview questions with timer', done: true },
                  { task: 'Prepare for behavioral questions (STAR method)', done: false },
                  { task: 'Test technical setup (internet, camera, mic)', done: false }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: item.done ? '#10B981' : '#64748B' }}>
                    <CheckCircle2 size={14} color={item.done ? '#10B981' : '#CBD5E1'} />
                    <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>{item.task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Practice Questions */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 800, marginBottom: '8px' }}>Suggested Practice Questions</h4>
              <ol style={{ paddingLeft: '20px', fontSize: '0.78125rem', color: '#334155', lineHeight: 1.6 }}>
                <li>Given an array, find the longest subarray with sum K.</li>
                <li>Design a data structure to support LRU cache in O(1) time complexity.</li>
                <li>Given a binary tree, find the lowest common ancestor of two nodes.</li>
                <li>Implement a function to detect and remove a cycle in a linked list.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
