import React from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, X, CheckCircle2, Lock } from 'lucide-react';
import { Scheme } from '../types';

interface OfficialRedirectModalProps {
  scheme: Scheme | null;
  targetUrl: string;
  actionLabel?: string;
  onClose: () => void;
}

export const OfficialRedirectModal: React.FC<OfficialRedirectModalProps> = ({
  scheme,
  targetUrl,
  actionLabel = 'Apply on Official Portal',
  onClose
}) => {
  if (!scheme && !targetUrl) return null;

  const urlObj = (() => {
    try {
      return new URL(targetUrl);
    } catch {
      return null;
    }
  })();

  const isGovDomain = urlObj?.hostname.endsWith('.gov.in') || urlObj?.hostname.endsWith('.nic.in');
  const isHttps = urlObj?.protocol === 'https:';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#181f26] border border-[#2e3a47] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Official Government Portal Redirection</h3>
            <p className="text-xs text-zinc-400">PlacePilot AI • Safe External Handoff</p>
          </div>
        </div>

        {/* Scheme & Target Details */}
        <div className="bg-[#12161a] border border-[#242e38] rounded-xl p-4 mb-5 space-y-3">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium">Scheme Selected:</span>
            <p className="text-sm font-semibold text-zinc-100">{scheme?.title || 'Government Welfare Portal'}</p>
            <p className="text-xs text-emerald-400">{scheme?.department}</p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80">
            <span className="text-[11px] text-zinc-400 font-medium">Verified Government Destination:</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-zinc-300 font-mono break-all select-all flex-1">
                {targetUrl}
              </span>
            </div>
          </div>

          {/* Security / Verification Badge */}
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            {isGovDomain ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified .gov.in / .nic.in Domain</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/60 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>External Institutional Portal</span>
              </span>
            )}

            {isHttps && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-teal-950/60 text-teal-300 border border-teal-700/60">
                <Lock className="w-3 h-3 text-teal-400" />
                <span>Encrypted SSL (HTTPS)</span>
              </span>
            )}
          </div>
        </div>

        {/* Safe Notice */}
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          You are leaving PlacePilot AI to access the verified official government portal. PlacePilot assists you in preparing documents and prefilling your draft, but consequential application submission is completed on the government portal. Never share OTPs or passwords.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/60 flex items-center space-x-2 transition"
          >
            <span>{actionLabel}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
