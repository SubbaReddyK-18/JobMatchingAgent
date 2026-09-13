import React, { useState } from 'react';
import { Sparkles, GraduationCap, Building2, Shield, ArrowRight, Eye, EyeOff, Lock, User, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onLoginSuccess, onBackToLanding }) {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('1RV23CS184');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleTab = (role) => {
    setSelectedRole(role);
    setError('');
    if (role === 'STUDENT') {
      setIdentifier('1RV23CS184');
      setPassword('Student@123');
    } else if (role === 'T_AND_P') {
      setIdentifier('TP-OFFICER-01');
      setPassword('TPCell@123');
    } else if (role === 'HOD') {
      setIdentifier('HOD-CSE-01');
      setPassword('HOD@123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(identifier, password, selectedRole);
      if (selectedRole === 'STUDENT') {
        onLoginSuccess('student-dashboard');
      } else {
        onLoginSuccess('tp-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Role metadata configurations
  const roleConfig = {
    STUDENT: {
      label: 'USN / Student Email',
      placeholder: 'Enter USN (e.g. 1RV23CS184) or email',
      sampleId: '1RV23CS184 (Subbu K) or 1RV22IS015 (Siri C)',
      color: '#4F46E5',
      accentBg: '#EEF2FF',
      portalTitle: 'Student Career Portal',
      desc: 'Access your personalized matches, skill roadmap and Agent 50 insights.'
    },
    T_AND_P: {
      label: 'Employee ID / Official Email',
      placeholder: 'Enter Employee ID (e.g. TP-OFFICER-01) or email',
      sampleId: 'TP-OFFICER-01 (Aarav Sharma)',
      color: '#7C3AED',
      accentBg: '#F5F3FF',
      portalTitle: 'Training & Placement Portal',
      desc: 'Manage drives, candidate ranking, unmatched cohorts, and placement operations.'
    },
    HOD: {
      label: 'Faculty ID / Official Email',
      placeholder: 'Enter Faculty ID (e.g. HOD-CSE-01) or email',
      sampleId: 'HOD-CSE-01 (Dr. Rajesh Kumar)',
      color: '#059669',
      accentBg: '#ECFDF5',
      portalTitle: 'Department Intelligence Portal',
      desc: 'Read-only departmental placement statistics, readiness, and skill gaps.'
    }
  };

  const currentRole = roleConfig[selectedRole];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      backgroundColor: '#F8FAFC'
    }}>
      {/* Left Column: Campus Branding & Value Props */}
      <div style={{
        background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
        color: 'white',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top Branding */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            onClick={onBackToLanding}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>JobMatch AI</div>
              <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>Connect • Talent • Build • Futures</div>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div style={{ margin: '48px 0' }}>
          <div className="font-script" style={{ color: '#818CF8', fontSize: '1.5rem', marginBottom: '8px' }}>
            Empowered Departments. Stronger Futures.
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, color: '#FFFFFF', marginBottom: '16px' }}>
            Your Next Opportunity<br />
            <span style={{ color: '#818CF8' }}>Starts Here.</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.5, maxWidth: '440px', marginBottom: '36px' }}>
            AI-powered placement intelligence for students, training & placement cells, and academic departments.
          </p>

          {/* Value Badges */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#818CF8" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Smarter Matching</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} color="#34D399" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Better Opportunities</span>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={16} color="#FBBF24" />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Brighter Futures</span>
            </div>
          </div>
        </div>

        {/* Campus Photo banner */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#818CF8' }}>RV COLLEGE OF ENGINEERING</div>
            <div style={{ fontSize: '0.8125rem', color: '#E2E8F0', marginTop: '2px' }}>"Academic Excellence Leads to Brighter Futures."</div>
          </div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          padding: '36px'
        }}>
          {/* Portal Header Badge */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: currentRole.accentBg,
              border: '1px solid #E0E7FF',
              marginBottom: '12px'
            }}>
              <span style={{ backgroundColor: currentRole.color, color: 'white', fontWeight: 800, fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>AI</span>
              <span style={{ fontSize: '0.78125rem', fontWeight: 700, color: currentRole.color }}>{currentRole.portalTitle}</span>
            </div>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0F172A' }}>Account Sign In</h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748B', marginTop: '4px' }}>
              {currentRole.desc}
            </p>
          </div>

          {/* 3 Role Selection Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => handleRoleTab('STUDENT')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 6px',
                borderRadius: '12px',
                border: selectedRole === 'STUDENT' ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                backgroundColor: selectedRole === 'STUDENT' ? '#EEF2FF' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <GraduationCap size={18} color={selectedRole === 'STUDENT' ? '#4F46E5' : '#64748B'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedRole === 'STUDENT' ? '#4F46E5' : '#0F172A', marginTop: '4px' }}>Student</span>
              <span style={{ fontSize: '0.625rem', color: '#64748B', textAlign: 'center', marginTop: '2px' }}>USN Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTab('T_AND_P')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 6px',
                borderRadius: '12px',
                border: selectedRole === 'T_AND_P' ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                backgroundColor: selectedRole === 'T_AND_P' ? '#F5F3FF' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={18} color={selectedRole === 'T_AND_P' ? '#7C3AED' : '#64748B'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedRole === 'T_AND_P' ? '#7C3AED' : '#0F172A', marginTop: '4px' }}>T&P Cell</span>
              <span style={{ fontSize: '0.625rem', color: '#64748B', textAlign: 'center', marginTop: '2px' }}>Emp ID</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTab('HOD')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 6px',
                borderRadius: '12px',
                border: selectedRole === 'HOD' ? '2px solid #059669' : '1px solid #E2E8F0',
                backgroundColor: selectedRole === 'HOD' ? '#ECFDF5' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Shield size={18} color={selectedRole === 'HOD' ? '#059669' : '#64748B'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedRole === 'HOD' ? '#059669' : '#0F172A', marginTop: '4px' }}>HOD</span>
              <span style={{ fontSize: '0.625rem', color: '#64748B', textAlign: 'center', marginTop: '2px' }}>Faculty ID</span>
            </button>
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '16px', lineHeight: 1.4 }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {currentRole.label}
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={currentRole.placeholder}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.78125rem', fontWeight: 700, color: '#334155' }}>
                  Password
                </label>
                <span style={{ fontSize: '0.71875rem', color: '#4F46E5', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="form-input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                marginTop: '4px',
                background: selectedRole === 'T_AND_P' ? 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' : selectedRole === 'HOD' ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)' : undefined
              }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Authorized Credentials Helper Banner */}
          <div style={{
            marginTop: '20px',
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            fontSize: '0.71875rem',
            color: '#64748B'
          }}>
            <div style={{ fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
              <Info size={13} color="#4F46E5" />
              Predefined Authorized Account Format:
            </div>
            <div>
              • <strong>Identifier:</strong> {currentRole.sampleId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
