import React from 'react';
import { 
  Bot, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Send, 
  Bell, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { CitizenProfile, Scheme, DocumentItem, ApplicationDraft, ReminderTask, AuditLog } from '../types';

interface DashboardViewProps {
  profile: CitizenProfile;
  completeness: number;
  schemes: Scheme[];
  documents: DocumentItem[];
  applications: ApplicationDraft[];
  reminders: ReminderTask[];
  auditLogs: AuditLog[];
  onNavigate: (view: string, payload?: any) => void;
  onOpenScheme: (scheme: Scheme) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  completeness,
  schemes,
  documents,
  applications,
  reminders,
  auditLogs,
  onNavigate,
  onOpenScheme
}) => {
  const verifiedDocsCount = documents.filter(d => d.verifiedByCitizen).length;
  const pendingReminders = reminders.filter(r => !r.isCompleted);
  const activeDraftsCount = applications.length;

  // Matching schemes for student from Maharashtra with ₹1.5L income
  const relevantSchemes = schemes.filter(s => 
    s.state === 'Maharashtra' || s.level === 'Central'
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#17222c] via-[#141d24] to-[#12161a] border border-[#273441] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Citizen Workspace • Verified Profile</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#fdfbf7] tracking-tight">
            Namaste, {profile.fullName}!
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Welcome to your PlacePilot AI welfare dashboard. Your profile is set for{' '}
            <strong className="text-emerald-400">{profile.state}</strong> domicile with an annual income of{' '}
            <strong className="text-emerald-400">₹{profile.annualFamilyIncome.toLocaleString('en-IN')}</strong> ({profile.category || 'OBC'} category).
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('assistant', { prompt: "I am a college student from Maharashtra. My family's annual income is approximately ₹1,50,000. Find scholarships that I may qualify for." })}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950 flex items-center space-x-1.5 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Scheme Saathi AI</span>
            </button>

            <button
              onClick={() => onNavigate('eligibility')}
              className="px-4 py-2 rounded-xl bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Check Scheme Eligibility</span>
            </button>

            <button
              onClick={() => onNavigate('documents')}
              className="px-4 py-2 rounded-xl bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center space-x-1.5 transition"
            >
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Profile Completeness */}
        <div 
          onClick={() => onNavigate('profile')}
          className="bg-[#182028] border border-[#2b3744] hover:border-emerald-500/40 p-4 rounded-2xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Profile Completeness</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white">{completeness}%</span>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${completeness}%` }} />
          </div>
        </div>

        {/* Verified Documents */}
        <div 
          onClick={() => onNavigate('documents')}
          className="bg-[#182028] border border-[#2b3744] hover:border-teal-500/40 p-4 rounded-2xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Verified Documents</span>
            <FileText className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-2xl font-black text-white">{verifiedDocsCount}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Ready for prefill</span>
        </div>

        {/* Active Applications */}
        <div 
          onClick={() => onNavigate('applications')}
          className="bg-[#182028] border border-[#2b3744] hover:border-amber-500/40 p-4 rounded-2xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Active Drafts / Apps</span>
            <Send className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">{activeDraftsCount}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Tracked in folio</span>
        </div>

        {/* Pending Reminders */}
        <div 
          onClick={() => onNavigate('reminders')}
          className="bg-[#182028] border border-[#2b3744] hover:border-rose-500/40 p-4 rounded-2xl cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Pending Tasks</span>
            <Bell className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-black text-white">{pendingReminders.length}</span>
          <span className="text-[11px] text-zinc-500 block mt-1">Follow-ups scheduled</span>
        </div>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Matched Schemes & Active Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Matched Schemes Spotlight */}
          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25303c]">
              <div>
                <h3 className="font-bold text-sm text-[#fdfbf7]">
                  Recommended Schemes for Your Profile
                </h3>
                <p className="text-xs text-zinc-400">
                  Based on state: {profile.state}, Income: ₹{profile.annualFamilyIncome.toLocaleString('en-IN')}, Category: {profile.category || 'OBC'}
                </p>
              </div>
              <button
                onClick={() => onNavigate('explorer')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
              >
                <span>View All ({schemes.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {relevantSchemes.map((sch) => (
                <div
                  key={sch.id}
                  onClick={() => onOpenScheme(sch)}
                  className="p-3.5 rounded-xl bg-[#12161a] border border-[#232c37] hover:border-emerald-500/40 cursor-pointer transition flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {sch.level}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-100 group-hover:text-emerald-300 transition">
                        {sch.title}
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {sch.benefits[0]}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition flex-shrink-0 mt-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Active Application Status Tracker Snippet */}
          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25303c]">
              <h3 className="font-bold text-sm text-[#fdfbf7] flex items-center space-x-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Active Application In Progress</span>
              </h3>
              <button
                onClick={() => onNavigate('applications')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Open Full Tracker &rarr;
              </button>
            </div>

            {applications.length > 0 ? (
              <div className="bg-[#12161a] border border-[#232c37] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {applications[0].status}
                    </span>
                    <h4 className="font-bold text-sm text-zinc-100 mt-1">
                      {applications[0].schemeTitle}
                    </h4>
                  </div>
                  <button
                    onClick={() => onNavigate('approval')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                  >
                    Review Approval
                  </button>
                </div>

                <p className="text-xs text-zinc-400">
                  {applications[0].notes[0] || 'Draft ready with verified human approval checkpoint.'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No applications currently active.</p>
            )}
          </div>
        </div>

        {/* Right Col: Upcoming Tasks & Activity Feed */}
        <div className="space-y-6">
          {/* Upcoming Reminders Card */}
          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25303c]">
              <h3 className="font-bold text-sm text-[#fdfbf7] flex items-center space-x-1.5">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Upcoming Reminders</span>
              </h3>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-xs text-amber-400 hover:underline"
              >
                Planner &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {reminders.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-[#12161a] border border-[#232c37] text-xs space-y-1">
                  <span className="font-semibold text-zinc-200 block truncate">{r.title}</span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Due: {new Date(r.dueDateTime).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Log Snippet */}
          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-bold text-sm text-[#fdfbf7] flex items-center space-x-1.5 pb-3 border-b border-[#25303c]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Recent Activity & Audit Log</span>
            </h3>

            <div className="space-y-2 text-xs">
              {auditLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="p-2.5 rounded-lg bg-[#12161a] border border-zinc-800 space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span className="font-bold text-emerald-400">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug line-clamp-2">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
