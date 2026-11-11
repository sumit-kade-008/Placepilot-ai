import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Building2, 
  FileText, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Scheme, Language, CitizenProfile } from '../types';

interface ScholarshipPortalProps {
  schemes: Scheme[];
  language: Language;
  profile: CitizenProfile;
  onViewDetails: (scheme: Scheme) => void;
  onCheckEligibility: (schemeId: string) => void;
  onViewDocuments: (schemeId: string) => void;
  onOpenOfficialUrl: (scheme: Scheme, url: string, label: string) => void;
}

export const ScholarshipPortal: React.FC<ScholarshipPortalProps> = ({
  schemes,
  language,
  profile,
  onViewDetails,
  onCheckEligibility,
  onViewDocuments,
  onOpenOfficialUrl
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('2025-26');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const scholarships = useMemo(() => {
    return schemes.filter(s => s.isScholarship);
  }, [schemes]);

  const filteredScholarships = useMemo(() => {
    return scholarships.filter(s => {
      // Academic year
      if (selectedYear !== 'All' && s.academicYear && s.academicYear !== selectedYear) {
        return false;
      }

      // State
      if (selectedState !== 'All') {
        if (s.state !== selectedState && s.state !== 'All India') return false;
      }

      // Type / tag filter
      if (selectedType !== 'All') {
        const matchesType = s.tags.some(t => t.toLowerCase() === selectedType.toLowerCase()) ||
          s.title.toLowerCase().includes(selectedType.toLowerCase());
        if (!matchesType) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [scholarships, selectedYear, selectedType, selectedState, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#17222c] via-[#141d24] to-[#12161a] border border-[#273441] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-700/60 text-teal-300 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Dedicated Scholarship Discovery Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-[#fdfbf7] tracking-tight">
            Higher Education & Skill Scholarships
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            Discover post-matric, pre-matric, merit-cum-means, girl child, and reserved category scholarships for academic year {selectedYear}. Verified against official guidelines from MahaDBT, NSP, and AICTE.
          </p>

          {/* Citizen Profile Snapshot Badge */}
          <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-xs text-zinc-300">
            <span className="text-zinc-500">Current Student:</span>
            <span className="font-semibold text-emerald-400">{profile.fullName}</span>
            <span className="text-zinc-600">•</span>
            <span>{profile.educationLevel || 'Undergraduate'}</span>
            <span className="text-zinc-600">•</span>
            <span>Family Income: ₹{profile.annualFamilyIncome.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-4 shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Academic Year */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">Academic Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-white font-medium"
            >
              <option value="2025-26">2025-26 (Current Academic Session)</option>
              <option value="2026-27">2026-27 (Upcoming Session)</option>
              <option value="All">All Academic Years</option>
            </select>
          </div>

          {/* Scholarship Type */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">Scholarship Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-white"
            >
              <option value="All">All Types</option>
              <option value="OBC">OBC Post-Matric</option>
              <option value="SC">SC Post-Matric</option>
              <option value="EBC">EBC / General Concession</option>
              <option value="Girls">Girls Education (AICTE Pragati / Begum)</option>
              <option value="Merit">Merit-cum-Means (NSP CSSS / NMMSS)</option>
              <option value="Hostel">Hostel Allowance</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">State Level</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-white"
            >
              <option value="Maharashtra">Maharashtra State Schemes</option>
              <option value="All">Central & All India</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">Search Scholarships</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by college, tuition, etc."
                className="w-full pl-8 pr-3 py-1.5 bg-[#12161a] border border-[#2d3947] rounded-lg text-xs text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scholarships List */}
      <div className="space-y-4">
        {filteredScholarships.map((sch) => {
          // Check quick heuristic eligibility against student profile
          const isIncomeEligible = sch.id === 'MAHA_OBC_SCHOLARSHIP'
            ? profile.annualFamilyIncome <= 150000 && profile.category === 'OBC' && profile.state === 'Maharashtra'
            : sch.id === 'MAHA_EBC_SCHOLARSHIP'
            ? profile.annualFamilyIncome <= 800000 && profile.state === 'Maharashtra'
            : true;

          return (
            <div 
              key={sch.id}
              className="bg-[#181f26] border border-[#2b3744] hover:border-teal-500/50 rounded-2xl p-5 shadow-lg transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/60">
                      {sch.academicYear || '2025-26'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      {sch.level} • {sch.state}
                    </span>
                    <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{sch.commonPortalName || 'Official Portal'}</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => onViewDetails(sch)}
                    className="text-base sm:text-lg font-bold text-[#fdfbf7] hover:text-teal-300 cursor-pointer transition"
                  >
                    {sch.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{sch.department}</span>
                  </p>
                </div>

                {/* Instant Assessment Indicator */}
                <div className="sm:text-right flex-shrink-0">
                  {isIncomeEligible ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Likely Eligible for You</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-medium">
                      <span>Requires Rule Check</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Benefits & Eligibility Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#12161a] border border-[#232c37] p-3 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                    Scholarship Financial Benefit
                  </span>
                  <p className="text-zinc-200">{sch.benefits[0]}</p>
                </div>

                <div className="bg-[#12161a] border border-[#232c37] p-3 rounded-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Income & Academic Criteria
                  </span>
                  <p className="text-zinc-200">{sch.eligibilitySummary}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#25303c] text-xs">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Deadline: {sch.applicationDeadline || 'Open for 2025-26'}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onCheckEligibility(sch.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Check My Eligibility</span>
                  </button>

                  <button
                    onClick={() => onViewDocuments(sch.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 transition flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Documents ({sch.requiredDocuments.length})</span>
                  </button>

                  <button
                    onClick={() => onOpenOfficialUrl(sch, sch.officialApplicationUrl, 'Apply on Official Portal')}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold transition flex items-center space-x-1"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
