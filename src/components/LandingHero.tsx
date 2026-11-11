import React, { useState } from 'react';
import { 
  Bot, 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Send, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Search,
  ExternalLink
} from 'lucide-react';
import { SCHEME_CATEGORIES } from '../data/schemes';
import { Scheme } from '../types';

interface LandingHeroProps {
  onNavigate: (view: string) => void;
  onSelectCategory: (cat: string) => void;
  featuredSchemes: Scheme[];
  onOpenScheme: (s: Scheme) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onNavigate,
  onSelectCategory,
  featuredSchemes,
  onOpenScheme
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Scheme Readiness Preview State
  const [previewState, setPreviewState] = useState<'Maharashtra'>('Maharashtra');
  const [previewIncome, setPreviewIncome] = useState<number>(150000);
  const [previewEducation, setPreviewEducation] = useState<string>('Undergraduate');
  const [previewCategory, setPreviewCategory] = useState<string>('OBC');

  const faqs = [
    {
      q: 'Does PlacePilot AI decide eligibility or does AI guess it?',
      a: 'RULES DECIDE. PlacePilot AI uses a deterministic rules engine with strict condition evaluation based on published government criteria. Gemini AI assists by understanding citizen queries, organizing checklists and explaining results, but never overrides or guesses published government rules.'
    },
    {
      q: 'Will my application be submitted to the government automatically without my review?',
      a: 'HUMANS APPROVE. Consequential application submissions require explicit citizen confirmation through our Human Approval Center with an immutable audit trail. We hand you off directly to verified government portals (such as MahaDBT or NSP) with prefilled verification drafts.'
    },
    {
      q: 'What government discovery sources are verified in PlacePilot AI?',
      a: 'We reference authorized government portals including MahaDBT (Maharashtra), the National Scholarship Portal (NSP), myScheme.gov.in, PM-KISAN, and UMANG, with verified last-audit dates and clear indicators for live vs curated records.'
    },
    {
      q: 'Are my uploaded documents safe and private?',
      a: 'Yes. Documents are processed locally with client-side encryption and consent controls. PlacePilot never requests banking passwords, OTPs, or unnecessary Aadhaar biometrics.'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-[#232b35] bg-gradient-to-b from-[#121619] via-[#141a20] to-[#161d24]">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-10 w-[400px] h-[250px] bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tag / Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>AgentX Hackathon • PS-01 Scheme Saathi • Team Tech Dynamites</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#fdfbf7] tracking-tight leading-[1.15] mb-5">
              Your welfare benefits journey, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">finally connected.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed mb-8">
              PlacePilot AI is an agentic government scheme and scholarship assistant. We help citizens discover benefits, evaluate deterministic eligibility, prepare document checklists, and prefill verified applications.
            </p>

            {/* Core Principle Pill-free Trust Banner */}
            <div className="inline-flex items-center justify-center space-x-4 sm:space-x-8 px-5 py-2.5 rounded-2xl bg-[#1b232c] border border-[#2a3644] text-xs sm:text-sm font-semibold text-zinc-200 mb-8 shadow-inner">
              <span className="text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>RULES DECIDE</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-teal-400 flex items-center space-x-1.5">
                <Bot className="w-4 h-4" />
                <span>AI ASSISTS</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>HUMANS APPROVE</span>
              </span>
            </div>

            {/* Main CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-[#0d1e18] font-bold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Citizen Sign In / Register</span>
              </button>

              <button
                onClick={() => onNavigate('explorer')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1d2630] hover:bg-[#25303c] text-white border border-[#334252] font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Explore Schemes</span>
              </button>

              <button
                onClick={() => onNavigate('assistant')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1d2630] hover:bg-[#25303c] text-emerald-300 hover:text-white border border-emerald-500/40 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition cursor-pointer"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Talk to Scheme Saathi</span>
              </button>
            </div>
          </div>

          {/* 2. Interactive Product Preview: Scheme Readiness Engine Widget */}
          <div className="mt-12 max-w-4xl mx-auto bg-[#182028] border border-[#2d3a48] rounded-2xl p-5 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#283442] mb-5">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <h3 className="font-bold text-zinc-100 text-sm sm:text-base">
                  Interactive Scheme Readiness Engine Preview
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                Live Deterministic Rule Evaluation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">State Domicile</label>
                <select 
                  value={previewState} 
                  onChange={(e) => setPreviewState(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-xs text-white"
                >
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Other">Other State</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Social Category</label>
                <select 
                  value={previewCategory} 
                  onChange={(e) => setPreviewCategory(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-xs text-white"
                >
                  <option value="OBC">OBC</option>
                  <option value="General">General / EBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Annual Family Income</label>
                <select 
                  value={previewIncome} 
                  onChange={(e) => setPreviewIncome(Number(e.target.value))}
                  className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-xs text-white"
                >
                  <option value={150000}>₹1,50,000 (Low Income)</option>
                  <option value={400000}>₹4,00,000 (Mid-Low)</option>
                  <option value={750000}>₹7,50,000 (EBC Limit)</option>
                  <option value={1200000}>₹12,00,000 (Higher)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Education Level</label>
                <select 
                  value={previewEducation} 
                  onChange={(e) => setPreviewEducation(e.target.value)}
                  className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-xs text-white"
                >
                  <option value="Undergraduate">Undergraduate (College)</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="12th">Class 12th</option>
                  <option value="10th">Class 10th</option>
                </select>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-[#12171c] border border-emerald-800/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold text-xs border border-emerald-700/60">
                    MATCH: MahaDBT Post-Matric Scholarship
                  </span>
                  <span className="text-xs text-zinc-400">Target: Maharashtra College Students</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1.5">
                  {previewState === 'Maharashtra' && previewIncome <= 150000 && previewCategory === 'OBC'
                    ? '🎉 100% Eligible: 100% tuition fee reimbursement + monthly maintenance allowance on MahaDBT.'
                    : previewState === 'Maharashtra' && previewIncome <= 800000 && (previewCategory === 'General' || previewCategory === 'EBC')
                    ? '🎉 100% Eligible: Rajarshi Shahu Maharaj 50% tuition waiver for EBC students.'
                    : '⚡ Partial match: Meets general guidelines, explore Central NSP CSSS or state assistance.'}
                </p>
              </div>

              <button
                onClick={() => onNavigate('eligibility')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap transition flex items-center space-x-1"
              >
                <span>Full Test Bench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Step-by-step visual roadmap) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Agentic Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdfbf7] mt-1">
            How PlacePilot Scheme Readiness Works
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            A seamless bridge from confusion to verified government submission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#171f27] border border-[#293441] rounded-2xl p-5 relative group hover:border-emerald-500/40 transition">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center justify-center text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-zinc-100 text-sm mb-1.5">Discover & Search</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Query in English, Hindi or Marathi. Search nationwide central and state schemes from verified sources like MahaDBT, NSP and myScheme.
            </p>
          </div>

          <div className="bg-[#171f27] border border-[#293441] rounded-2xl p-5 relative group hover:border-teal-500/40 transition">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold flex items-center justify-center text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-zinc-100 text-sm mb-1.5">Rules Engine Decides</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deterministic rule evaluation ensures mathematical precision. Compare income ceilings, domicile, and academic criteria without AI hallucinations.
            </p>
          </div>

          <div className="bg-[#171f27] border border-[#293441] rounded-2xl p-5 relative group hover:border-amber-500/40 transition">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-zinc-100 text-sm mb-1.5">Document & Form Studio</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upload required certificates. Auto-extract key numbers and prefill application form drafts with zero manual re-entry.
            </p>
          </div>

          <div className="bg-[#171f27] border border-[#293441] rounded-2xl p-5 relative group hover:border-purple-500/40 transition">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold flex items-center justify-center text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-zinc-100 text-sm mb-1.5">Human Approval & Portal</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You review the summary and explicitly approve. PlacePilot securely transfers your prepared draft to the verified official government portal.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Scheme Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fdfbf7]">
              Explore Schemes by Category
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Coverage spanning education, agriculture, health, housing, and social welfare across India.
            </p>
          </div>
          <button
            onClick={() => onNavigate('explorer')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
          >
            <span>View All Schemes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SCHEME_CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectCategory(cat);
                onNavigate('explorer');
              }}
              className="p-3.5 rounded-xl bg-[#171f27] border border-[#283441] hover:border-emerald-500/50 hover:bg-[#1c2630] text-left transition flex items-center justify-between group"
            >
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-emerald-300 transition">
                {cat}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>
          ))}
        </div>
      </section>

      {/* 5. Featured Scholarships Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#151c23] border border-[#283441] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Education Empowerment</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#fdfbf7] mt-0.5">
              Featured Scholarships (Academic Year 2025-26 & 2026-27)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('scholarships')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Open Dedicated Scholarship Portal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredSchemes.filter(s => s.isScholarship).slice(0, 3).map((sch) => (
            <div 
              key={sch.id}
              onClick={() => onOpenScheme(sch)}
              className="bg-[#12161a] border border-[#242e38] hover:border-teal-500/50 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-700/60 inline-block mb-2">
                  {sch.level} • {sch.state}
                </span>
                <h4 className="font-bold text-sm text-[#fdfbf7] line-clamp-2 mb-2">
                  {sch.title}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                  {sch.benefits[0]}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Verified: {sch.lastVerifiedDate}</span>
                <span className="text-teal-400 font-semibold flex items-center space-x-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Questions & Clarifications</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#fdfbf7] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-[#171f27] border border-[#293441] rounded-xl overflow-hidden transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-zinc-200 hover:text-emerald-300"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
