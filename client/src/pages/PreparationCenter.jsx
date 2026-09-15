import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Code,
  Layers,
  Clock,
  ArrowRight,
  Target,
  Check,
  Building2,
  Compass,
  Play,
  FileCode,
  Video,
  ShieldCheck,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import RadialGauge from '../components/RadialGauge';
import DonutChart from '../components/DonutChart';
import SkillCompanyGraph from '../components/SkillCompanyGraph';

export default function PreparationCenter({ onNavigate, initialRoleTarget }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('skill_gaps');
  const [selectedRole, setSelectedRole] = useState('fullstack');
  const [completedResources, setCompletedResources] = useState(() => {
    try {
      const saved = localStorage.getItem('jobmatch_completed_resources');
      return saved ? JSON.parse(saved) : [1, 3];
    } catch {
      return [1, 3];
    }
  });

  useEffect(() => {
    async function loadPrep() {
      try {
        const token = localStorage.getItem('jobmatch_token');
        const res = await fetch('/api/preparation/summary', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error('Error fetching preparation data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrep();
  }, []);

  const toggleResourceCompleted = (id) => {
    setCompletedResources(prev => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter(item => item !== id);
      } else {
        next = [...prev, id];
      }
      try {
        localStorage.setItem('jobmatch_completed_resources', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#64748B' }}>
        Loading Preparation Intelligence...
      </div>
    );
  }

  const readinessScore = data?.readiness?.overall_readiness_score || 88;
  const metrics = data?.metrics || { overall_readiness: 88, skills_to_improve: 8, high_priority_skills: 6, recommended_resources: 12 };
  const topGaps = data?.top_skill_gaps || [];

  // Role-wise definition data
  const roleDefinitions = {
    fullstack: {
      title: 'Full Stack Software Engineer',
      readiness: 88,
      demand: 'Very High',
      salary: '₹18–35 LPA',
      skills: [
        { name: 'React & Frontend State', required: 85, current: 88, match: true },
        { name: 'Node.js & Express APIs', required: 80, current: 86, match: true },
        { name: 'Database Architecture (SQL)', required: 80, current: 90, match: true },
        { name: 'Docker & Microservices', required: 75, current: 65, match: false },
        { name: 'Cloud Infrastructure (AWS/GCP)', required: 70, current: 55, match: false }
      ],
      milestones: [
        { title: 'Containerize Full-Stack App with Docker Compose', done: true, time: '1 week' },
        { title: 'Implement Redis Caching Layer for API Endpoints', done: true, time: '1 week' },
        { title: 'Deploy to AWS ECS with CI/CD GitHub Actions', done: false, time: '2 weeks' },
        { title: 'Practice System Design: Rate Limiting & Load Balancing', done: false, time: '2 weeks' }
      ],
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Adobe']
    },
    backend: {
      title: 'Backend & Cloud Systems Engineer',
      readiness: 84,
      demand: 'High',
      salary: '₹20–40 LPA',
      skills: [
        { name: 'Go / Python / Node Systems', required: 85, current: 90, match: true },
        { name: 'Distributed Caching (Redis)', required: 80, current: 85, match: true },
        { name: 'Database Query Optimization', required: 85, current: 90, match: true },
        { name: 'Kubernetes & Service Mesh', required: 75, current: 50, match: false },
        { name: 'gRPC & Message Brokers (Kafka)', required: 70, current: 60, match: false }
      ],
      milestones: [
        { title: 'Build a Pub/Sub Message Queue with Kafka', done: true, time: '2 weeks' },
        { title: 'Database Indexing & Explain Query Profiling', done: true, time: '1 week' },
        { title: 'Kubernetes Pod Deployment & Ingress Routing', done: false, time: '2 weeks' },
        { title: 'Concurrency & Deadlock Prevention Sandbox', done: false, time: '1 week' }
      ],
      topCompanies: ['Amazon', 'Microsoft', 'Oracle', 'Deloitte']
    },
    ml: {
      title: 'Machine Learning & AI Engineer',
      readiness: 78,
      demand: 'Rapidly Growing',
      salary: '₹22–45 LPA',
      skills: [
        { name: 'Python & NumPy / Pandas', required: 90, current: 92, match: true },
        { name: 'PyTorch / TensorFlow Modeling', required: 80, current: 75, match: false },
        { name: 'Vector DBs & Embeddings (RAG)', required: 85, current: 80, match: false },
        { name: 'LLM Fine-tuning & Evaluation', required: 75, current: 68, match: false },
        { name: 'MLOps Pipeline Deployment', required: 70, current: 50, match: false }
      ],
      milestones: [
        { title: 'Implement Semantic Search using Vector Embeddings', done: true, time: '1 week' },
        { title: 'Build Agentic RAG Pipeline with Tool Calling', done: true, time: '2 weeks' },
        { title: 'Deploy Model Endpoint with FastAPI & Triton', done: false, time: '2 weeks' },
        { title: 'Quantization & LoRA Fine-Tuning Sandbox', done: false, time: '2 weeks' }
      ],
      topCompanies: ['Google', 'Microsoft', 'NVIDIA', 'Adobe']
    }
  };

  const currentRoleData = roleDefinitions[selectedRole] || roleDefinitions.fullstack;

  // Learning resources data
  const learningResources = [
    {
      id: 1,
      title: 'Docker & Containerization for Production Systems',
      skill: 'Docker',
      category: 'DevOps & Cloud',
      difficulty: 'Intermediate',
      duration: '4.5 hours',
      type: 'Interactive Sandbox',
      provider: 'Agent 50 Curated Lab',
      description: 'Master multi-stage builds, container networking, persistent volumes, and Docker Compose orchestration.'
    },
    {
      id: 2,
      title: 'AWS Cloud Fundamentals & Serverless Deployments',
      skill: 'AWS & Cloud',
      category: 'Cloud Architecture',
      difficulty: 'Intermediate',
      duration: '6 hours',
      type: 'Guided Project',
      provider: 'AWS Academy Modules',
      description: 'Deploy resilient web apps using AWS Lambda, S3, RDS PostgreSQL, and CloudFront CDN distribution.'
    },
    {
      id: 3,
      title: 'System Design for Tier-1 Tech Interviews',
      skill: 'System Design',
      category: 'Architecture',
      difficulty: 'Advanced',
      duration: '8 hours',
      type: 'Masterclass & Notes',
      provider: 'Agent 50 System Series',
      description: 'Deep dive into distributed caching, database sharding, CAP theorem trade-offs, and microservice resiliency.'
    },
    {
      id: 4,
      title: 'High-Performance SQL Indexing & Query Tuning',
      skill: 'Database Design',
      category: 'Databases',
      difficulty: 'Intermediate',
      duration: '3.5 hours',
      type: 'Interactive Sandbox',
      provider: 'PostgreSQL Deep-Dive',
      description: 'Learn B-Tree internals, composite indexes, query execution plan analysis, and lock contention avoidance.'
    },
    {
      id: 5,
      title: 'Advanced Algorithmic Patterns & Graph Traversal',
      skill: 'Data Structures',
      category: 'Core CS',
      difficulty: 'Advanced',
      duration: '10 hours',
      type: 'Coding Sandbox',
      provider: 'Placement Drive DSA Track',
      description: 'Practice dynamic programming on trees, Dijkstra shortest paths, topological sorting, and Union-Find.'
    },
    {
      id: 6,
      title: 'React Concurrent Mode & State Management Architecture',
      skill: 'React.js',
      category: 'Frontend',
      difficulty: 'Intermediate',
      duration: '4 hours',
      type: 'Interactive Lab',
      provider: 'Frontend Engineering Lab',
      description: 'Build performant UI apps with Zustand, custom hooks, memoization boundaries, and optimistic updates.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', margin: 0 }}>
            Preparation <span style={{ color: '#4F46E5' }}>Center</span>
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            Bridge your skill gaps with personalized learning paths based on real institutional opportunities.
          </p>
        </div>

        <div className="font-script" style={{ color: '#4F46E5', fontSize: '1.25rem' }}>
          Learn • Practice • Grow • Succeed
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <RadialGauge value={readinessScore} size={72} strokeWidth={7} color="#10B981" />
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>Overall Readiness</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>You're on the right track!</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>↑ 6% from last month</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FDF2F8', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.skills_to_improve}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Skills to Improve</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Across 18 opportunities</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFFBEB', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{metrics.high_priority_skills}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>High Priority Gaps</div>
            <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>Required for top tiers</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{learningResources.length}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginTop: '4px' }}>Curated Modules</div>
            <div style={{ fontSize: '0.6875rem', color: '#10B981', fontWeight: 700 }}>{completedResources.length} Completed</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('skill_gaps')}
          className={`btn btn-sm ${activeTab === 'skill_gaps' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Skill Gaps</span>
        </button>
        <button
          onClick={() => setActiveTab('role_prep')}
          className={`btn btn-sm ${activeTab === 'role_prep' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Role-wise Preparation</span>
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`btn btn-sm ${activeTab === 'resources' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Learning Resources</span>
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`btn btn-sm ${activeTab === 'progress' ? 'btn-primary' : 'btn-outline'}`}
          style={{ borderRadius: '999px' }}
        >
          <span>Progress Tracking</span>
        </button>
      </div>

      {/* TAB 1: SKILL GAPS */}
      {activeTab === 'skill_gaps' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px' }}>
            {/* Left: Your Top Skill Gaps */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Your Top Skill Gaps</h3>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>These skills are required in multiple opportunities you are eligible for.</p>
                </div>
                <span style={{ fontSize: '0.71875rem', color: '#64748B', fontWeight: 600 }}>Sort by: Relevance</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>{gap.skill}</span>
                        <span className="badge badge-amber" style={{ fontSize: '0.625rem' }}>{gap.urgency}</span>
                      </div>
                      <div style={{ fontSize: '0.71875rem', color: '#64748B', marginTop: '3px' }}>
                        Required in {gap.required_in_count} opportunities • {gap.learning_time}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {gap.companies.map((c, cIdx) => (
                          <span key={cIdx} className="badge badge-blue" style={{ fontSize: '0.625rem' }}>
                            {c.name}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveTab('resources')}
                        style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                      >
                        <span>Learn</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Skill Demand Donut + Interactive Skill-Company Graph */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, marginBottom: '4px' }}>Skill Demand Across Opportunities</h4>
                <p style={{ fontSize: '0.71875rem', color: '#64748B', marginBottom: '12px' }}>Which skill categories are most in demand across eligible drives</p>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                  <DonutChart
                    size={120}
                    strokeWidth={12}
                    totalCount={18}
                    totalLabel="Opportunities"
                    showLegend={true}
                    data={data?.skill_demand_distribution?.map(d => ({ label: `${d.category} (${d.percentage}%)`, count: d.percentage, color: d.color })) || []}
                  />
                </div>
              </div>

              <SkillCompanyGraph initialSkill="Docker" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLE-WISE PREPARATION */}
      {activeTab === 'role_prep' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Role Selection Pills */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { id: 'fullstack', label: 'Full Stack Engineer', ctc: '₹18–35 LPA' },
              { id: 'backend', label: 'Backend & Cloud Systems', ctc: '₹20–40 LPA' },
              { id: 'ml', label: 'Machine Learning & AI', ctc: '₹22–45 LPA' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: selectedRole === r.id ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                  backgroundColor: selectedRole === r.id ? '#EEF2FF' : '#FFFFFF',
                  color: selectedRole === r.id ? '#4F46E5' : '#0F172A',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.9375rem', fontWeight: 800 }}>{r.label}</div>
                <div style={{ fontSize: '0.71875rem', color: '#64748B', marginTop: '2px' }}>CTC Range: {r.ctc}</div>
              </button>
            ))}
          </div>

          {/* Role Intelligence Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Left: Role Skill Requirements & Student Match */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                    {currentRoleData.title}
                  </h3>
                  <div style={{ fontSize: '0.78125rem', color: '#64748B', marginTop: '2px' }}>
                    Demand Index: <span style={{ color: '#059669', fontWeight: 700 }}>{currentRoleData.demand}</span> • Typical Package: <strong>{currentRoleData.salary}</strong>
                  </div>
                </div>

                <div style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  backgroundColor: currentRoleData.readiness >= 80 ? '#ECFDF5' : '#FEF3C7',
                  color: currentRoleData.readiness >= 80 ? '#047857' : '#B45309',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{currentRoleData.readiness}%</div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>Readiness</div>
                </div>
              </div>

              {/* Skill Matrix */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {currentRoleData.skills.map((s, idx) => (
                  <div key={idx} style={{ padding: '12px 14px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.84375rem', fontWeight: 700, color: '#334155' }}>{s.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Required: {s.required}%</span>
                        <span style={{ fontSize: '0.78125rem', fontWeight: 800, color: s.match ? '#059669' : '#DC2626' }}>
                          Yours: {s.current}%
                        </span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div style={{ width: '100%', height: '6px', borderRadius: '999px', backgroundColor: '#E2E8F0', overflow: 'hidden' }}>
                      <div style={{ width: `${s.current}%`, height: '100%', borderRadius: '999px', backgroundColor: s.match ? '#10B981' : '#F59E0B' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Target Campus Recruiters */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Target Campus Recruiters Hiring for this Profile
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentRoleData.topCompanies.map((c, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '0.75rem', fontWeight: 700 }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Tailored Role Milestones */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                Recommended Preparation Milestones
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentRoleData.milestones.map((m, mIdx) => (
                  <div 
                    key={mIdx}
                    style={{ 
                      padding: '12px 14px', 
                      borderRadius: '12px', 
                      backgroundColor: m.done ? '#F0FDF4' : '#F8FAFC', 
                      border: m.done ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px'
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: m.done ? '#10B981' : '#CBD5E1',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {m.done ? <Check size={12} /> : mIdx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: m.done ? '#065F46' : '#0F172A', textDecoration: m.done ? 'line-through' : 'none' }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>
                        Estimated time: {m.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab('resources')}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '20px', justifyContent: 'center', borderRadius: '10px' }}
              >
                <span>Launch Practice Modules</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEARNING RESOURCES */}
      {activeTab === 'resources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0F172A' }}>
                  Interactive Learning Modules
                </h3>
                <p style={{ fontSize: '0.78125rem', color: '#64748B' }}>
                  Curated by Agent 50 to resolve your exact skill gaps for upcoming campus drives.
                </p>
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#4F46E5', fontWeight: 700, backgroundColor: '#EEF2FF', padding: '6px 14px', borderRadius: '999px' }}>
                {completedResources.length} of {learningResources.length} Modules Mastered
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
              {learningResources.map((res) => {
                const isDone = completedResources.includes(res.id);

                return (
                  <div
                    key={res.id}
                    style={{
                      padding: '20px',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      border: isDone ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span className="badge badge-purple" style={{ fontSize: '0.6875rem' }}>
                          {res.skill}
                        </span>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: res.difficulty === 'Advanced' ? '#DC2626' : '#4F46E5' }}>
                          {res.difficulty}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '6px' }}>
                        {res.title}
                      </h4>
                      <p style={{ fontSize: '0.78125rem', color: '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>
                        {res.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.71875rem', color: '#475569', marginBottom: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} color="#94A3B8" /> {res.duration}
                        </span>
                        <span>•</span>
                        <span>{res.type}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#334155', fontWeight: 600, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleResourceCompleted(res.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>{isDone ? 'Completed ✓' : 'Mark as Done'}</span>
                      </label>

                      <button
                        onClick={() => alert(`Launching ${res.title} practice workspace in browser.`)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem' }}
                      >
                        <Play size={12} />
                        <span>Launch Lab</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROGRESS TRACKING */}
      {activeTab === 'progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Placement Readiness Breakdown */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Placement Readiness Trajectory
              </h3>
              <p style={{ fontSize: '0.78125rem', color: '#64748B', marginBottom: '18px' }}>
                Monitored by Agent 50 through GitHub commits, problem submissions, and gap assessments.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                <RadialGauge value={readinessScore} size={88} strokeWidth={8} color="#4F46E5" />
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>Tier-1 Readiness Status</div>
                  <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                    Eligible for 90%+ of scheduled campus recruitment drives
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                    Next Milestone: Complete Cloud System Design track to hit 95% rating.
                  </div>
                </div>
              </div>

              {/* Progress Gauges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                {(data?.learning_progress || [
                  { skill: 'Python & Algorithms', percentage: 92, color: '#10B981' },
                  { skill: 'SQL & Data Modeling', percentage: 88, color: '#3B82F6' },
                  { skill: 'System Design', percentage: 76, color: '#8B5CF6' },
                  { skill: 'Docker & DevOps', percentage: 65, color: '#F59E0B' }
                ]).map((lp, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 6px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <RadialGauge value={lp.percentage} size={64} strokeWidth={6} color={lp.color} />
                    <span style={{ fontSize: '0.71875rem', fontWeight: 700, color: '#334155', marginTop: '6px' }}>{lp.skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Activity History */}
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                Recent Preparation Activity
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { title: 'Completed LeetCode Hard DSA Simulation', time: 'Yesterday', score: '100%' },
                  { title: 'Reviewed Google Technical Round 1 Notes', time: '2 days ago', score: 'Completed' },
                  { title: 'Docker Container Networking Lab', time: '4 days ago', score: 'Passed' },
                  { title: 'Agent 50 Resume Vector Synchronization', time: '1 week ago', score: 'Synced' }
                ].map((act, aIdx) => (
                  <div key={aIdx} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A' }}>{act.title}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B' }}>{act.time}</div>
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.6875rem' }}>{act.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
