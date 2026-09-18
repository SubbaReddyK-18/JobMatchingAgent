import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Award, Users, CheckCircle2, 
  TrendingUp, Search, Filter, Plus, ArrowUpRight, Clock, Star, AlertCircle,
  X, Check, Sparkles, UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TPLearningSkills() {
  const { isHOD } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRosterModal, setShowRosterModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [newModule, setNewModule] = useState({
    title: '',
    category: 'Cloud & Backend',
    level: 'Intermediate',
    duration_hours: 24,
    target_skills: '',
    description: ''
  });

  const [assignData, setAssignData] = useState({
    student_id: '',
    module_id: ''
  });

  const skillGapMatrix = [
    { skill: 'Docker & Containers', cseGap: '38%', iseGap: '45%', eceGap: '72%', demandTrend: '+42% High', moduleId: 'mod_cloud_01' },
    { skill: 'System Design & Distributed Arch', cseGap: '28%', iseGap: '35%', eceGap: '60%', demandTrend: '+55% Critical', moduleId: 'mod_cloud_01' },
    { skill: 'AWS Cloud & Terraform', cseGap: '30%', iseGap: '40%', eceGap: '68%', demandTrend: '+38% High', moduleId: 'mod_cloud_01' },
    { skill: 'DSA & Dynamic Programming', cseGap: '22%', iseGap: '30%', eceGap: '54%', demandTrend: '+65% Core', moduleId: 'mod_dsa_01' },
    { skill: 'Full-Stack React & Node.js', cseGap: '18%', iseGap: '24%', eceGap: '50%', demandTrend: '+15% Stable', moduleId: 'mod_web_01' }
  ];

  const getAuthHeaders = (isJson = false) => {
    const token = localStorage.getItem('jobmatch_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (isJson) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/institution/learning-modules', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data?.modules) setModules(data.modules);
      }
    } catch (err) {
      console.error('Error loading modules:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data?.students) setStudents(data.students);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchStudents();
  }, []);

  const handleOpenRoster = async (mod) => {
    setSelectedModule(mod);
    setShowRosterModal(true);
    setRosterLoading(true);
    try {
      const res = await fetch(`/api/institution/module-roster/${mod.id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setRoster(data?.roster || []);
      } else {
        setRoster([]);
      }
    } catch (err) {
      console.error('Error loading roster:', err);
      setRoster([]);
    } finally {
      setRosterLoading(false);
    }
  };

  const handleOpenAssign = (mod) => {
    if (isHOD) {
      alert('Action Prohibited: Head of Department (HOD) is restricted to Read-Only access.');
      return;
    }
    setSelectedModule(mod);
    setAssignData({
      student_id: students[0]?.id || '',
      module_id: mod.id
    });
    setShowAssignModal(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignData.student_id || !assignData.module_id) return;
    try {
      setAssigning(true);
      const res = await fetch('/api/institution/assign-module', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(assignData)
      });
      if (res.ok) {
        setSuccessMsg(`Successfully assigned module to student!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        setShowAssignModal(false);
        fetchModules();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to assign module');
      }
    } catch (err) {
      alert('Failed to assign module');
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/institution/learning-modules', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(newModule)
      });
      if (res.ok) {
        setSuccessMsg(`Module "${newModule.title}" launched successfully!`);
        setTimeout(() => setSuccessMsg(''), 4000);
        setShowAddModal(false);
        setNewModule({
          title: '',
          category: 'Cloud & Backend',
          level: 'Intermediate',
          duration_hours: 24,
          target_skills: '',
          description: ''
        });
        fetchModules();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to launch module');
      }
    } catch (err) {
      alert('Failed to launch module');
    } finally {
      setCreating(false);
    }
  };

  const filteredModules = modules.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (Array.isArray(p.target_skills) ? p.target_skills.join(' ') : String(p.target_skills || '')).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalEnrolled = modules.reduce((sum, m) => sum + (m.enrolled_count || 0), 0);
  const avgCompletion = modules.length > 0 
    ? Math.round(modules.reduce((sum, m) => sum + (m.completion_rate || 0), 0) / modules.length)
    : 78;

  return (
    <div className="space-y-6">
      {/* Notifications Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning & Skill Development</h1>
            <span className="badge badge-indigo">Agent 50 Curated</span>
            {isHOD && <span className="badge badge-amber">Read-Only View</span>}
          </div>
          <p className="text-sm text-slate-500">
            Target institutional skill gaps with curated training modules mapped directly to hiring company criteria.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (isHOD) {
                alert('Action Prohibited: Head of Department (HOD) is restricted to Read-Only access.');
                return;
              }
              setShowAddModal(true);
            }}
            className={`btn btn-primary ${isHOD ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Launch New Skill Module
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5 bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Modules</span>
            <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><BookOpen className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{modules.length} Modules</div>
          <div className="text-xs text-indigo-600 font-medium mt-1">Directly linked to placement requirements</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled</span>
            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{totalEnrolled} Enrollments</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Across CSE, ISE, ECE, AI/ML branches</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-sky-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Completion Rate</span>
            <span className="p-2 bg-sky-100 text-sky-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{avgCompletion}%</div>
          <div className="text-xs text-sky-600 font-medium mt-1">+14.6% vs previous cohort</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-purple-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gap Bridge Velocity</span>
            <span className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">3.8 Weeks</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Time to meet eligibility score</div>
        </div>
      </div>

      {/* Institutional Skill Gap Matrix */}
      <div className="card overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Branch Skill Gap & Recruiter Demand Matrix</h2>
            <p className="text-xs text-slate-500">Aggregated from 26 active recruitment drives and student benchmark assessments</p>
          </div>
          <span className="badge badge-purple text-xs">Agent 50 Aggregation</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Target Competency</th>
                <th className="py-3 px-4">CSE Unmet %</th>
                <th className="py-3 px-4">ISE Unmet %</th>
                <th className="py-3 px-4">ECE Unmet %</th>
                <th className="py-3 px-4">Recruiter Demand</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skillGapMatrix.map((item, idx) => {
                const targetMod = modules.find(m => m.id === item.moduleId) || modules[0];
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{item.skill}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-amber-600">{item.cseGap}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-amber-600">{item.iseGap}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-rose-600">{item.eceGap}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="badge badge-indigo text-xs">{item.demandTrend}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button 
                        onClick={() => targetMod && handleOpenAssign(targetMod)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Assign Module
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Modules Directory */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Active Skill Enhancement Modules</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search modules or skills..."
                className="input pl-9 text-xs py-1.5 w-60"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input text-xs py-1.5"
            >
              <option value="all">All Categories</option>
              <option value="Cloud & Backend">Cloud & Backend</option>
              <option value="DSA & Problem Solving">DSA & Problem Solving</option>
              <option value="Web & Fullstack">Web & Fullstack</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Loading learning modules...</div>
        ) : filteredModules.length === 0 ? (
          <div className="card p-12 text-center text-slate-400">No matching skill modules found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((prog) => {
              const skills = Array.isArray(prog.target_skills) 
                ? prog.target_skills 
                : (typeof prog.target_skills === 'string' ? JSON.parse(prog.target_skills || '[]') : []);

              return (
                <div key={prog.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="badge badge-blue text-[10px] uppercase font-bold tracking-wider mb-2">
                          {prog.category || 'Engineering'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900">{prog.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prog.description}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold flex-shrink-0">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {prog.level || 'Intermediate'}
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs space-y-1.5">
                      <div className="flex items-start justify-between text-slate-600 gap-2">
                        <span className="font-medium flex-shrink-0">Target Skills:</span>
                        <span className="font-bold text-slate-900 text-right">
                          {skills.join(', ') || 'Core Competencies'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium">Estimated Time:</span>
                        <span className="font-semibold text-indigo-600">{prog.duration_hours || 20} Hours</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Cohort Completion Rate</span>
                        <span className="font-bold text-slate-900">{prog.completion_rate || 75}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${prog.completion_rate || 75}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> {prog.enrolled_count || 0} Enrolled
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenAssign(prog)}
                        className="btn btn-secondary text-xs py-1 px-2.5"
                      >
                        <UserPlus className="w-3 h-3 mr-1" /> Assign
                      </button>
                      <button 
                        onClick={() => handleOpenRoster(prog)}
                        className="btn btn-primary text-xs py-1 px-2.5 flex items-center gap-1"
                      >
                        View Roster <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Module Roster Modal */}
      {showRosterModal && selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedModule.title}</h3>
                <p className="text-xs text-slate-500">Enrolled Student Roster & Live Learning Progress</p>
              </div>
              <button 
                onClick={() => setShowRosterModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto my-4 flex-1">
              {rosterLoading ? (
                <div className="text-center py-10 text-slate-400 text-xs">Loading roster...</div>
              ) : roster.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">No students enrolled yet in this module.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">USN & Branch</th>
                      <th className="py-2.5 px-3">Progress</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roster.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{row.student_name}</div>
                          <div className="text-[11px] text-slate-400">{row.email}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-700">
                          {row.student_usn} <span className="badge badge-blue text-[10px] ml-1">{row.branch}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-100 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${row.progress_pct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                style={{ width: `${row.progress_pct}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-slate-700">{row.progress_pct}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`badge ${row.status === 'COMPLETED' ? 'badge-green' : 'badge-purple'} text-[10px]`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setShowRosterModal(false)} className="btn btn-secondary text-xs">
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Module Modal */}
      {showAssignModal && selectedModule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Assign Training Module</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Assign <strong className="text-slate-800">{selectedModule.title}</strong> directly to a student to bridge flagged skill gaps.
            </p>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
                <select 
                  value={assignData.student_id}
                  onChange={(e) => setAssignData({ ...assignData, student_id: e.target.value })}
                  className="input text-xs w-full"
                  required
                >
                  <option value="">Choose a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.usn} - {s.branch}) - CGPA: {s.cgpa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAssignModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={assigning} className="btn btn-primary text-xs flex items-center gap-1.5">
                  {assigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900">Launch New Skill Module</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Set up a department-wide or institutional technical training sprint.</p>

            <form onSubmit={handleCreateModule} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Module Title</label>
                <input 
                  required 
                  type="text" 
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                  placeholder="e.g. Distributed Systems & Kafka Architecture" 
                  className="input text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select 
                    value={newModule.category}
                    onChange={(e) => setNewModule({ ...newModule, category: e.target.value })}
                    className="input text-xs"
                  >
                    <option value="Cloud & Backend">Cloud & Backend</option>
                    <option value="DSA & Problem Solving">DSA & Problem Solving</option>
                    <option value="Web & Fullstack">Web & Fullstack</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Hours</label>
                  <input 
                    required 
                    type="number" 
                    value={newModule.duration_hours}
                    onChange={(e) => setNewModule({ ...newModule, duration_hours: e.target.value })}
                    placeholder="24" 
                    className="input text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Skill Gaps (Comma separated)</label>
                <input 
                  required 
                  type="text" 
                  value={newModule.target_skills}
                  onChange={(e) => setNewModule({ ...newModule, target_skills: e.target.value })}
                  placeholder="e.g. Docker, Kubernetes, Helm, Microservices" 
                  className="input text-xs" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Module Overview / Description</label>
                <textarea 
                  rows={3}
                  value={newModule.description}
                  onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  placeholder="Comprehensive hands-on training sprint designed to elevate student proficiency..."
                  className="input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="btn btn-primary text-xs flex items-center gap-1.5">
                  {creating ? 'Launching...' : 'Launch & Activate Module'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
