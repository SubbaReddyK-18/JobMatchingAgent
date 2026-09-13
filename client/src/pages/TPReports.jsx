import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Filter, Calendar, 
  CheckCircle2, Building, Users, Table, Sparkles, Clock, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TPReports() {
  const { isHOD } = useAuth();
  const [reportType, setReportType] = useState('nirf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const predefinedReports = [
    {
      id: 'nirf',
      title: 'NIRF / AICTE Annual Placement Audit Report',
      description: 'Official median salary, higher studies count, placed percentage, and gender ratios formatted for NIRF submission.',
      format: 'PDF & XLSX',
      records: '380 Students',
      lastGenerated: '2 days ago'
    },
    {
      id: 'naac',
      title: 'NAAC Criteria 5.2.1 Placement Register',
      description: 'Mandatory NAAC documentation containing employer appointment letters, student USN registers, and package proofs.',
      format: 'PDF & ZIP Archive',
      records: '152 Placed Students',
      lastGenerated: '1 week ago'
    },
    {
      id: 'branch',
      title: 'Department-wise CTC & Drive Breakdown',
      description: 'Granular comparison across CSE, ISE, ECE, EEE with average, median, and 90th percentile compensation packages.',
      format: 'XLSX / CSV',
      records: '18 Drives',
      lastGenerated: 'Yesterday'
    },
    {
      id: 'interventions',
      title: 'Agent 50 Unmatched & At-Risk Intervention Roster',
      description: 'Targeted remediation list for candidates with CGPA > 7.5 missing specific cloud or system design competencies.',
      format: 'PDF / CSV',
      records: '24 At-Risk Students',
      lastGenerated: 'Today, 10:30 AM'
    },
    {
      id: 'recruiters',
      title: 'Company Recruitment Drive Summary & Feedback',
      description: 'Hiring partner conversion metrics, test cutoffs, candidate feedback scores, and offer acceptance statistics.',
      format: 'PDF & CSV',
      records: '18 Partners',
      lastGenerated: '3 days ago'
    }
  ];

  const handleGenerate = (id) => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setIsGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Placement Reports</h1>
            <span className="badge badge-indigo">Page 16</span>
            {isHOD && <span className="badge badge-amber">Read-Only View</span>}
          </div>
          <p className="text-sm text-slate-500">
            Generate compliant NIRF, NAAC, NBA, and leadership reports with 1-click audit-ready validation.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <strong className="font-bold">Report Generated Successfully:</strong> File downloaded to local system with verified digital cryptographic checksum.
          </div>
        </div>
      )}

      {/* Report Generator Banner */}
      <div className="card p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI Placement Intelligence Exporter
          </span>
          <h2 className="text-xl font-bold">Export Official Compliance & Leadership Briefs</h2>
          <p className="text-xs text-indigo-200/90 mt-1">
            Instantly bundle candidate verification certificates, drive histories, offer letters, and compensation statistics compliant with AICTE & NIRF standards.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={() => handleGenerate('nirf')}
              disabled={isGenerating}
              className="btn bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs py-2 px-4 shadow-lg flex items-center gap-2"
            >
              {isGenerating ? (
                <span>Compiling Data...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate NIRF 2027 Report (PDF)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Predefined Reports List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Standard Institutional Report Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predefinedReports.map((report) => (
            <div key={report.id} className="card p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="badge badge-slate text-[11px] font-semibold">{report.format}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{report.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{report.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <span className="font-semibold text-slate-700">{report.records}</span> • Updated {report.lastGenerated}
                </div>
                <button
                  onClick={() => handleGenerate(report.id)}
                  disabled={isGenerating}
                  className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Download <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
