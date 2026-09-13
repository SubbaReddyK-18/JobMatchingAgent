import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Users, Award, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, DollarSign, Building2, Calendar, Download
} from 'lucide-react';
import DonutChart from '../components/DonutChart';
import { useAuth } from '../context/AuthContext';

export default function TPAnalytics() {
  const { isHOD } = useAuth();
  const [selectedBatch, setSelectedBatch] = useState('2027');

  const funnelStages = [
    { stage: 'Registered Eligible', count: 380, rate: '100%', drop: '0%' },
    { stage: 'Agent 50 Matched & Applied', count: 345, rate: '90.7%', drop: '-9.3%' },
    { stage: 'Shortlisted by Recruiters', count: 260, rate: '68.4%', drop: '-22.3%' },
    { stage: 'Interview Cleared', count: 184, rate: '48.4%', drop: '-20.0%' },
    { stage: 'Offers Extended', count: 152, rate: '40.0%', drop: '-8.4%' },
    { stage: 'Offers Accepted', count: 142, rate: '37.3%', drop: '-2.7%' }
  ];

  const packageDistribution = [
    { label: 'Tier-1 Elite (>30 LPA)', value: 24, color: '#6366f1' },
    { label: 'Super Dream (18-30 LPA)', value: 48, color: '#38bdf8' },
    { label: 'Dream (10-18 LPA)', value: 52, color: '#10b981' },
    { label: 'Core / IT (6-10 LPA)', value: 28, color: '#f59e0b' }
  ];

  const branchMetrics = [
    { branch: 'Computer Science & Eng (CSE)', eligible: 140, placed: 132, rate: 94.2, avgCtc: '22.8 LPA', maxCtc: '58.0 LPA' },
    { branch: 'Information Science (ISE)', eligible: 110, placed: 101, rate: 91.8, avgCtc: '19.4 LPA', maxCtc: '44.0 LPA' },
    { branch: 'Electronics & Comm (ECE)', eligible: 90, placed: 76, rate: 84.4, avgCtc: '14.2 LPA', maxCtc: '32.0 LPA' },
    { branch: 'Electrical & Electronics (EEE)', eligible: 40, placed: 31, rate: 77.5, avgCtc: '10.8 LPA', maxCtc: '21.0 LPA' }
  ];

  const topRecruiters = [
    { name: 'Google', offers: 8, highestCtc: '58.0 LPA', role: 'Software Engineer L3', status: 'Drive Complete' },
    { name: 'Microsoft', offers: 14, highestCtc: '52.0 LPA', role: 'Software Development Engineer', status: 'Drive Complete' },
    { name: 'Amazon', offers: 22, highestCtc: '44.0 LPA', role: 'SDE-1 & Cloud Associate', status: 'Interview Stage' },
    { name: 'Deloitte', offers: 32, highestCtc: '16.5 LPA', role: 'Technology Consultant', status: 'Drive Complete' },
    { name: 'Adobe', offers: 6, highestCtc: '42.0 LPA', role: 'Member of Tech Staff', status: 'Drive Complete' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Intelligence & Funnel Analytics</h1>
            <span className="badge badge-indigo">Pages 14-15</span>
            {isHOD && <span className="badge badge-amber">Read-Only View</span>}
          </div>
          <p className="text-sm text-slate-500">
            Real-time pipeline analytics, candidate stage drop-offs, compensation benchmarks, and branch-level performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="input text-xs py-2"
          >
            <option value="2027">Batch of 2027 (Current)</option>
            <option value="2026">Batch of 2026 (Historic)</option>
            <option value="2025">Batch of 2025 (Historic)</option>
          </select>
          <button 
            onClick={() => alert('Exporting Official Placement Analytics PDF Report for Institutional Leadership...')}
            className="btn btn-secondary text-xs"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Analytics
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Institutional Placement Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">89.5%</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> +6.4% YoY vs Batch 2026
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Average Package</span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">17.8 LPA</div>
          <div className="flex items-center gap-1 text-xs text-indigo-600 font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" /> Highest: 58.0 LPA (Google)
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Total Offers Extended</span>
            <Award className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">152 Offers</div>
          <div className="text-xs text-slate-500 mt-1">42 Dual / Super Dream Offers</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Active Companies</span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">18 Drives</div>
          <div className="text-xs text-purple-600 font-semibold mt-1">10 Tier-1 Fortune 500</div>
        </div>
      </div>

      {/* Placement Conversion Funnel */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Placement Conversion Funnel</h2>
            <p className="text-xs text-slate-500">Stage-by-stage candidate progression and drop-off analysis</p>
          </div>
          <span className="badge badge-emerald text-xs">Agent 50 Conversion Tracker</span>
        </div>

        <div className="space-y-4">
          {funnelStages.map((st, idx) => {
            const widthPercent = (st.count / funnelStages[0].count) * 100;
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{st.stage}</span>
                  <div className="flex items-center gap-4 text-slate-600">
                    <span className="font-bold text-slate-900">{st.count} Candidates</span>
                    <span className="w-12 text-right font-semibold text-indigo-600">{st.rate}</span>
                    <span className={`w-16 text-right font-medium ${idx === 0 ? 'text-slate-400' : 'text-rose-500'}`}>
                      {st.drop}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-sky-500 rounded-full transition-all duration-700"
                    style={{ width: `${widthPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column: Package Distribution & Branch Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CTC Distribution Donut */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Compensation Package Tiering</h2>
              <p className="text-xs text-slate-500">Breakdown of offers across salary brackets</p>
            </div>
            <span className="text-xs font-bold text-indigo-600">152 Total</span>
          </div>

          <div className="flex items-center justify-center py-4">
            <DonutChart
              segments={packageDistribution}
              size={180}
              strokeWidth={22}
              centerLabel="Avg CTC"
              centerValue="17.8L"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 text-xs">
            {packageDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 truncate">{item.label}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Branch-wise Performance Table */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Branch-wise Placement Rates</h2>
              <p className="text-xs text-slate-500">Department metrics for the Batch of 2027</p>
            </div>
            <span className="badge badge-indigo text-xs">All Departments</span>
          </div>

          <div className="space-y-3">
            {branchMetrics.map((b, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{b.branch}</span>
                  <span className="text-xs font-black text-emerald-600">{b.rate}% Placed</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${b.rate}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{b.placed} / {b.eligible} Students Placed</span>
                  <span>Avg: <strong className="text-slate-800">{b.avgCtc}</strong> | Max: <strong className="text-indigo-600">{b.maxCtc}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recruiters Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Key Institutional Hiring Partners</h2>
            <p className="text-xs text-slate-500">Top recruiters by offer volume and package offerings</p>
          </div>
          <span className="badge badge-purple text-xs">Drive Performance</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Role Designation</th>
                <th className="py-3 px-4">Offers Made</th>
                <th className="py-3 px-4">Highest CTC</th>
                <th className="py-3 px-4">Drive Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topRecruiters.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {rec.name[0]}
                    </span>
                    {rec.name}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{rec.role}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-emerald-600">{rec.offers} Candidates</td>
                  <td className="py-3.5 px-4 text-xs font-black text-indigo-600">{rec.highestCtc}</td>
                  <td className="py-3.5 px-4">
                    <span className={`badge ${rec.status === 'Drive Complete' ? 'badge-emerald' : 'badge-amber'} text-[11px]`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
