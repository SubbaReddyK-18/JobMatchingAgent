import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, Award, Users, CheckCircle2, 
  TrendingUp, Search, Filter, Plus, ArrowUpRight, Clock, Star, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TPLearningSkills() {
  const { isHOD } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const programs = [
    {
      id: 1,
      title: 'Distributed Systems & Microservices',
      category: 'Cloud & Backend',
      targetGap: 'Docker, Kubernetes, Kafka',
      impactCompanies: 'Google, Amazon, Microsoft, Uber',
      enrolled: 142,
      duration: '6 Weeks',
      completionRate: 78,
      status: 'In Progress',
      rating: 4.8,
      instructor: 'Prof. Rajesh K. & Industry Mentors'
    },
    {
      id: 2,
      title: 'AWS Cloud Solutions Architect Sprint',
      category: 'Cloud & Backend',
      targetGap: 'AWS, Cloud Architecture, Terraform',
      impactCompanies: 'Deloitte, Adobe, Amazon',
      enrolled: 98,
      duration: '4 Weeks',
      completionRate: 92,
      status: 'Active',
      rating: 4.9,
      instructor: 'AWS Certified Solutions Architect Team'
    },
    {
      id: 3,
      title: 'Advanced Data Structures & Algorithms',
      category: 'DSA & Problem Solving',
      targetGap: 'Dynamic Programming, Graph Algorithms',
      impactCompanies: 'Google, Microsoft, Goldman Sachs',
      enrolled: 220,
      duration: '8 Weeks',
      completionRate: 65,
      status: 'Active',
      rating: 4.7,
      instructor: 'Competitive Programming Cell'
    },
    {
      id: 4,
      title: 'Full-Stack React & Node.js Enterprise Mastery',
      category: 'Web & Fullstack',
      targetGap: 'React 18, Next.js, PostgreSQL',
      impactCompanies: 'Infosys, TCS, Oracle',
      enrolled: 175,
      duration: '5 Weeks',
      completionRate: 84,
      status: 'Completed',
      rating: 4.6,
      instructor: 'Full Stack Innovation Lab'
    }
  ];

  const skillGapMatrix = [
    { skill: 'Docker & Containers', cseGap: '38%', iseGap: '45%', eceGap: '72%', demandTrend: '+42% High' },
    { skill: 'System Design', cseGap: '28%', iseGap: '35%', eceGap: '60%', demandTrend: '+55% Critical' },
    { skill: 'AWS Cloud', cseGap: '30%', iseGap: '40%', eceGap: '68%', demandTrend: '+38% High' },
    { skill: 'Kubernetes', cseGap: '45%', iseGap: '52%', eceGap: '80%', demandTrend: '+29% Medium' },
    { skill: 'GraphQL & REST', cseGap: '18%', iseGap: '24%', eceGap: '50%', demandTrend: '+15% Stable' }
  ];

  const filteredPrograms = programs.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.targetGap.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning & Skill Development</h1>
            <span className="badge badge-indigo">Page 13</span>
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
          <div className="text-2xl font-black text-slate-900 mt-2">12 Modules</div>
          <div className="text-xs text-indigo-600 font-medium mt-1">4 high-priority sprints active</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Enrolled</span>
            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Users className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">635 Students</div>
          <div className="text-xs text-emerald-600 font-medium mt-1">78.4% institutional participation</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-sky-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Completion Rate</span>
            <span className="p-2 bg-sky-100 text-sky-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">81.2%</div>
          <div className="text-xs text-sky-600 font-medium mt-1">+14.6% vs last quarter</div>
        </div>

        <div className="card p-5 bg-gradient-to-br from-purple-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gap Bridge Velocity</span>
            <span className="p-2 bg-purple-100 text-purple-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">4.2 Weeks</div>
          <div className="text-xs text-purple-600 font-medium mt-1">Time to meet eligibility score</div>
        </div>
      </div>

      {/* Institutional Skill Gap Matrix */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Branch Skill Gap & Industry Demand Matrix</h2>
            <p className="text-xs text-slate-500">Aggregated from 18 active recruitment drives and 340+ student profiles</p>
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
              {skillGapMatrix.map((item, idx) => (
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
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                      Assign Module →
                    </button>
                  </td>
                </tr>
              ))}
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
                placeholder="Search modules..."
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
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrograms.map((prog) => (
            <div key={prog.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge badge-blue text-[10px] uppercase font-bold tracking-wider mb-2">
                    {prog.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{prog.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Instructor: {prog.instructor}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {prog.rating}
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium">Target Gaps:</span>
                  <span className="font-bold text-slate-900">{prog.targetGap}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-medium">Direct Impact For:</span>
                  <span className="font-semibold text-indigo-600">{prog.impactCompanies}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Completion Progress</span>
                  <span className="font-bold text-slate-900">{prog.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${prog.completionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {prog.enrolled} Students</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {prog.duration}</span>
                </div>
                <button className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  View Roster <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Module Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Launch New Skill Module</h3>
            <p className="text-xs text-slate-500 mb-4">Set up a department-wide or college-wide technical training sprint.</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Module launched successfully! Auto-enrolling 84 students with flagged skill gaps.');
              setShowAddModal(false);
            }} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Module Title</label>
                <input required type="text" placeholder="e.g. Kubernetes & Cloud Native Architecture" className="input text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select className="input text-xs">
                    <option>Cloud & Backend</option>
                    <option>DSA & Problem Solving</option>
                    <option>Web & Fullstack</option>
                    <option>Data Engineering & AI</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input required type="text" placeholder="e.g. 4 Weeks" className="input text-xs" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Skill Gaps (Comma separated)</label>
                <input required type="text" placeholder="e.g. Kubernetes, Helm, CI/CD" className="input text-xs" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Hiring Companies</label>
                <input required type="text" placeholder="e.g. Google, Microsoft, Amazon" className="input text-xs" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Launch & Auto-Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
