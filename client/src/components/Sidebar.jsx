import React from 'react';
import {
  Home,
  Target,
  Briefcase,
  BookOpen,
  FileCheck2,
  User,
  Settings,
  LogOut,
  Users,
  GraduationCap,
  BarChart3,
  FileText,
  MessageSquare,
  Sparkles,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activePage, currentView, onNavigate }) {
  const { user, logout } = useAuth();
  const role = user?.role || 'STUDENT';
  const currentPage = activePage || currentView;

  // 1. Student Navigation (Exact 5 items from approved screenshot)
  const studentNav = [
    { id: 'student-dashboard', label: 'Overview', icon: Home },
    { id: 'student-matches', label: 'My Matches', icon: Target },
    { id: 'preparation-center', label: 'Preparation', icon: BookOpen },
    { id: 'student-applications', label: 'Applications', icon: FileCheck2 },
    { id: 'student-profile', label: 'My Profile', icon: User }
  ];

  // 2. Training & Placement Cell Navigation (Full operational management)
  const tpNav = [
    { id: 'tp-dashboard', label: 'Dashboard', icon: Home },
    { id: 'tp-students', label: 'Students', icon: Users },
    { id: 'tp-placements', label: 'Placements', icon: GraduationCap },
    { id: 'tp-learning', label: 'Learning & Skills', icon: BookOpen },
    { id: 'tp-opportunities', label: 'Events & Opportunities', icon: Briefcase },
    { id: 'tp-candidate-ranking', label: 'Candidate Matching', icon: Target },
    { id: 'tp-unmatched', label: 'Unmatched Intelligence', icon: Sparkles },
    { id: 'tp-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tp-reports', label: 'Reports', icon: FileText },
    { id: 'tp-communications', label: 'Communications', icon: MessageSquare },
    { id: 'tp-settings', label: 'Settings', icon: Settings }
  ];

  // 3. Head of Department Navigation (Strictly Read-Only institutional intelligence)
  const hodNav = [
    { id: 'tp-dashboard', label: 'Overview', icon: Home },
    { id: 'tp-students', label: 'Students', icon: Users },
    { id: 'tp-placements', label: 'Placements', icon: GraduationCap },
    { id: 'tp-opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'tp-learning', label: 'Learning & Skills', icon: BookOpen },
    { id: 'tp-analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tp-reports', label: 'Reports', icon: FileText }
  ];

  const navItems = role === 'STUDENT' ? studentNav : role === 'HOD' ? hodNav : tpNav;

  // Inspirational quotes
  const quote = role === 'STUDENT'
    ? { title: '"Consistent Learning Leads to Greater Opportunities."', subtitle: 'Keep progressing every day.' }
    : role === 'HOD'
      ? { title: '"Stronger Students, Stronger Departments."', subtitle: 'Department Placement Intelligence' }
      : { title: '"Empowering Students. Building Tomorrow\'s Leaders."', subtitle: 'Placement & Career Intelligence' };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              JobMatch AI
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#818CF8', letterSpacing: '0.04em' }}>
                Agent 50
              </span>
              <span style={{ fontSize: '0.625rem', color: '#64748B' }}>•</span>
              <span style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                {role === 'STUDENT' ? 'Student Portal' : role === 'HOD' ? 'HOD (Read Only)' : 'Institution Panel'}
              </span>
            </div>
          </div>
        </div>

        {/* HOD Read-Only Pill */}
        {role === 'HOD' && (
          <div style={{
            marginTop: '12px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '6px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.6875rem',
            color: '#FBBF24',
            fontWeight: 600
          }}>
            <Eye size={12} />
            <span>Read-Only Department View</span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div style={{ padding: '16px 0', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              style={{ width: 'calc(100% - 24px)', textAlign: 'left', border: 'none', background: isActive ? undefined : 'transparent' }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Quote Card */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px 14px',
          marginBottom: '12px'
        }}>
          <p className="font-script" style={{ color: '#E2E8F0', fontSize: '0.9375rem', lineHeight: 1.3 }}>
            {quote.title}
          </p>
          <p style={{ color: '#64748B', fontSize: '0.6875rem', marginTop: '4px' }}>
            {quote.subtitle}
          </p>
        </div>

        {/* User / Logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {role === 'STUDENT' ? (
            <button
              onClick={() => onNavigate('student-profile')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.8125rem' }}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
          ) : role === 'T_AND_P' ? (
            <button
              onClick={() => onNavigate('tp-settings')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.8125rem' }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          ) : (
            <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} /> Read-Only
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
