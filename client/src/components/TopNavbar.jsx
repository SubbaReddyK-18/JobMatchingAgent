import React, { useState } from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TopNavbar({ onSearch }) {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const role = user?.role || 'STUDENT';

  const roleDisplayMap = {
    STUDENT: { label: 'Student Portal', sub: 'CSE • 2027' },
    T_AND_P: { label: 'T&P Officer', sub: 'Placement Cell' },
    HOD: { label: 'Head of Department', sub: 'Computer Science (Read Only)' }
  };

  const currentRoleInfo = roleDisplayMap[role] || { label: role, sub: '' };

  const notifications = [
    { title: 'Drive Update', desc: 'Google SWE Technical Round 1 evaluation slots finalized', time: '2 hours ago', unread: true },
    { title: 'New Matched Opening', desc: 'Microsoft SDE drive is now accepting candidate profiles', time: '1 day ago', unread: true },
    { title: 'Readiness Milestone', desc: 'Placement readiness score calculated by Agent 50', time: '3 days ago', unread: false }
  ];

  return (
    <header className="top-navbar">
      {/* Global Search Bar */}
      <div style={{ position: 'relative', width: '380px' }}>
        <Search size={17} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Search for opportunities, skills, companies..."
          onChange={(e) => onSearch && onSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '9px 16px 9px 38px',
            backgroundColor: '#F1F5F9',
            border: '1px solid transparent',
            borderRadius: '999px',
            fontSize: '0.84375rem',
            outline: 'none',
            color: '#0F172A',
            transition: 'all 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
          onBlur={(e) => e.target.style.borderColor = 'transparent'}
        />
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* System Intelligence Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: '#4F46E5',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={14} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
              JobMatch AI
            </div>
            <div style={{ fontSize: '0.625rem', color: '#64748B' }}>
              Agent 50 Placement Intelligence
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bell size={18} color="#475569" />
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#EF4444'
            }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '16px',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Notifications</h5>
                <span style={{ fontSize: '0.6875rem', color: '#4F46E5', fontWeight: 600 }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map((n, idx) => (
                  <div key={idx} style={{ padding: '8px', borderRadius: '8px', backgroundColor: n.unread ? '#F8FAFC' : 'transparent', borderLeft: n.unread ? '3px solid #4F46E5' : 'none' }}>
                    <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#0F172A' }}>{n.title}</div>
                    <div style={{ fontSize: '0.71875rem', color: '#64748B', marginTop: '2px' }}>{n.desc}</div>
                    <div style={{ fontSize: '0.625rem', color: '#94A3B8', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Authenticated User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          padding: '5px 14px 5px 6px',
          borderRadius: '999px'
        }}>
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt={user?.full_name || 'User'}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
              {user?.full_name || 'User'}
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>
              {currentRoleInfo.label} {currentRoleInfo.sub ? `• ${currentRoleInfo.sub}` : ''}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
