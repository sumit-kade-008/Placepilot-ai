import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { SchemeExplorer } from './components/SchemeExplorer';
import { ScholarshipPortal } from './components/ScholarshipPortal';
import { EligibilityEngineView } from './components/EligibilityEngineView';
import { DocumentStudio } from './components/DocumentStudio';
import { ApplicationFormStudio } from './components/ApplicationFormStudio';
import { HumanApprovalCenter } from './components/HumanApprovalCenter';
import { ApplicationTracker } from './components/ApplicationTracker';
import { ReminderPlanner } from './components/ReminderPlanner';
import { SchemeSaathiChat } from './components/SchemeSaathiChat';
import { CitizenProfileView } from './components/CitizenProfileView';
import { AdminWorkspace } from './components/AdminWorkspace';
import { SchemeDetailsModal } from './components/SchemeDetailsModal';
import { OfficialRedirectModal } from './components/OfficialRedirectModal';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { OnboardingView } from './components/auth/OnboardingView';
import { AdminAccessDenied } from './components/auth/AdminAccessDenied';
import { storage } from './utils/storage';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';
import { 
  Scheme, 
  CitizenProfile, 
  DocumentItem, 
  ApplicationDraft, 
  ReminderTask, 
  AuditLog, 
  AgentChatMessage,
  ApplicationStatus,
  StatusAttribution,
  VerificationStatus
} from './types';

export default function App() {
  // Check URL params for ?autostart=1 or ?view=... or pathname
  const urlParams = new URLSearchParams(window.location.search);
  const autostart = urlParams.get('autostart');
  const initialViewParam = urlParams.get('view');
  const path = window.location.pathname.replace(/^\//, '');

  const getInitialView = () => {
    if (initialViewParam) return initialViewParam;
    if (path === 'login' || path === 'register' || path === 'forgot-password' || path === 'onboarding' || path === 'dashboard' || path === 'admin') {
      if (path === 'forgot-password') return 'forgot_password';
      return path;
    }
    if (autostart === '1') return 'dashboard';
    return 'landing';
  };

  const [currentView, setCurrentView] = useState<string>(getInitialView);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => storage.isAuthenticated());

  // Core Persistent State
  const [profile, setProfile] = useState<CitizenProfile>(() => storage.getProfile());
  const [schemes, setSchemes] = useState<Scheme[]>(() => storage.getSchemes());
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => storage.getSavedSchemeIds());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => storage.getDocuments());
  const [applications, setApplications] = useState<ApplicationDraft[]>(() => storage.getApplications());
  const [reminders, setReminders] = useState<ReminderTask[]>(() => storage.getReminders());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => storage.getAuditLogs());
  const [chatHistory, setChatHistory] = useState<AgentChatMessage[]>(() => storage.getChatHistory());

  // Active Contexts for Modals & Workflows
  const [selectedSchemeForDetails, setSelectedSchemeForDetails] = useState<Scheme | null>(null);
  const [redirectModalData, setRedirectModalData] = useState<{ scheme: Scheme | null; url: string; label: string } | null>(null);
  const [activeWorkflowSchemeId, setActiveWorkflowSchemeId] = useState<string>('MAHA_OBC_SCHOLARSHIP');
  const [activeDraftForApproval, setActiveDraftForApproval] = useState<ApplicationDraft | null>(null);
  const [selectedExplorerCategory, setSelectedExplorerCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const completeness = storage.calculateProfileCompleteness(profile);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state changes with storage
  const handleProfileChange = (updated: CitizenProfile) => {
    setProfile(updated);
    storage.saveProfile(updated);
    storage.addAuditLog(updated.email, 'UPDATE_PROFILE', 'Citizen profile updated.');
    setAuditLogs(storage.getAuditLogs());
  };

  const handleResetDemo = () => {
    storage.resetToDemoProfile();
    const p = storage.getProfile();
    setProfile(p);
    storage.saveAuthSession(p, 'demo_token_citizen', true);
    setIsAuthenticated(true);
    showToast('Loaded Maharashtra College Student Demo Profile (Vedant Sharma, ₹1.5L Income)');
    setCurrentView('dashboard');
  };

  const handleResetAdmin = () => {
    storage.resetToAdminProfile();
    const p = storage.getProfile();
    setProfile(p);
    storage.saveAuthSession(p, 'demo_token_admin', true);
    setIsAuthenticated(true);
    setCurrentView('admin');
    showToast('Switched to Admin Role Workspace (Pooja Kulkarni)');
  };

  const handleLoginSuccess = (user: CitizenProfile, token: string, rememberMe: boolean) => {
    storage.saveAuthSession(user, token, rememberMe);
    setProfile(user);
    setIsAuthenticated(true);
    storage.addAuditLog(user.email, 'USER_LOGIN', `Logged in successfully as ${user.role}.`);
    setAuditLogs(storage.getAuditLogs());
    showToast(`Welcome back, ${user.fullName.split(' ')[0]}!`);
    if (user.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Handle Supabase OAuth Callback and Session Persistence
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Check existing session or OAuth redirect callback
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Supabase getSession error:', error.message);
        return;
      }
      if (session && session.user) {
        const email = session.user.email || '';
        const rawName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const existingProfile = storage.getProfile();
        const googleUser: CitizenProfile = {
          ...existingProfile,
          id: session.user.id || existingProfile.id,
          fullName: rawName,
          email: email,
          role: 'citizen',
          consentGiven: true
        };
        handleLoginSuccess(googleUser, session.access_token, true);

        if (window.location.pathname.includes('/auth/callback')) {
          window.history.replaceState(null, '', '/');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const email = session.user.email || '';
        const rawName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        const existingProfile = storage.getProfile();
        const googleUser: CitizenProfile = {
          ...existingProfile,
          id: session.user.id || existingProfile.id,
          fullName: rawName,
          email: email,
          role: 'citizen',
          consentGiven: true
        };
        handleLoginSuccess(googleUser, session.access_token, true);

        if (window.location.pathname.includes('/auth/callback')) {
          window.history.replaceState(null, '', '/');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRegisterSuccess = (user: CitizenProfile, token: string) => {
    storage.saveAuthSession(user, token, true);
    setProfile(user);
    setIsAuthenticated(true);
    storage.addAuditLog(user.email, 'USER_REGISTER', `New citizen account registered.`);
    setAuditLogs(storage.getAuditLogs());
    showToast(`Account created! Let's personalize your welfare folio.`);
    setCurrentView('onboarding');
  };

  const handleLogout = async () => {
    try {
      const session = storage.getAuthSession();
      if (session?.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${session.token}` }
        }).catch(() => {});
      }
    } finally {
      storage.clearAuthSession();
      setIsAuthenticated(false);
      storage.addAuditLog(profile.email, 'USER_LOGOUT', 'Signed out from session.');
      setAuditLogs(storage.getAuditLogs());
      showToast('Signed out successfully. Session state cleared.');
      setCurrentView('login');
    }
  };

  const handleOnboardingComplete = (updatedProfile: CitizenProfile) => {
    handleProfileChange(updatedProfile);
    showToast('Welfare folio personalized! Here is your citizen dashboard.');
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: string) => {
    const protectedViews = ['dashboard', 'documents', 'applications', 'approval', 'reminders', 'profile'];
    if (protectedViews.includes(view) && !isAuthenticated) {
      showToast('Please sign in to access your citizen workspace.');
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSaveScheme = (schemeId: string) => {
    const isSaved = storage.toggleSaveScheme(schemeId);
    setSavedSchemeIds(storage.getSavedSchemeIds());
    showToast(isSaved ? 'Scheme bookmarked to your folio' : 'Scheme removed from saved');
  };

  const handleSaveDocument = (doc: DocumentItem) => {
    storage.saveDocument(doc);
    setDocuments(storage.getDocuments());
    storage.addAuditLog(profile.email, 'UPLOAD_DOCUMENT', `Document '${doc.name}' stored with status: ${doc.status}`);
    setAuditLogs(storage.getAuditLogs());
    showToast(`Document "${doc.name}" updated in Document Studio`);
  };

  const handleDeleteDocument = (docId: string) => {
    storage.deleteDocument(docId);
    setDocuments(storage.getDocuments());
    showToast('Document removed');
  };

  const handleSaveDraft = (draft: ApplicationDraft) => {
    storage.saveApplication(draft);
    setApplications(storage.getApplications());
    storage.addAuditLog(profile.email, 'SAVE_DRAFT', `Application draft saved for ${draft.schemeTitle}`);
    setAuditLogs(storage.getAuditLogs());
    showToast('Application draft saved successfully');
  };

  const handleSaveReminder = (rem: ReminderTask) => {
    storage.saveReminder(rem);
    setReminders(storage.getReminders());
    showToast('Reminder saved');
  };

  const handleDeleteReminder = (remId: string) => {
    storage.deleteReminder(remId);
    setReminders(storage.getReminders());
    showToast('Reminder deleted');
  };

  const handleSaveChatHistory = (history: AgentChatMessage[]) => {
    setChatHistory(history);
    storage.saveChatHistory(history);
  };

  const handleClearChatHistory = () => {
    storage.clearChatHistory();
    setChatHistory([]);
    showToast('Chat history cleared');
  };

  const handleUpdateSourceStatus = (schemeId: string, status: VerificationStatus) => {
    const updated = schemes.map(s => s.id === schemeId ? { ...s, sourceVerificationStatus: status, lastVerifiedDate: new Date().toISOString().split('T')[0] } : s);
    setSchemes(updated);
    storage.saveSchemes(updated);
    storage.addAuditLog('admin.demo@placepilot.local', 'UPDATE_SOURCE_STATUS', `Scheme ${schemeId} marked as ${status}`);
    setAuditLogs(storage.getAuditLogs());
    showToast(`Source status updated to ${status}`);
  };

  const handleDeleteAccountData = () => {
    if (confirm('Are you sure you want to permanently clear all local PlacePilot data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Workflow bridges
  const handleCheckEligibility = (schemeId: string) => {
    setActiveWorkflowSchemeId(schemeId);
    setCurrentView('eligibility');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDocuments = (schemeId: string) => {
    setActiveWorkflowSchemeId(schemeId);
    setCurrentView('documents');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartApplication = (schemeId: string) => {
    setActiveWorkflowSchemeId(schemeId);
    setCurrentView('form_studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToApproval = (draft: ApplicationDraft) => {
    setActiveDraftForApproval(draft);
    setCurrentView('approval');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApproveAndHandoff = (draft: ApplicationDraft, audit: any) => {
    const updatedDraft: ApplicationDraft = {
      ...draft,
      isApprovedByHuman: true,
      approvalAudit: audit,
      status: 'Ready for Official Portal',
      statusAttribution: 'Officially verified',
      timeline: [
        ...draft.timeline,
        {
          status: 'Ready for Official Portal',
          timestamp: audit.approvedAt,
          note: `Approved by citizen. Checksum: ${audit.auditChecksum}. Ready for handoff to official government portal.`,
          source: 'Officially verified'
        }
      ]
    };
    handleSaveDraft(updatedDraft);

    // Open safe redirection modal
    const sch = schemes.find(s => s.id === draft.schemeId) || null;
    setRedirectModalData({
      scheme: sch,
      url: draft.officialPortalUrl || 'https://mahadbt.maharashtra.gov.in/',
      label: 'Proceed to Official Government Portal'
    });
  };

  const handleOpenOfficialUrl = (scheme: Scheme, url: string, label: string) => {
    setRedirectModalData({ scheme, url, label });
  };

  const handleActionFromChat = (actionType: string, payload?: any) => {
    if (actionType === 'check_eligibility') {
      if (typeof payload === 'string') setActiveWorkflowSchemeId(payload);
      setCurrentView('eligibility');
    } else if (actionType === 'view_documents') {
      if (typeof payload === 'string') setActiveWorkflowSchemeId(payload);
      setCurrentView('documents');
    } else if (actionType === 'start_application') {
      if (typeof payload === 'string') setActiveWorkflowSchemeId(payload);
      setCurrentView('form_studio');
    } else if (actionType === 'search') {
      if (payload === 'scholarship') setCurrentView('scholarships');
      else setCurrentView('explorer');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Full-Page Auth Views (Login, Register, Forgot Password, Onboarding)
  if (currentView === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentView('register')}
        onNavigateToForgotPassword={() => setCurrentView('forgot_password')}
        onNavigateToLanding={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <RegisterPage
        onRegisterSuccess={handleRegisterSuccess}
        onNavigateToLogin={() => setCurrentView('login')}
        onNavigateToLanding={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'forgot_password') {
    return (
      <ForgotPasswordPage
        onNavigateToLogin={() => setCurrentView('login')}
        onNavigateToLanding={() => setCurrentView('landing')}
      />
    );
  }

  if (currentView === 'onboarding') {
    return (
      <OnboardingView
        profile={profile}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#121619] text-[#fdfbf7] flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1e2732] border border-emerald-500/60 text-emerald-300 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        profile={profile}
        onProfileChange={handleProfileChange}
        onResetDemo={handleResetDemo}
        onResetAdmin={handleResetAdmin}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'landing' && (
          <LandingHero
            onNavigate={handleNavigate}
            onSelectCategory={(cat) => {
              setSelectedExplorerCategory(cat);
              setCurrentView('explorer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            featuredSchemes={schemes}
            onOpenScheme={(s) => setSelectedSchemeForDetails(s)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            profile={profile}
            completeness={completeness}
            schemes={schemes}
            documents={documents}
            applications={applications}
            reminders={reminders}
            auditLogs={auditLogs}
            onNavigate={(view, payload) => {
              if (payload?.prompt) {
                // Pass prompt to assistant
              }
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenScheme={(s) => setSelectedSchemeForDetails(s)}
          />
        )}

        {currentView === 'explorer' && (
          <SchemeExplorer
            schemes={schemes}
            language={profile.language}
            savedSchemeIds={savedSchemeIds}
            initialCategory={selectedExplorerCategory}
            onToggleSave={handleToggleSaveScheme}
            onViewDetails={(s) => setSelectedSchemeForDetails(s)}
            onCheckEligibility={handleCheckEligibility}
            onViewDocuments={handleViewDocuments}
            onOpenOfficialUrl={handleOpenOfficialUrl}
          />
        )}

        {currentView === 'scholarships' && (
          <ScholarshipPortal
            schemes={schemes}
            language={profile.language}
            profile={profile}
            onViewDetails={(s) => setSelectedSchemeForDetails(s)}
            onCheckEligibility={handleCheckEligibility}
            onViewDocuments={handleViewDocuments}
            onOpenOfficialUrl={handleOpenOfficialUrl}
          />
        )}

        {currentView === 'eligibility' && (
          <EligibilityEngineView
            schemes={schemes}
            initialSchemeId={activeWorkflowSchemeId}
            profile={profile}
            onUpdateProfile={handleProfileChange}
            onViewDocuments={handleViewDocuments}
            onStartApplication={handleStartApplication}
          />
        )}

        {currentView === 'documents' && (
          <DocumentStudio
            schemes={schemes}
            initialSchemeId={activeWorkflowSchemeId}
            documents={documents}
            onSaveDocument={handleSaveDocument}
            onDeleteDocument={handleDeleteDocument}
            onProceedToForm={handleStartApplication}
          />
        )}

        {currentView === 'form_studio' && (
          <ApplicationFormStudio
            schemes={schemes}
            initialSchemeId={activeWorkflowSchemeId}
            profile={profile}
            documents={documents}
            existingDrafts={applications}
            onSaveDraft={handleSaveDraft}
            onProceedToApproval={handleProceedToApproval}
          />
        )}

        {currentView === 'approval' && (
          <HumanApprovalCenter
            draft={activeDraftForApproval || applications[0] || null}
            scheme={schemes.find(s => s.id === (activeDraftForApproval?.schemeId || activeWorkflowSchemeId)) || schemes[0]}
            profile={profile}
            documents={documents}
            onApproveAndHandoff={handleApproveAndHandoff}
            onBackToEdit={() => setCurrentView('form_studio')}
          />
        )}

        {currentView === 'applications' && (
          <ApplicationTracker
            applications={applications}
            onOpenDraft={(draft) => {
              setActiveWorkflowSchemeId(draft.schemeId);
              setCurrentView('form_studio');
            }}
            onUpdateStatus={(appId, newStatus, attr) => {
              const updated = applications.map(a => a.id === appId ? { ...a, status: newStatus, statusAttribution: attr, updatedAt: new Date().toISOString() } : a);
              setApplications(updated);
              storage.saveApplications(updated);
              showToast(`Status updated to ${newStatus}`);
            }}
            onAddNote={(appId, note) => {
              const updated = applications.map(a => a.id === appId ? { ...a, notes: [note, ...a.notes], updatedAt: new Date().toISOString() } : a);
              setApplications(updated);
              storage.saveApplications(updated);
              showToast('Note added to application history');
            }}
            onCreateReminderForApp={(app) => {
              const rem: ReminderTask = {
                id: `rem-${Date.now()}`,
                citizenId: profile.id,
                applicationId: app.id,
                schemeTitle: app.schemeTitle,
                title: `Check official verification progress for ${app.schemeTitle}`,
                description: 'Visit official portal or call helpdesk.',
                dueDateTime: new Date(Date.now() + 86400000 * 7).toISOString(),
                isCompleted: false,
                priority: 'HIGH',
                createdAt: new Date().toISOString()
              };
              handleSaveReminder(rem);
              setCurrentView('reminders');
            }}
            onOpenOfficialPortal={(url) => {
              setRedirectModalData({
                scheme: null,
                url,
                label: 'Open Official Government Portal'
              });
            }}
          />
        )}

        {currentView === 'assistant' && (
          <SchemeSaathiChat
            profile={profile}
            chatHistory={chatHistory}
            onSaveChatHistory={handleSaveChatHistory}
            onClearChatHistory={handleClearChatHistory}
            onNavigateToAction={handleActionFromChat}
          />
        )}

        {currentView === 'reminders' && (
          <ReminderPlanner
            reminders={reminders}
            applications={applications}
            onSaveReminder={handleSaveReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {currentView === 'profile' && (
          <CitizenProfileView
            profile={profile}
            completeness={completeness}
            onSaveProfile={handleProfileChange}
            onResetDemo={handleResetDemo}
            onResetAdmin={handleResetAdmin}
            onDeleteAccount={handleDeleteAccountData}
          />
        )}

        {currentView === 'admin' && (
          profile.role === 'admin' ? (
            <AdminWorkspace
              schemes={schemes}
              auditLogs={auditLogs}
              onSaveScheme={(s) => {
                const updated = schemes.map(item => item.id === s.id ? s : item);
                setSchemes(updated);
                storage.saveSchemes(updated);
                showToast(`Scheme "${s.title}" updated in catalogue`);
              }}
              onUpdateSourceStatus={handleUpdateSourceStatus}
            />
          ) : (
            <AdminAccessDenied
              currentUser={profile}
              onReturnToDashboard={() => setCurrentView('dashboard')}
              onSwitchToAdminDemo={handleResetAdmin}
            />
          )
        )}
      </main>

      {/* Scheme Details Modal */}
      {selectedSchemeForDetails && (
        <SchemeDetailsModal
          scheme={selectedSchemeForDetails}
          language={profile.language}
          onClose={() => setSelectedSchemeForDetails(null)}
          onCheckEligibility={handleCheckEligibility}
          onViewDocuments={handleViewDocuments}
          onStartApplication={handleStartApplication}
          onOpenOfficialUrl={handleOpenOfficialUrl}
        />
      )}

      {/* Mandatory Official Redirection Modal */}
      {redirectModalData && (
        <OfficialRedirectModal
          scheme={redirectModalData.scheme}
          targetUrl={redirectModalData.url}
          actionLabel={redirectModalData.label}
          onClose={() => setRedirectModalData(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
