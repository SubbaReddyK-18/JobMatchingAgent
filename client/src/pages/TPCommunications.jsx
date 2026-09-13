import React, { useState } from 'react';
import { 
  Send, Mail, Bell, MessageSquare, Users, CheckCircle2, 
  Clock, Sparkles, Filter, Search, Plus, AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TPCommunications() {
  const { isHOD } = useAuth();
  const [recipientGroup, setRecipientGroup] = useState('google_shortlist');
  const [channel, setChannel] = useState('all');
  const [subject, setSubject] = useState('Mandatory Briefing: Google SWE Technical Interview Rounds (Slot A)');
  const [messageBody, setMessageBody] = useState(
`Dear Candidates,

Congratulations on being shortlisted by Agent 50 for the Google Software Engineer (L3) campus drive.

The Round 1 Technical Coding Evaluation is scheduled for tomorrow at 10:00 AM IST in CSE Lab 4. Please ensure your IDE setups, GitHub repositories, and college IDs are in order.

Best regards,
Training & Placement Cell`
  );
  const [isSending, setIsSending] = useState(false);
  const [broadcastLog, setBroadcastLog] = useState([
    {
      id: 1,
      title: 'Google SWE Round 1 Technical Interview Call',
      target: 'Google Shortlisted (14 Students)',
      channels: ['Email', 'In-App Alert'],
      sentAt: 'Today, 09:15 AM',
      status: 'Delivered (100%)',
      openRate: '92.8%'
    },
    {
      id: 2,
      title: 'Microsoft SDE Coding Assessment Link & Guidelines',
      target: 'Eligible CSE & ISE (240 Students)',
      channels: ['Email', 'SMS', 'In-App Alert'],
      sentAt: 'Yesterday, 04:00 PM',
      status: 'Delivered (99.2%)',
      openRate: '88.5%'
    },
    {
      id: 3,
      title: 'AWS Cloud Architect Sprint: Registration Open',
      target: 'Students with Cloud Skill Gaps (84 Students)',
      channels: ['In-App Alert'],
      sentAt: '2 days ago',
      status: 'Delivered (100%)',
      openRate: '76.2%'
    }
  ]);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (isHOD) {
      alert('Action Prohibited: Head of Department (HOD) is restricted to Read-Only access.');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      const newEntry = {
        id: Date.now(),
        title: subject,
        target: recipientGroup === 'google_shortlist' ? 'Google Shortlisted (14 Students)' : 'All Eligible Students (380 Students)',
        channels: ['Email', 'In-App Alert'],
        sentAt: 'Just now',
        status: 'Delivered (100%)',
        openRate: '0%'
      };
      setBroadcastLog([newEntry, ...broadcastLog]);
      setIsSending(false);
      alert('Broadcast dispatched successfully to target candidate cohort!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Placement Communications & Broadcasts</h1>
            <span className="badge badge-indigo">Page 17</span>
            {isHOD && <span className="badge badge-amber">Read-Only View</span>}
          </div>
          <p className="text-sm text-slate-500">
            Send drive announcements, interview call letters, and targeted reminders across email, portal notifications, and SMS.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Composer Form */}
        <div className="lg:col-span-7">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Dispatch Target Broadcast
              </h2>
              <span className="text-xs text-slate-500">Real-time candidate messaging</span>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Cohort</label>
                  <select 
                    value={recipientGroup} 
                    onChange={(e) => setRecipientGroup(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="google_shortlist">Google SWE Shortlisted (14 Candidates)</option>
                    <option value="microsoft_shortlist">Microsoft SDE Shortlisted (28 Candidates)</option>
                    <option value="all_cse">All CSE Final Year (140 Students)</option>
                    <option value="unmatched">At-Risk / Unmatched Cohort (24 Students)</option>
                    <option value="all">All Placement Registered (380 Students)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dispatch Channels</label>
                  <select 
                    value={channel} 
                    onChange={(e) => setChannel(e.target.value)}
                    className="input text-xs"
                  >
                    <option value="all">Email + In-App Notification</option>
                    <option value="in_app">In-App Notification Only</option>
                    <option value="email">Email Only</option>
                    <option value="urgent_sms">Email + In-App + SMS (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject Line</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required 
                  className="input text-xs" 
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea 
                  rows={6}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  required 
                  className="input text-xs font-mono" 
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setSubject('Interview Schedule Update: Google SWE Slot Confirmation');
                      setMessageBody(`Please be informed that your Google Technical Interview slot has been rescheduled to 2:00 PM today.`);
                    }}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Use Interview Template
                  </button>
                  <span className="text-slate-300">•</span>
                  <button 
                    type="button" 
                    onClick={() => {
                      setSubject('Action Required: Remediation Module for Cloud Engineering');
                      setMessageBody(`Based on Agent 50 analytics, completing the AWS Cloud Module will boost your matching eligibility by +24%.`);
                    }}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Use Skill Intervention Template
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isSending || isHOD}
                  className={`btn btn-primary text-xs ${isHOD ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSending ? 'Transmitting...' : 'Send Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Broadcast Statistics & History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Communication Channel Health</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  Institutional SMTP Gateway
                </div>
                <span className="badge badge-emerald text-[11px]">99.8% Delivered</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Bell className="w-4 h-4 text-sky-600" />
                  In-App WebSocket Push
                </div>
                <span className="badge badge-emerald text-[11px]">Active (Online)</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Dispatches</h3>
            <div className="space-y-3">
              {broadcastLog.map((item) => (
                <div key={item.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/40 text-xs space-y-1.5">
                  <div className="flex items-start justify-between">
                    <strong className="font-bold text-slate-900 leading-tight">{item.title}</strong>
                    <span className="badge badge-indigo text-[10px] flex-shrink-0">{item.status}</span>
                  </div>
                  <div className="text-slate-500 flex items-center justify-between text-[11px]">
                    <span>To: {item.target}</span>
                    <span>{item.sentAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Channels: {item.channels.join(', ')}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">Open Rate: {item.openRate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
