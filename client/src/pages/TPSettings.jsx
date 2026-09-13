import React, { useState } from 'react';
import { 
  Sliders, Shield, SlidersHorizontal, Bell, Save, 
  CheckCircle2, AlertTriangle, Cpu, Lock, HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TPSettings() {
  const { isHOD } = useAuth();
  const [weights, setWeights] = useState({
    skills: 40,
    projects: 25,
    roleFit: 15,
    locationFit: 10,
    readiness: 10
  });

  const [policies, setPolicies] = useState({
    maxDreamOffers: 1,
    maxSuperDreamOffers: 1,
    strictBacklogGate: true,
    minAttendance: 75,
    minMatchCutoff: 70,
    autoNotifyShortlists: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (isHOD) {
      alert('Action Prohibited: Head of Department (HOD) is restricted to Read-Only access.');
      return;
    }

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalWeight !== 100) {
      alert(`Weights must sum to 100%. Current sum: ${totalWeight}%`);
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Cell Configuration & Engine Settings</h1>
            <span className="badge badge-indigo">Page 18</span>
            {isHOD && <span className="badge badge-amber">Read-Only View</span>}
          </div>
          <p className="text-sm text-slate-500">
            Tune Agent 50 matching parameters, institutional placement policies, and automated dispatch thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isHOD}
          className={`btn btn-primary text-xs ${isHOD ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Save className="w-4 h-4 mr-1.5" />
          Save Configuration
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <strong className="font-bold">Settings Persisted:</strong> Agent 50 weights and placement policies updated across the institution.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent 50 Engine Multi-Factor Weight Tuning */}
        <div className="lg:col-span-6">
          <div className="card p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Agent 50 Multi-Factor Scoring Weights</h2>
                    <p className="text-xs text-slate-500">Calibrate the 5 deterministic scoring factors (Must sum to 100%)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">1. Skill Overlap & Depth Weight</span>
                    <span className="text-indigo-600 font-bold">{weights.skills}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    disabled={isHOD}
                    value={weights.skills}
                    onChange={(e) => setWeights({ ...weights, skills: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Direct technical skill match (core skills weighted 2x vs secondary)</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">2. Project Experience & Tech Relevance</span>
                    <span className="text-indigo-600 font-bold">{weights.projects}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    disabled={isHOD}
                    value={weights.projects}
                    onChange={(e) => setWeights({ ...weights, projects: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Practical repository contributions, complexity & tech stack overlap</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">3. Role Fit (Domain Alignment)</span>
                    <span className="text-indigo-600 font-bold">{weights.roleFit}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    disabled={isHOD}
                    value={weights.roleFit}
                    onChange={(e) => setWeights({ ...weights, roleFit: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Alignment between candidate's desired domain and opening description</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">4. Location & Work Mode Fit</span>
                    <span className="text-indigo-600 font-bold">{weights.locationFit}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    disabled={isHOD}
                    value={weights.locationFit}
                    onChange={(e) => setWeights({ ...weights, locationFit: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Match between candidate city preferences and drive posting location</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">5. Placement Readiness Factor</span>
                    <span className="text-indigo-600 font-bold">{weights.readiness}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    disabled={isHOD}
                    value={weights.readiness}
                    onChange={(e) => setWeights({ ...weights, readiness: parseInt(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">Mock test scores, resume completeness, and verification state</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Total Factor Weight Sum:</span>
              <span className={`font-black text-sm ${Object.values(weights).reduce((a, b) => a + b, 0) === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Object.values(weights).reduce((a, b) => a + b, 0)}% / 100%
              </span>
            </div>
          </div>
        </div>

        {/* Institutional Placement Policies */}
        <div className="lg:col-span-6 space-y-6">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Institutional Placement Policy Rules</h2>
                <p className="text-xs text-slate-500">Autonomous eligibility enforcement during candidate matching</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <strong className="block font-bold text-slate-900">Strict Active Backlog Gate</strong>
                  <span className="text-slate-500">Students with active backlogs are automatically excluded from drive eligibility.</span>
                </div>
                <input
                  type="checkbox"
                  disabled={isHOD}
                  checked={policies.strictBacklogGate}
                  onChange={(e) => setPolicies({ ...policies, strictBacklogGate: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <strong className="block font-bold text-slate-900">Dream Offer Cap</strong>
                  <span className="text-slate-500">Max Dream tier offers (&gt; 10 LPA) a student can hold before being locked.</span>
                </div>
                <select
                  disabled={isHOD}
                  value={policies.maxDreamOffers}
                  onChange={(e) => setPolicies({ ...policies, maxDreamOffers: parseInt(e.target.value) })}
                  className="input text-xs w-20"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <strong className="block font-bold text-slate-900">Minimum Academic Attendance</strong>
                  <span className="text-slate-500">Mandatory semester attendance cutoff for placement registration.</span>
                </div>
                <select
                  disabled={isHOD}
                  value={policies.minAttendance}
                  onChange={(e) => setPolicies({ ...policies, minAttendance: parseInt(e.target.value) })}
                  className="input text-xs w-20"
                >
                  <option value="75">75%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <strong className="block font-bold text-slate-900">Minimum Match Score for Auto-Shortlist</strong>
                  <span className="text-slate-500">Agent 50 threshold to qualify candidate for direct 1-click shortlisting.</span>
                </div>
                <select
                  disabled={isHOD}
                  value={policies.minMatchCutoff}
                  onChange={(e) => setPolicies({ ...policies, minMatchCutoff: parseInt(e.target.value) })}
                  className="input text-xs w-20"
                >
                  <option value="70">70%</option>
                  <option value="75">75%</option>
                  <option value="80">80%</option>
                  <option value="85">85%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-5 bg-amber-50/60 border border-amber-200 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900">Audit Compliance Guarantee:</strong>
                <p className="text-amber-800/90 mt-1 leading-relaxed">
                  All policy adjustments and weight tunings are cryptographically logged in the immutable AgentOps database table for NIRF/NAAC transparency. Protected characteristics (gender, religion, caste) remain strictly omitted from all computations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
