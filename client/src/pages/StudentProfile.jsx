import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Mail,
  Globe,
  Code2,
  Edit,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  BookOpen,
  Target,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StudentProfile({ onNavigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/students/profile', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading profile...
      </div>
    );
  }

  const student = data?.student || {};
  const skills = data?.skills || [];
  const projects = data?.projects || [];
  const stats = data?.stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Card (Page 9 Header) */}
      <div className="card" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <img
              src={student.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={student.full_name}
              style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #EEF2FF' }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>{student.full_name || 'Subbu K'}</h1>
                <span className="badge badge-purple">CSE • 2027</span>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#475569', fontWeight: 600, marginTop: '4px' }}>
                {student.department || 'Computer Science Engineering'} | Class of {student.graduation_year || '2027'} | USN: {student.usn || '1RV23CS184'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8125rem', color: '#64748B', marginTop: '8px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} /> Bengaluru, India</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={13} /> {student.email}</span>
                <a href={student.linkedin_url || '#'} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4F46E5', textDecoration: 'none' }}>
                  <Globe size={13} /> LinkedIn
                </a>
              </div>

              {/* Quote Pill */}
              <div style={{ marginTop: '12px', display: 'inline-flex', padding: '4px 14px', borderRadius: '999px', backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '0.78125rem', fontWeight: 600 }}>
                "Consistent learning today creates endless opportunities tomorrow."
              </div>
            </div>
          </div>

          <button className="btn btn-outline" style={{ borderRadius: '10px' }}>
            <Edit size={15} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid #F1F5F9', marginTop: '24px', paddingTop: '14px', fontSize: '0.84375rem', fontWeight: 600 }}>
          {['overview', 'skills', 'education', 'experience', 'achievements', 'goals'].map(tab => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                color: activeTab === tab ? '#4F46E5' : '#64748B',
                borderBottom: activeTab === tab ? '2px solid #4F46E5' : 'none',
                paddingBottom: '6px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.2fr 1fr', gap: '20px' }}>
        {/* Column 1: About Me & Education */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* About Me */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '10px' }}>About Me</h3>
            <p style={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
              {student.bio || 'I am a Computer Science undergraduate passionate about building scalable backend systems, solving real-world problems, and continuously learning new technologies.'}
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '14px' }}>
              <span className="badge badge-blue">Problem Solver</span>
              <span className="badge badge-purple">Quick Learner</span>
              <span className="badge badge-green">Team Player</span>
              <span className="badge badge-gray">Open to Opportunities</span>
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '12px' }}>Education</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', flexShrink: 0 }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>B.E. in Computer Science Engineering</div>
                <div style={{ fontSize: '0.78125rem', color: '#64748B' }}>RV College of Engineering, Bengaluru</div>
                <div style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700, marginTop: '4px' }}>
                  2023 – 2027 • CGPA: {student.cgpa || 8.64} / 10
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Skills & Experience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Skills with Progress Bars */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Technical Skills</h3>
              <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700 }}>Edit</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Data Structures & Algorithms', pct: 85, color: '#4F46E5' },
                { name: 'System Design', pct: 70, color: '#8B5CF6' },
                { name: 'Cloud Computing (AWS/GCP)', pct: 60, color: '#06B6D4' },
                { name: 'Programming (C++ / Python)', pct: 80, color: '#F59E0B' },
                { name: 'Web Development (Node / React)', pct: 65, color: '#10B981' }
              ].map((sk, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78125rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{sk.name}</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{sk.pct}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${sk.pct}%`, height: '100%', backgroundColor: sk.color, borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '12px' }}>Experience</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', flexShrink: 0 }}>
                <Briefcase size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Software Engineering Intern</div>
                <div style={{ fontSize: '0.78125rem', color: '#64748B' }}>Microsoft • Hyderabad, India</div>
                <div style={{ fontSize: '0.71875rem', color: '#94A3B8' }}>Jun 2025 – Aug 2025</div>
                <ul style={{ paddingLeft: '16px', fontSize: '0.75rem', color: '#475569', marginTop: '6px', lineHeight: 1.5 }}>
                  <li>Worked on cloud infrastructure optimization in Azure.</li>
                  <li>Built internal monitoring tools to improve developer productivity.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Quick Stats & Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Stats */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px' }}>Quick Stats</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>12</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Applications</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>3</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Interviews</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>36 hrs</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Learning Time</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>4</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Skills Improved</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="card">
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '12px' }}>Achievements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Award size={18} color="#F59E0B" />
                <div>
                  <div style={{ fontSize: '0.78125rem', fontWeight: 700 }}>Top 5% in College Hackathon</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>National HackSphere 2025</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Award size={18} color="#06B6D4" />
                <div>
                  <div style={{ fontSize: '0.78125rem', fontWeight: 700 }}>Google Cloud Skill Badge</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Cloud Digital Leader (2025)</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Award size={18} color="#10B981" />
                <div>
                  <div style={{ fontSize: '0.78125rem', fontWeight: 700 }}>Certified in DSA</div>
                  <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Coursera / Stanford (2024)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
