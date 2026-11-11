import React, { useState } from 'react';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Plus, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight,
  Info
} from 'lucide-react';
import { ApplicationDraft, ApplicationStatus, StatusAttribution } from '../types';

interface ApplicationTrackerProps {
  applications: ApplicationDraft[];
  onOpenDraft: (app: ApplicationDraft) => void;
  onUpdateStatus: (appId: string, newStatus: ApplicationStatus, attribution: StatusAttribution) => void;
  onAddNote: (appId: string, note: string) => void;
  onCreateReminderForApp: (app: ApplicationDraft) => void;
  onOpenOfficialPortal: (url: string) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onOpenDraft,
  onUpdateStatus,
  onAddNote,
  onCreateReminderForApp,
  onOpenOfficialPortal
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [newNoteText, setNewNoteText] = useState<string>('');

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Approved':
      case 'Ready for Official Portal':
        return 'bg-emerald-950 text-emerald-300 border-emerald-700/60';
      case 'Submitted':
      case 'Under Review':
        return 'bg-teal-950 text-teal-300 border-teal-700/60';
      case 'Ready for Review':
      case 'Awaiting Approval':
        return 'bg-amber-950 text-amber-300 border-amber-700/60';
      case 'Rejected':
        return 'bg-rose-950 text-rose-300 border-rose-700/60';
      case 'Additional Information Required':
      case 'Documents Pending':
        return 'bg-orange-950 text-orange-300 border-orange-700/60';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getAttributionBadge = (attribution: StatusAttribution) => {
    switch (attribution) {
      case 'Officially verified':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 font-semibold">
            Officially Verified
          </span>
        );
      case 'PlacePilot-generated':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-teal-900/60 text-teal-300 border border-teal-700/50 font-semibold">
            PlacePilot Generated
          </span>
        );
      case 'Citizen-entered':
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50 font-semibold">
            Citizen Reported
          </span>
        );
      case 'Simulated demo data':
      default:
        return (
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-semibold">
            Simulated Demo Data
          </span>
        );
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeApp) return;
    onAddNote(activeApp.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
            <Send className="w-6 h-6 text-emerald-400" />
            <span>Application Progress Tracker</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Real-time status tracking with explicit evidence source attribution (Officially Verified vs Citizen Entered).
          </p>
        </div>

        <span className="text-xs px-3 py-1.5 rounded-xl bg-[#182028] border border-[#2c3846] text-zinc-300">
          Tracking <strong className="text-emerald-400">{applications.length}</strong> Applications
        </span>
      </div>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col: List of Applications */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
              Active Application Records
            </h3>

            {applications.map((app) => {
              const isSelected = app.id === activeApp?.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#1a232c] border-emerald-500/60 shadow-lg'
                      : 'bg-[#151c23] border-[#25313d] hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    {getAttributionBadge(app.statusAttribution)}
                  </div>

                  <h4 className="font-bold text-sm text-[#fdfbf7] line-clamp-1 mb-1">
                    {app.schemeTitle}
                  </h4>

                  <p className="text-xs text-zinc-400 flex items-center justify-between">
                    <span>Updated: {new Date(app.updatedAt).toLocaleDateString()}</span>
                    <span className="text-emerald-400 flex items-center space-x-0.5">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right 2 Cols: Selected Application Detail & Timeline */}
          {activeApp && (
            <div className="lg:col-span-2 space-y-5">
              {/* Application Details Card */}
              <div className="bg-[#181f26] border border-[#2b3744] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25303c]">
                  <div>
                    <span className="text-xs text-emerald-400 font-mono">
                      Ref ID: {activeApp.id}
                    </span>
                    <h3 className="text-lg font-bold text-[#fdfbf7] mt-0.5">
                      {activeApp.schemeTitle}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onOpenDraft(activeApp)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Edit Form</span>
                    </button>

                    <button
                      onClick={() => onCreateReminderForApp(activeApp)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Add Reminder</span>
                    </button>

                    {activeApp.officialPortalUrl && (
                      <button
                        onClick={() => onOpenOfficialPortal(activeApp.officialPortalUrl)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Audit Stamp Info */}
                {activeApp.approvalAudit && (
                  <div className="p-3.5 rounded-xl bg-[#131b22] border border-emerald-700/50 flex items-start space-x-3 text-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-emerald-300">
                        Human Approval Verified • Checksum: {activeApp.approvalAudit.auditChecksum}
                      </p>
                      <p className="text-zinc-400 text-[11px] mt-0.5">
                        Approved by {activeApp.approvalAudit.approvedBy} on {new Date(activeApp.approvalAudit.approvedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Status Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Progress Timeline
                  </h4>

                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#25303c]">
                    {activeApp.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3 relative text-xs">
                        <div className="w-6 h-6 rounded-full bg-[#1e2732] border border-emerald-500/60 flex items-center justify-center flex-shrink-0 z-10">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="flex-1 bg-[#12161a] p-3 rounded-xl border border-[#232c37]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-zinc-200">{step.status}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-zinc-300 text-xs">{step.note}</p>
                          <span className="inline-block text-[10px] text-zinc-500 mt-1 font-mono">
                            Attribution: {step.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citizen Notes Section */}
                <div className="pt-3 border-t border-[#25303c] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Citizen Verification Notes & Folio</span>
                  </h4>

                  <div className="space-y-2">
                    {activeApp.notes.map((note, i) => (
                      <div key={i} className="text-xs text-zinc-300 bg-[#12161a] p-2.5 rounded-lg border border-zinc-800">
                        {note}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add progress note or official acknowledgment number..."
                      className="flex-1 px-3 py-2 bg-[#12161a] border border-[#2c3745] rounded-xl text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                    >
                      Add Note
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <Clock className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="font-bold text-zinc-200">No Applications Currently Tracked</h3>
          <p className="text-xs text-zinc-400">
            Start by discovering a scheme, evaluating eligibility, and prefilling a draft.
          </p>
        </div>
      )}
    </div>
  );
};
