import React from 'react';
import { Bot, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1317] border-t border-[#212932] text-zinc-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-[#fdfbf7]">
                PlacePilot<span className="text-emerald-400"> AI</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your welfare benefits journey, finally connected. An agentic government scheme and scholarship assistant for Indian citizens.
            </p>
            <div className="text-[11px] text-zinc-500">
              <p>Problem Statement: AgentX — PS-01: Scheme Saathi</p>
              <p>Team: Tech Dynamites</p>
              <p>Shree L.R. Tiwari College of Engineering</p>
            </div>
          </div>

          {/* Col 2: Core Philosophy */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
              Core Principles
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Rules Decide:</strong> Deterministic rules engine calculates eligibility based on published government criteria.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-teal-400 font-bold">•</span>
                <span><strong>AI Assists:</strong> Gemini AI understands intent, organizes document checklists and explains outcomes.</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Humans Approve:</strong> Explicit citizen authorization is strictly enforced before any official handoff.</span>
              </div>
            </div>
          </div>

          {/* Col 3: Verified Discovery Sources */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-teal-400">
              Official Reference Sources
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="https://mahadbt.maharashtra.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 flex items-center space-x-1">
                  <span>MahaDBT Portal (Maharashtra)</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 flex items-center space-x-1">
                  <span>National Scholarship Portal (NSP)</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 flex items-center space-x-1">
                  <span>myScheme (Govt of India)</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 flex items-center space-x-1">
                  <span>PM-KISAN Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="https://www.umang.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 flex items-center space-x-1">
                  <span>UMANG Unified Portal</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Transparency Disclaimer */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300">
              Citizen Trust & Transparency
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              PlacePilot AI never fabricates government submission confirmations or official application statuses. All application handoffs direct to official government domains (.gov.in / .nic.in). No sensitive bank credentials, OTPs or passwords are ever requested.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1f262f] flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <p>© 2026 PlacePilot AI • PS-01: Scheme Saathi • Built for Indian Citizens</p>
          <p className="flex items-center space-x-1">
            <span>Designed with precision by Team Tech Dynamites</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
