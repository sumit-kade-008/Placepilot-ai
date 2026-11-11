import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  ExternalLink, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Scheme, Language } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onViewDetails: (scheme: Scheme) => void;
  onCheckEligibility: (schemeId: string) => void;
  onViewDocuments: (schemeId: string) => void;
  onOpenOfficialUrl: (scheme: Scheme, url: string, label: string) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({
  scheme,
  language,
  isSaved,
  onToggleSave,
  onViewDetails,
  onCheckEligibility,
  onViewDocuments,
  onOpenOfficialUrl
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getLocalizedTitle = () => {
    if (language === 'hi' && scheme.titleHi) return scheme.titleHi;
    if (language === 'mr' && scheme.titleMr) return scheme.titleMr;
    return scheme.title;
  };

  const getLocalizedDesc = () => {
    if (language === 'hi' && scheme.descriptionHi) return scheme.descriptionHi;
    if (language === 'mr' && scheme.descriptionMr) return scheme.descriptionMr;
    return scheme.description;
  };

  const getLocalizedSummary = () => {
    if (language === 'hi' && scheme.eligibilitySummaryHi) return scheme.eligibilitySummaryHi;
    if (language === 'mr' && scheme.eligibilitySummaryMr) return scheme.eligibilitySummaryMr;
    return scheme.eligibilitySummary;
  };

  const speakScheme = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      window.speechSynthesis.cancel();
      const text = `${getLocalizedTitle()}. ${getLocalizedDesc()}`;
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'mr') utterance.lang = 'mr-IN';
      else utterance.lang = 'en-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-[#181f26] border border-[#2b3642] hover:border-emerald-500/50 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-200 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              scheme.level === 'Central'
                ? 'bg-amber-950/70 text-amber-300 border border-amber-700/50'
                : 'bg-emerald-950/70 text-emerald-300 border border-emerald-700/50'
            }`}>
              {scheme.level === 'Central' ? 'Central Govt' : `${scheme.state} State`}
            </span>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {scheme.category}
            </span>

            {scheme.isScholarship && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-950/70 text-teal-300 border border-teal-700/50 flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>Scholarship</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Audio narration */}
            <button
              onClick={speakScheme}
              title="Listen to Scheme description"
              aria-label="Listen"
              className={`p-1.5 rounded-lg border text-xs transition ${
                isPlayingAudio ? 'bg-amber-500 text-black border-amber-400' : 'bg-zinc-800/80 text-zinc-400 hover:text-white border-zinc-700'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(scheme.id)}
              title={isSaved ? 'Remove from Saved' : 'Save Scheme'}
              aria-label="Bookmark Scheme"
              className="p-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-emerald-400 border border-zinc-700 transition"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scheme Title */}
        <h3 
          onClick={() => onViewDetails(scheme)}
          className="text-base font-bold text-[#fdfbf7] group-hover:text-emerald-300 transition cursor-pointer mb-1 leading-snug"
        >
          {getLocalizedTitle()}
        </h3>

        {/* Department */}
        <p className="text-xs text-zinc-400 flex items-center space-x-1.5 mb-3">
          <Building2 className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
          <span className="truncate">{scheme.department}</span>
        </p>

        {/* Short Description */}
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
          {getLocalizedDesc()}
        </p>

        {/* Highlighted Benefits Preview */}
        <div className="bg-[#12161a] rounded-xl p-3 border border-[#232b35] mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 block">
            Key Benefit:
          </span>
          <p className="text-xs text-zinc-200 line-clamp-2">
            {scheme.benefits[0] || 'Direct benefit assistance under official guidelines.'}
          </p>
        </div>

        {/* Eligibility Summary snippet */}
        <div className="text-xs text-zinc-400 mb-4 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800/60">
          <span className="font-semibold text-zinc-300">Eligibility: </span>
          <span className="text-zinc-400 line-clamp-2">{getLocalizedSummary()}</span>
        </div>
      </div>

      <div>
        {/* Verification & Deadline row */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-[#26303b] mb-4">
          <div className="flex items-center space-x-1.5">
            {scheme.sourceVerificationStatus === 'VERIFIED' && (
              <span className="inline-flex items-center space-x-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Source</span>
              </span>
            )}
            {scheme.sourceVerificationStatus === 'PENDING' && (
              <span className="inline-flex items-center space-x-1 text-amber-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Pending Gazette</span>
              </span>
            )}
            {scheme.sourceVerificationStatus === 'BROKEN' && (
              <span className="inline-flex items-center space-x-1 text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Link Under Review</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-zinc-400">
            <Calendar className="w-3 h-3 text-zinc-500" />
            <span>Verified: {scheme.lastVerifiedDate}</span>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={() => onCheckEligibility(scheme.id)}
            className="w-full py-2 px-2.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center space-x-1 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check My Eligibility</span>
          </button>

          <button
            onClick={() => onViewDetails(scheme)}
            className="w-full py-2 px-2.5 rounded-lg bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 text-xs font-semibold flex items-center justify-center space-x-1 transition"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Redirection / Portal Buttons */}
        <div className="flex space-x-2 text-xs">
          <button
            onClick={() => onViewDocuments(scheme.id)}
            className="flex-1 py-1.5 px-2 rounded-lg bg-[#1a222a] hover:bg-[#242e39] text-zinc-300 border border-[#2b3642] flex items-center justify-center space-x-1 transition"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <span>Required Documents ({scheme.requiredDocuments.length})</span>
          </button>

          {scheme.officialApplicationUrl ? (
            <button
              onClick={() => onOpenOfficialUrl(scheme, scheme.officialApplicationUrl, 'Apply on Official Portal')}
              className="py-1.5 px-3 rounded-lg bg-emerald-700/30 hover:bg-emerald-700/50 text-emerald-300 border border-emerald-600/50 flex items-center space-x-1 font-medium transition"
              title="Open Official Verified Government Portal"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : scheme.officialSourceUrl && scheme.sourceVerificationStatus !== 'BROKEN' ? (
            <button
              onClick={() => onOpenOfficialUrl(scheme, scheme.officialSourceUrl, 'View Official Scheme Details')}
              className="py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 flex items-center space-x-1 transition"
            >
              <span>Portal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <span className="py-1.5 px-3 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40 text-[11px] flex items-center">
              Unavailable
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
