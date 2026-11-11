import React from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  ArrowRight,
  ShieldCheck, 
  AlertTriangle,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { Scheme, Language } from '../types';

interface SchemeDetailsModalProps {
  scheme: Scheme | null;
  language: Language;
  onClose: () => void;
  onCheckEligibility: (schemeId: string) => void;
  onViewDocuments: (schemeId: string) => void;
  onStartApplication: (schemeId: string) => void;
  onOpenOfficialUrl: (scheme: Scheme, url: string, label: string) => void;
}

export const SchemeDetailsModal: React.FC<SchemeDetailsModalProps> = ({
  scheme,
  language,
  onClose,
  onCheckEligibility,
  onViewDocuments,
  onStartApplication,
  onOpenOfficialUrl
}) => {
  if (!scheme) return null;

  const getTitle = () => {
    if (language === 'hi' && scheme.titleHi) return scheme.titleHi;
    if (language === 'mr' && scheme.titleMr) return scheme.titleMr;
    return scheme.title;
  };

  const getDesc = () => {
    if (language === 'hi' && scheme.descriptionHi) return scheme.descriptionHi;
    if (language === 'mr' && scheme.descriptionMr) return scheme.descriptionMr;
    return scheme.description;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-[#181f26] border border-[#2e3a47] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#29333e] flex items-start justify-between bg-[#141a20] rounded-t-2xl">
          <div className="pr-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                scheme.level === 'Central' ? 'bg-amber-950 text-amber-300 border border-amber-700/60' : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
              }`}>
                {scheme.level === 'Central' ? 'Central Government' : `${scheme.state} State Scheme`}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {scheme.category}
              </span>
              {scheme.isScholarship && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/60 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Scholarship</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#fdfbf7] leading-snug">
              {getTitle()}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{scheme.department}</span>
              {scheme.ministry && <span className="text-zinc-500">• {scheme.ministry}</span>}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition flex-shrink-0"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm text-zinc-300">
          {/* Overview */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              1. Scheme Overview
            </h4>
            <p className="leading-relaxed text-zinc-200">
              {getDesc()}
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-[#12161a] border border-[#242e38] rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>2. Benefits & Financial Assistance</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {scheme.benefits.map((b, i) => (
                <li key={i} className="flex items-start space-x-2 text-zinc-200">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility Conditions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              3. Eligibility Conditions
            </h4>
            <div className="bg-[#13181d] border border-zinc-800 rounded-xl p-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
              {scheme.eligibilitySummary}
            </div>
          </div>

          {/* Required Documents */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
              <span>4. Required Document Checklist ({scheme.requiredDocuments.length})</span>
              <button 
                onClick={() => {
                  onClose();
                  onViewDocuments(scheme.id);
                }}
                className="text-[11px] text-emerald-300 hover:underline font-normal"
              >
                Open in Document Studio &rarr;
              </button>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scheme.requiredDocuments.map((doc, idx) => (
                <div key={idx} className="flex items-center space-x-2 bg-[#141b22] border border-[#26313d] p-2.5 rounded-lg text-zinc-300">
                  <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Process Guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              5. Official Application Process
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 pl-1 leading-relaxed">
              <li>Check your eligibility deterministically via PlacePilot AI.</li>
              <li>Upload required documents into Document Readiness Studio and confirm extracted fields.</li>
              <li>Review the prefilled application draft and sign off with human approval.</li>
              <li>Open verified official portal ({scheme.commonPortalName || 'Official Website'}) using the handoff button.</li>
              <li>Submit final verified application directly on the government portal.</li>
            </ol>
          </div>

          {/* Official URLs & Source Verification */}
          <div className="bg-[#12161a] border border-[#232c37] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Government Sources & Verification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block mb-1">Official Information Source:</span>
                <a 
                  href={scheme.officialSourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center space-x-1 font-mono truncate"
                >
                  <span className="truncate">{scheme.officialSourceUrl}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>

              {scheme.officialApplicationUrl && (
                <div>
                  <span className="text-zinc-500 block mb-1">Official Application URL:</span>
                  <a 
                    href={scheme.officialApplicationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center space-x-1 font-mono truncate"
                  >
                    <span className="truncate">{scheme.officialApplicationUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}

              {scheme.guidelinesUrl && (
                <div>
                  <span className="text-zinc-500 block mb-1">Government Circular / Guidelines:</span>
                  <a 
                    href={scheme.guidelinesUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline flex items-center space-x-1 font-mono truncate"
                  >
                    <span className="truncate">{scheme.guidelinesUrl}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              )}

              <div>
                <span className="text-zinc-500 block mb-1">Source Verification Status:</span>
                <span className={`inline-flex items-center space-x-1 font-semibold ${
                  scheme.sourceVerificationStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{scheme.sourceVerificationStatus} (Audited {scheme.lastVerifiedDate})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with Primary Actions */}
        <div className="p-4 sm:p-5 border-t border-[#29333e] bg-[#141a20] rounded-b-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onClose();
                onCheckEligibility(scheme.id);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-950 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check My Eligibility</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartApplication(scheme.id);
              }}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-950 transition"
            >
              <span>Prefill Application Draft</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div>
            {scheme.officialApplicationUrl ? (
              <button
                onClick={() => onOpenOfficialUrl(scheme, scheme.officialApplicationUrl, 'Apply on Official Portal')}
                className="px-4 py-2 rounded-xl bg-[#232c37] hover:bg-[#2e3b4a] text-emerald-300 border border-emerald-600/40 font-medium text-xs flex items-center space-x-1.5 transition"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => onOpenOfficialUrl(scheme, scheme.officialSourceUrl, 'View Official Scheme Details')}
                className="px-4 py-2 rounded-xl bg-[#232c37] hover:bg-[#2e3b4a] text-zinc-300 font-medium text-xs flex items-center space-x-1.5 transition"
              >
                <span>View Official Scheme Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
