import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Building2,
  TrendingUp,
  Award,
  Calendar,
  ChevronRight,
  Download,
  Plus,
  Lock,
  Eye
} from 'lucide-react';
import DonutChart from '../components/DonutChart';
import { useAuth } from '../context/AuthContext';

export default function TPPlacements() {
  const { user } = useAuth();
  const isHOD = user?.role === 'HOD';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlacements() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/institution/placements', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Error fetching placements:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlacements();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading placement analytics...
      </div>
    );
  }

  const metrics = data?.metrics || {
    students_placed: 980,
    recruiting_companies: 320,
    average_package: '₹ 12.0 LPA',
    highest_package: '₹ 52.0 LPA'
  };

  const branchRates = data?.branch_wise_placement_rates || [
    { branch: 'Computer Science (CSE)', rate: 92, count: 220, avg_pkg: '14.2 LPA', color: '#3B82F6' },
    { branch: 'Information Science (ISE)', rate: 88, count: 180, avg_pkg: '12.8 LPA', color: '#8B5CF6' },
    { branch: 'Electronics & Comm. (ECE)', rate: 76, count: 140, avg_pkg: '11.5 LPA', color: '#06B6D4' },
    { branch: 'Electrical & Electronics (EEE)', rate: 71, count: 110, avg_pkg: '10.2 LPA', color: '#10B981' },
    { branch: 'Mechanical Engineering (ME)', rate: 68, count: 90, avg_pkg: '8.6 LPA', color: '#F59E0B' },
    { branch: 'Civil Engineering (CE)', rate: 62, count: 80, avg_pkg: '8.1 LPA', color: '#EF4444' }
  ];

  const packages = data?.package_distribution || [
    { range: '< 5 LPA', count: 120 },
    { range: '5 - 8 LPA', count: 280 },
    { range: '8 - 12 LPA', count: 350 },
    { range: '12 - 20 LPA', count: 180 },
    { range: '20 - 30 LPA', count: 90 },
    { range: '> 30 LPA', count: 40 }
  ];

  const topRecruiters = data?.top_recruiters || [
    { name: 'Google', offers: 120, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', offers: 95, logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'Amazon', offers: 82, logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Adobe', offers: 60, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png' },
    { name: 'TCS', offers: 58, logo: '/tcs-logo.webp' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Placements & Outcomes
            </h1>
            {isHOD && (
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={12} />
                <span>HOD View (Read Only)</span>
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Track placement activities, analyze trends, and create better opportunities for your students.
          </p>
        </div>

        <div className="font-script" style={{ color: '#4F46E5', fontSize: '1.25rem' }}>
          "Stronger Careers. Brighter Tomorrows."
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.students_placed}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Students Placed</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>↑ 18% from last year</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.recruiting_companies}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Recruiting Companies</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>↑ 25% this year</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.average_package}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Average Package</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>↑ 15% from last year</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.highest_package}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Highest Package</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 600 }}>↑ 8% from last year</div>
          </div>
        </div>
      </div>

      {/* Row 1: Branch-wise Placement Rate + Top Recruiting Companies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Branch-wise Placement Rate */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Branch-wise Placement Rate</h3>
            <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700 }}>All Branches</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {branchRates.map((b, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78125rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{b.branch}</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>{b.rate}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${b.rate}%`, height: '100%', backgroundColor: b.color, borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Recruiting Companies */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Top Recruiting Companies</h3>
            <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700 }}>View All →</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topRecruiters.map((rec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={rec.logo} alt={rec.name} style={{ height: '18px', maxWidth: '60px', objectFit: 'contain' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>{rec.name}</span>
                </div>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{rec.offers} offers</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Placement Offers Donut + Package Distribution Histogram */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
        {/* Offers Donut */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px' }}>Placement Offers Breakdown</h3>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <DonutChart
              size={130}
              strokeWidth={14}
              totalCount={1062}
              totalLabel="Total Offers"
              showLegend={true}
              data={[
                { label: 'Accepted (78%)', count: 828, color: '#10B981' },
                { label: 'In Progress (12%)', count: 127, color: '#3B82F6' },
                { label: 'Declined (7%)', count: 74, color: '#F59E0B' },
                { label: 'Yet to Respond (3%)', count: 33, color: '#CBD5E1' }
              ]}
            />
          </div>
        </div>

        {/* Package Distribution Histogram */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '14px' }}>Package Distribution (LPA)</h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '10px 0' }}>
            {packages.map((p, idx) => {
              const maxCount = 350;
              const heightPct = (p.count / maxCount) * 100;

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{p.count}</span>
                  <div style={{ width: '32px', height: `${heightPct}%`, backgroundColor: '#4F46E5', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '6px', whiteSpace: 'nowrap' }}>{p.range}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
