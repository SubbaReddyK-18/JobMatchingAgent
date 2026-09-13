import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Building2,
  Lock
} from 'lucide-react';
import DonutChart from '../components/DonutChart';
import { useAuth } from '../context/AuthContext';

export default function TPStudents({ onSelectStudent }) {
  const { user } = useAuth();
  const isHOD = user?.role === 'HOD';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    email: '',
    usn: '',
    branch: 'CSE',
    cgpa: '8.5',
    graduation_year: '2027'
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    async function loadStudents() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/institution/students', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (isHOD) return; // Prevented server-side and client-side

    setSubmitting(true);
    setFeedbackMsg('');
    try {
      const token = localStorage.getItem('jobmatch_token');
      const res = await fetch('/api/institution/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newStudent)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add student');

      // Reload
      const reload = await fetch('/api/institution/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const reData = await reload.json();
      setStudents(reData.students || []);
      setShowAddModal(false);
      setFeedbackMsg('Student successfully registered!');
    } catch (err) {
      setFeedbackMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = students.filter(s => {
    if (activeTab !== 'All' && s.status !== activeTab) return false;
    if (branchFilter !== 'All' && s.branch !== branchFilter) return false;
    if (yearFilter !== 'All' && String(s.graduation_year) !== yearFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.full_name.toLowerCase().includes(q);
      const matchUSN = s.usn.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      if (!matchName && !matchUSN && !matchEmail) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading student roster...
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
              Student Management
            </h1>
            {isHOD && (
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} />
                <span>HOD View (Read Only)</span>
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Manage student profiles, track progress, and support their journey from learning to placement.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-outline btn-sm">
            <Download size={15} />
            <span>Export Roster</span>
          </button>

          {!isHOD ? (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={15} />
              <span>Add Student</span>
            </button>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
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

      {feedbackMsg && (
        <div style={{ padding: '12px', backgroundColor: '#ECFDF5', color: '#065F46', borderRadius: '10px', fontSize: '0.8125rem' }}>
          {feedbackMsg}
        </div>
      )}

      {/* Main Layout: Students Table + Right Column Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
        {/* Table Container */}
        <div className="card" style={{ padding: '20px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '16px' }}>
            {['All', 'Placement Ready', 'In Preparation', 'Needs Attention'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: '999px', fontSize: '0.75rem' }}
              >
                <span>{tab === 'All' ? 'All Students' : tab}</span>
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by name, USN, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '32px', fontSize: '0.78125rem', padding: '7px 10px 7px 32px' }}
              />
            </div>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.78125rem', padding: '7px 10px' }}
            >
              <option value="All">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="BT">BT</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.78125rem', padding: '7px 10px' }}
            >
              <option value="All">All Batches</option>
              <option value="2027">Class of 2027</option>
              <option value="2026">Class of 2026</option>
              <option value="2025">Class of 2025</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>USN</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Skills</th>
                  <th>Readiness</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((std) => (
                  <tr key={std.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={std.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                          alt={std.full_name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8125rem' }}>{std.full_name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{std.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '0.78125rem', color: '#334155' }}>{std.usn}</td>
                    <td><span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>{std.branch}</span></td>
                    <td style={{ fontWeight: 800, color: '#0F172A' }}>{std.cgpa}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '140px' }}>
                        {(std.skills || []).slice(0, 2).map((sk, i) => (
                          <span key={i} className="badge badge-blue" style={{ fontSize: '0.625rem' }}>{sk}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '90px' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${std.placement_readiness_percentage || 75}%`,
                              height: '100%',
                              backgroundColor: (std.placement_readiness_percentage || 75) >= 80 ? '#10B981' : (std.placement_readiness_percentage || 75) >= 60 ? '#3B82F6' : '#F59E0B',
                              borderRadius: '999px'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700 }}>{std.placement_readiness_percentage || 75}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        std.status === 'Placement Ready' ? 'badge-green' : std.status === 'In Preparation' ? 'badge-blue' : 'badge-amber'
                      }`} style={{ fontSize: '0.6875rem' }}>
                        {std.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar: Student Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '12px' }}>Student Insights</h4>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
              <DonutChart
                size={120}
                strokeWidth={12}
                totalCount={1248}
                totalLabel="Students"
                showLegend={true}
                data={[
                  { label: '320 Ready', count: 320, color: '#10B981' },
                  { label: '430 In Prep', count: 430, color: '#3B82F6' },
                  { label: '310 Needs Attention', count: 310, color: '#F59E0B' },
                  { label: '188 Not Started', count: 188, color: '#CBD5E1' }
                ]}
              />
            </div>
          </div>

          {/* Year-wise Distribution */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '12px' }}>Year-wise Distribution</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100px', padding: '0 10px' }}>
              {[
                { year: '1st Year', count: 312 },
                { year: '2nd Year', count: 298 },
                { year: '3rd Year', count: 327 },
                { year: '4th Year', count: 311 }
              ].map((y) => (
                <div key={y.year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{y.count}</span>
                  <div style={{ width: '22px', height: `${(y.count / 350) * 65}px`, backgroundColor: '#4F46E5', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: '0.625rem', color: '#64748B', marginTop: '6px' }}>{y.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && !isHOD && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Onboard New Student</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Gupta"
                  value={newStudent.full_name}
                  onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>USN</label>
                  <input
                    type="text"
                    required
                    placeholder="1RV23CS999"
                    value={newStudent.usn}
                    onChange={(e) => setNewStudent({ ...newStudent, usn: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    placeholder="8.50"
                    value={newStudent.cgpa}
                    onChange={(e) => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Branch</label>
                  <select
                    value={newStudent.branch}
                    onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })}
                    className="form-input"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ISE">ISE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="ME">ME</option>
                    <option value="BT">BT</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Graduation Year</label>
                  <select
                    value={newStudent.graduation_year}
                    onChange={(e) => setNewStudent({ ...newStudent, graduation_year: e.target.value })}
                    className="form-input"
                  >
                    <option value="2027">2027</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>College Email</label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? 'Registering...' : 'Save & Onboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
