import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2, Building2, Users, GraduationCap, ShieldCheck, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onSelectPortal, onOpenLogin }) {
  const handlePortalClick = (role) => {
    if (onOpenLogin) onOpenLogin(role);
    else if (onSelectPortal) onSelectPortal('login');
  };

  const logos = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'TCS', logo: '/tcs-logo.webp' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg' },
    { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg' },
    { name: 'Deloitte', logo: '/deloitte-logo.png' },
    { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF', color: '#0F172A', overflowX: 'hidden' }}>
      {/* Top Header */}
      <nav style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              JobMatch AI
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '8px', borderLeft: '1px solid #CBD5E1', paddingLeft: '8px' }}>
              Intelligence Behind Every Placement
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
            <span style={{ color: '#4F46E5', cursor: 'pointer' }}>Home</span>
            <span style={{ cursor: 'pointer' }}>About</span>
            <span style={{ cursor: 'pointer' }}>Features</span>
            <span style={{ cursor: 'pointer' }}>For Institutions</span>
            <span style={{ cursor: 'pointer' }}>Contact</span>
          </div>

          <button
            onClick={() => onOpenLogin()}
            className="btn btn-primary"
            style={{ borderRadius: '999px', padding: '10px 22px' }}
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 24px 64px',
        display: 'grid',
        gridTemplateColumns: '1.1fr 1fr',
        gap: '48px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '0.78125rem', fontWeight: 700, marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#4F46E5', color: 'white', padding: '2px 8px', borderRadius: '999px', fontSize: '0.6875rem' }}>Agent 50</span>
            <span>Job Matching Agent</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '20px' }}>
            Smarter Matches.<br />
            <span style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #06B6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Brighter Futures.
            </span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: '#64748B', lineHeight: 1.6, marginBottom: '32px', maxWidth: '520px' }}>
            An AI-powered placement intelligence platform that connects students, companies and institutions — based on skills, interests and real outcomes.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
            <button
              onClick={() => onOpenLogin()}
              className="btn btn-primary btn-lg"
              style={{ borderRadius: '999px' }}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handlePortalClick('STUDENT', 'student-dashboard')}
              className="btn btn-secondary btn-lg"
              style={{ borderRadius: '999px' }}
            >
              <Play size={16} fill="#475569" />
              <span>Explore Live Demo</span>
            </button>
          </div>

          {/* Stat Pillars */}
          <div style={{ display: 'flex', gap: '32px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
            <div>
              <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0F172A' }}>10K+</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Students Empowered</div>
            </div>
            <div>
              <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0F172A' }}>200+</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Company Opportunities</div>
            </div>
            <div>
              <div style={{ fontSize: '1.625rem', fontWeight: 800, color: '#0F172A' }}>95%</div>
              <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Match Accuracy (Pilot)</div>
            </div>
          </div>
        </div>

        {/* Hero Ecosystem Diagram (Interactive) */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '460px',
            height: '420px',
            position: 'relative',
            background: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.08) 0%, rgba(255,255,255,0) 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Center Sphere */}
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #6366F1, #4338CA, #1E1B4B)',
              boxShadow: '0 20px 40px rgba(79, 70, 229, 0.4), inset 0 2px 6px rgba(255,255,255,0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center',
              zIndex: 10,
              padding: '12px'
            }}>
              <Sparkles size={24} style={{ marginBottom: '4px' }} />
              <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>JobMatch AI</div>
              <div style={{ fontSize: '0.625rem', color: '#C7D2FE', marginTop: '2px' }}>Skills → Opportunities → Better Outcomes</div>
            </div>

            {/* Satellite 1: Students */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '14px 18px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                <GraduationCap size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Students</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Skills • Interests • Projects</div>
              </div>
            </div>

            {/* Satellite 2: Companies */}
            <div style={{
              position: 'absolute',
              top: '30px',
              right: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '14px 18px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <Building2 size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Companies</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>JD • Eligibility • Talent</div>
              </div>
            </div>

            {/* Satellite 3: Institutions */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              right: '50px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '14px 18px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Institutions</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>T&P Cell • HODs • Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Portal Section (Page 1 Bottom) */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '64px 24px', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Welcome to JobMatch AI
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>
            Choose Your <span style={{ color: '#4F46E5' }}>Portal</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '600px', margin: '0 auto 48px' }}>
            Different goals. A common mission. Smarter placements for a brighter future.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px', textAlign: 'left' }}>
            {/* Student Portal Card */}
            <div className="card" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4F46E5',
                marginBottom: '20px'
              }}>
                <GraduationCap size={26} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>Student</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                Discover opportunities that fit your skills, interests and career aspirations.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Personalized job matches</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Identify preparation & skill gaps</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Track applications & interviews</span>
                </div>
              </div>

              <button
                onClick={() => handlePortalClick('STUDENT', 'student-dashboard')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                <span>Continue as Student</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* T&P Cell Portal Card */}
            <div className="card" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', position: 'relative', border: '2px solid #818CF8' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#F5F3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7C3AED',
                marginBottom: '20px'
              }}>
                <Building2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>Training & Placement Cell</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                Manage opportunities, find the right candidates with AI, and drive placement outcomes.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>AI Job Description structuring</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Ranked candidate shortlists</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Unmatched student intelligence</span>
                </div>
              </div>

              <button
                onClick={() => handlePortalClick('T_AND_P', 'tp-dashboard')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)' }}
              >
                <span>Continue as T&P Cell</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* HOD Portal Card */}
            <div className="card" style={{ padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#059669',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '8px' }}>Head of Department</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
                Understand department readiness, identify skill gaps, and make data-driven decisions. (Read-Only)
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Department placement analytics</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Curriculum & skill landscape insights</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Students needing attention alerts</span>
                </div>
              </div>

              <button
                onClick={() => handlePortalClick('HOD', 'tp-dashboard')}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' }}
              >
                <span>Continue as HOD</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Leading Companies */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '24px' }}>
          Trusted by leading companies for campus placements
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', opacity: 0.8 }}>
          {logos.map((l, i) => (
            <img key={i} src={l.logo} alt={l.name} style={{ height: '26px', objectFit: 'contain' }} />
          ))}
        </div>
      </section>
    </div>
  );
}
