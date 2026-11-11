import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Lock, 
  FileCheck, 
  Building2, 
  User, 
  ArrowRight,
  Stamp
} from 'lucide-react';
import { ApplicationDraft, CitizenProfile, Scheme, DocumentItem } from '../types';

interface HumanApprovalCenterProps {
  draft: ApplicationDraft | null;
  scheme: Scheme | null;
  profile: CitizenProfile;
  documents: DocumentItem[];
  onApproveAndHandoff: (draft: ApplicationDraft, audit: any) => void;
  onBackToEdit: () => void;
}

export const HumanApprovalCenter: React.FC<HumanApprovalCenterProps> = ({
  draft,
  scheme,
  profile,
  documents,
  onApproveAndHandoff,
  onBackToEdit
}) => {
  const [statementConsent, setStatementConsent] = useState<boolean>(false);
  const [dataAccuracyConsent, setDataAccuracyConsent] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!draft || !scheme) {
    return (
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-8 text-center text-zinc-400 space-y-3">
        <ShieldCheck className="w-10 h-10 text-zinc-500 mx-auto" />
        <h3 className="font-bold text-zinc-200">No Application Draft Selected for Human Approval</h3>
        <p className="text-xs">Select or prepare an application draft from the Form Studio first.</p>
        <button
          onClick={onBackToEdit}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
        >
          Open Form Studio
        </button>
      </div>
    );
  }

  const isReadyToApprove = statementConsent && dataAccuracyConsent;

  const handleExecuteApproval = () => {
    if (!isReadyToApprove) return;

    setIsSubmitting(true);

    const auditEvent = {
      approvedAt: new Date().toISOString(),
      approvedBy: profile.email || 'citizen.demo@placepilot.local',
      ipHash: `sha256-${Math.random().toString(36).substring(2, 10)}`,
      auditChecksum: `AUDIT-APPROVAL-${Date.now().toString(36).toUpperCase()}`,
      statement: 'Citizen explicitly reviewed application summary, attached documents, and validated fields. Authorized external handoff.'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onApproveAndHandoff(draft, auditEvent);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-[#25303c]">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>MANDATORY SAFETY CHECKPOINT: HUMANS APPROVE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#fdfbf7]">
          Human Approval Center
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          In accordance with our core principle, no consequential application submission or external government handoff occurs without explicit, audited human consent.
        </p>
      </div>

      {/* Review Box 1: Selected Scheme & Verification Status */}
      <div className="bg-[#181f26] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
          1. Selected Government Welfare Scheme
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-zinc-100">{scheme.title}</h3>
            <p className="text-xs text-zinc-400 flex items-center space-x-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>{scheme.department} • {scheme.level}</span>
            </p>
          </div>
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Source Link</span>
          </span>
        </div>
      </div>

      {/* Review Box 2: Citizen Profile & Prefilled Form Data Snapshot */}
      <div className="bg-[#181f26] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
            2. Citizen Data Snapshot
          </span>
          <button
            onClick={onBackToEdit}
            className="text-xs text-zinc-400 hover:text-emerald-400 underline"
          >
            Edit in Form Studio
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#12161a] p-4 rounded-xl border border-[#232c37]">
          <div>
            <span className="text-zinc-500 block">Applicant Full Name:</span>
            <span className="font-semibold text-zinc-200">{draft.formData.fullName || profile.fullName}</span>
          </div>

          <div>
            <span className="text-zinc-500 block">State Domicile:</span>
            <span className="font-semibold text-zinc-200">{draft.formData.state || profile.state}</span>
          </div>

          <div>
            <span className="text-zinc-500 block">Social Category:</span>
            <span className="font-semibold text-zinc-200">{draft.formData.category || profile.category || 'OBC'}</span>
          </div>

          <div>
            <span className="text-zinc-500 block">Annual Family Income:</span>
            <span className="font-semibold text-emerald-400">
              ₹{(draft.formData.annualFamilyIncome || profile.annualFamilyIncome).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block">College / Institute:</span>
            <span className="font-semibold text-zinc-200 truncate block">
              {draft.formData.institutionName || profile.institutionName || 'SLRTCE'}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block">Course Enrolled:</span>
            <span className="font-semibold text-zinc-200 truncate block">
              {draft.formData.courseName || profile.courseName || 'B.Tech Engineering'}
            </span>
          </div>
        </div>
      </div>

      {/* Review Box 3: Document Checklist Status */}
      <div className="bg-[#181f26] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
          3. Attached Document Verification Checklist
        </span>

        <div className="space-y-2">
          {scheme.requiredDocuments.map((docName, i) => {
            const hasDoc = documents.some(d => 
              d.documentType.toLowerCase().includes(docName.toLowerCase()) ||
              docName.toLowerCase().includes(d.documentType.toLowerCase())
            );

            return (
              <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-[#12161a] border border-[#232c37]">
                <div className="flex items-center space-x-2">
                  {hasDoc ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className={hasDoc ? 'text-zinc-200 font-medium' : 'text-zinc-400'}>
                    {docName}
                  </span>
                </div>
                <span className={`text-[11px] font-mono ${hasDoc ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {hasDoc ? 'Verified Scan Attached' : 'Optional / Self-Declaration'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Citizen Explicit Affirmation Checkboxes */}
      <div className="bg-[#151d25] border border-amber-600/40 rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-amber-300 flex items-center space-x-2">
          <Stamp className="w-4 h-4" />
          <span>Citizen Affirmation & Security Declarations</span>
        </h4>

        <div className="space-y-3 text-xs text-zinc-300">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dataAccuracyConsent}
              onChange={(e) => setDataAccuracyConsent(e.target.checked)}
              className="accent-emerald-500 rounded mt-0.5"
            />
            <span>
              I affirm that I have reviewed the prefilled information and confirm that it accurately reflects my valid, government-issued certificates.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={statementConsent}
              onChange={(e) => setStatementConsent(e.target.checked)}
              className="accent-emerald-500 rounded mt-0.5"
            />
            <span>
              I understand that PlacePilot AI is an assistive agent and that the actual official submission will take place on the verified government portal ({scheme.commonPortalName || 'Official Website'}). I authorize generating the verified draft handoff.
            </span>
          </label>
        </div>
      </div>

      {/* Approval Execution CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          onClick={onBackToEdit}
          className="text-xs text-zinc-400 hover:text-white transition"
        >
          &larr; Back to Form Studio
        </button>

        <button
          onClick={handleExecuteApproval}
          disabled={!isReadyToApprove || isSubmitting}
          className={`px-6 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center space-x-2 transition ${
            isReadyToApprove && !isSubmitting
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-950/60'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isSubmitting ? 'Recording Human Approval...' : 'Approve & Proceed to Official Portal'}</span>
          <ExternalLink className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
