import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import SantraAIChat from './components/SantraAIChat';

// Public Pages
import LandingPage from './pages/LandingPage';
import PortalsPage from './pages/PortalsPage';
import LoginPage from './pages/LoginPage';

// Student Portal Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentOpportunities from './pages/StudentOpportunities';
import StudentMatches from './pages/StudentMatches';
import OpportunityDetails from './pages/OpportunityDetails';
import PreparationCenter from './pages/PreparationCenter';
import StudentApplications from './pages/StudentApplications';
import StudentProfile from './pages/StudentProfile';

// Institution (T&P and HOD) Portal Pages
import TPDashboard from './pages/TPDashboard';
import TPStudents from './pages/TPStudents';
import TPPlacements from './pages/TPPlacements';
import TPOpportunities from './pages/TPOpportunities';
import TPCandidateRanking from './pages/TPCandidateRanking';
import TPUnmatchedStudents from './pages/TPUnmatchedStudents';
import TPLearningSkills from './pages/TPLearningSkills';
import TPAnalytics from './pages/TPAnalytics';
import TPReports from './pages/TPReports';
import TPCommunications from './pages/TPCommunications';
import TPSettings from './pages/TPSettings';
import AgentOpsLogs from './pages/AgentOpsLogs';

function MainApp() {
  const { user, isAuthenticated, loading, isStudent, isTP, isHOD } = useAuth();
  
  // Navigation & Layout state
  const [currentView, setCurrentView] = useState('landing');
  const [loginRole, setLoginRole] = useState('STUDENT');
  const [selectedJobId, setSelectedJobId] = useState(1);
  const [rankingJobId, setRankingJobId] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('jobmatch_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('jobmatch_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Sync default view when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      if (currentView === 'landing' || currentView === 'portals' || currentView === 'login') {
        if (isStudent) setCurrentView('student-dashboard');
        else setCurrentView('tp-dashboard');
      }
    } else {
      if (currentView !== 'login' && currentView !== 'landing' && currentView !== 'portals') {
        setCurrentView('landing');
      }
    }
  }, [isAuthenticated, isStudent, isTP, isHOD]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '0.9375rem' }}>
        Initialising JobMatch AI Intelligence...
      </div>
    );
  }

  // 1. Unauthenticated Public Flow
  if (!isAuthenticated) {
    if (currentView === 'login') {
      return (
        <LoginPage 
          initialRole={loginRole}
          onLoginSuccess={(targetView) => {
            if (targetView) setCurrentView(targetView);
            else if (user?.role === 'STUDENT') setCurrentView('student-dashboard');
            else setCurrentView('tp-dashboard');
          }}
          onBackToLanding={() => setCurrentView('portals')}
        />
      );
    }

    if (currentView === 'portals') {
      return (
        <PortalsPage 
          onSelectPortal={(portalRole) => {
            setLoginRole(portalRole || 'STUDENT');
            setCurrentView('login');
          }}
          onBackToLanding={() => setCurrentView('landing')}
        />
      );
    }

    return (
      <LandingPage 
        onGetStarted={() => setCurrentView('portals')}
        onOpenLogin={(role) => {
          setLoginRole(role || 'STUDENT');
          setCurrentView('login');
        }}
        onSelectPortal={(portalRole) => {
          if (portalRole) setLoginRole(portalRole);
          setCurrentView('portals');
        }}
      />
    );
  }

  // Helper callbacks
  const handleViewJob = (jobId) => {
    setSelectedJobId(jobId);
    setCurrentView('opportunity-details');
  };

  const handleViewCandidateRanking = (jobId) => {
    if (isHOD) return; // HOD cannot access candidate ranking operations
    setRankingJobId(jobId);
    setCurrentView('tp-candidate-ranking');
  };

  // 2. Role-Isolated Content Renderer
  const renderContent = () => {
    // --- A. Student Role Isolation ---
    if (isStudent) {
      switch (currentView) {
        case 'student-dashboard':
          return <StudentDashboard onNavigate={setCurrentView} onViewJob={handleViewJob} />;
        case 'student-opportunities':
          return <StudentOpportunities onViewJob={handleViewJob} onPrepareRole={() => setCurrentView('preparation-center')} />;
        case 'student-matches':
          return <StudentMatches onViewJob={handleViewJob} />;
        case 'opportunity-details':
          return (
            <OpportunityDetails 
              jobId={selectedJobId} 
              onBack={() => setCurrentView('student-opportunities')} 
              onNavigate={setCurrentView}
              onPrepareRole={() => setCurrentView('preparation-center')}
            />
          );
        case 'preparation-center':
          return <PreparationCenter onNavigate={setCurrentView} />;
        case 'student-applications':
          return <StudentApplications onNavigate={setCurrentView} onPrepareRole={() => setCurrentView('preparation-center')} />;
        case 'student-profile':
          return <StudentProfile onNavigate={setCurrentView} />;
        default:
          return <StudentDashboard onNavigate={setCurrentView} onViewJob={handleViewJob} />;
      }
    }

    // --- B. Head of Department (HOD) Role Isolation (Strictly Read-Only) ---
    if (isHOD) {
      switch (currentView) {
        case 'tp-dashboard':
          return <TPDashboard onNavigate={setCurrentView} />;
        case 'tp-students':
          return <TPStudents />;
        case 'tp-placements':
          return <TPPlacements />;
        case 'tp-opportunities':
          return <TPOpportunities onViewCandidates={() => {}} />;
        case 'tp-learning':
          return <TPLearningSkills />;
        case 'tp-analytics':
          return <TPAnalytics />;
        case 'tp-reports':
          return <TPReports />;
        default:
          return <TPDashboard onNavigate={setCurrentView} />;
      }
    }

    // --- C. Training & Placement (T&P) Role Isolation ---
    if (isTP) {
      switch (currentView) {
        case 'tp-dashboard':
          return <TPDashboard onNavigate={setCurrentView} />;
        case 'tp-students':
          return <TPStudents />;
        case 'tp-placements':
          return <TPPlacements />;
        case 'tp-opportunities':
          return <TPOpportunities onViewCandidates={handleViewCandidateRanking} />;
        case 'tp-candidate-ranking':
          return <TPCandidateRanking initialJobId={rankingJobId} />;
        case 'tp-unmatched':
          return <TPUnmatchedStudents />;
        case 'tp-learning':
          return <TPLearningSkills />;
        case 'tp-analytics':
          return <TPAnalytics />;
        case 'tp-reports':
          return <TPReports />;
        case 'tp-communications':
          return <TPCommunications />;
        case 'tp-settings':
          return <TPSettings />;
        case 'agentops':
          return <AgentOpsLogs />;
        default:
          return <TPDashboard onNavigate={setCurrentView} />;
      }
    }

    return <div className="card p-6 text-center text-slate-500">Access Denied: Unrecognized role authentication.</div>;
  };

  // 3. Unified Layout Shell (Zero top whitespace, non-overlapping sidebar)
  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Role-Specific Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content Viewport */}
      <div className="main-content">
        <TopNavbar />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>

      {/* SantraAI Floating Assistant */}
      <SantraAIChat />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
