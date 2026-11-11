import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Compass, 
  RotateCcw, 
  CheckCircle2, 
  MapPin, 
  Building2, 
  SlidersHorizontal 
} from 'lucide-react';
import { Scheme, Language } from '../types';
import { SCHEME_CATEGORIES } from '../data/schemes';
import { SchemeCard } from './SchemeCard';

interface SchemeExplorerProps {
  schemes: Scheme[];
  language: Language;
  savedSchemeIds: string[];
  initialCategory?: string;
  onToggleSave: (id: string) => void;
  onViewDetails: (scheme: Scheme) => void;
  onCheckEligibility: (schemeId: string) => void;
  onViewDocuments: (schemeId: string) => void;
  onOpenOfficialUrl: (scheme: Scheme, url: string, label: string) => void;
}

export const SchemeExplorer: React.FC<SchemeExplorerProps> = ({
  schemes,
  language,
  savedSchemeIds,
  initialCategory,
  onToggleSave,
  onViewDetails,
  onCheckEligibility,
  onViewDocuments,
  onOpenOfficialUrl
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [onlyAccepting, setOnlyAccepting] = useState<boolean>(false);
  const [onlyScholarships, setOnlyScholarships] = useState<boolean>(false);
  const [maxIncome, setMaxIncome] = useState<number>(1000000); // 10 Lakhs max slider

  const statesList = useMemo(() => {
    const states = new Set<string>();
    schemes.forEach(s => {
      if (s.state && s.state !== 'All India') states.add(s.state);
    });
    return Array.from(states).sort();
  }, [schemes]);

  const filteredSchemes = useMemo(() => {
    return schemes.filter(s => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q) || (s.titleHi && s.titleHi.toLowerCase().includes(q)) || (s.titleMr && s.titleMr.toLowerCase().includes(q));
        const matchDesc = s.description.toLowerCase().includes(q);
        const matchDept = s.department.toLowerCase().includes(q);
        const matchTags = s.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchDept && !matchTags) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && s.category !== selectedCategory) {
        return false;
      }

      // Government Level filter
      if (selectedLevel !== 'All' && s.level !== selectedLevel) {
        return false;
      }

      // State filter
      if (selectedState !== 'All') {
        if (s.state !== selectedState && s.state !== 'All India') return false;
      }

      // Accepting applications only
      if (onlyAccepting && !s.acceptingApplications) {
        return false;
      }

      // Only scholarships
      if (onlyScholarships && !s.isScholarship) {
        return false;
      }

      return true;
    });
  }, [schemes, searchTerm, selectedCategory, selectedLevel, selectedState, onlyAccepting, onlyScholarships, maxIncome]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSelectedState('All');
    setOnlyAccepting(false);
    setOnlyScholarships(false);
    setMaxIncome(1000000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>Government Scheme Explorer</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Nationwide catalogue of verified Central and State Government welfare schemes & assistance programs.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#182028] border border-[#2d3a48] text-zinc-300 font-mono">
            Showing <strong className="text-emerald-400">{filteredSchemes.length}</strong> of {schemes.length} Schemes
          </span>
          <button
            onClick={handleResetFilters}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            title="Reset All Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by scheme name, keywords (e.g. tuition, farmer, ladki bahin, health, hostel)..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Category */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-white"
            >
              <option value="All">All Categories (14)</option>
              {SCHEME_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Govt Level */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">Government Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-white"
            >
              <option value="All">All Levels (Central & State)</option>
              <option value="Central">Central Government Only</option>
              <option value="State">State Government Only</option>
            </select>
          </div>

          {/* State / UT */}
          <div>
            <label className="text-zinc-400 font-medium block mb-1">State / UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-lg text-white"
            >
              <option value="All">All India / Any State</option>
              <option value="Maharashtra">Maharashtra</option>
              {statesList.filter(s => s !== 'Maharashtra').map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Quick Toggles */}
          <div className="flex flex-col justify-end space-y-1.5">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyScholarships}
                onChange={(e) => setOnlyScholarships(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 rounded"
              />
              <span className="text-zinc-300">Scholarships Only</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAccepting}
                onChange={(e) => setOnlyAccepting(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 rounded"
              />
              <span className="text-zinc-300">Accepting Applications</span>
            </label>
          </div>
        </div>
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              language={language}
              isSaved={savedSchemeIds.includes(scheme.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
              onCheckEligibility={onCheckEligibility}
              onViewDocuments={onViewDocuments}
              onOpenOfficialUrl={onOpenOfficialUrl}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <Compass className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="font-bold text-zinc-200 text-base">No schemes match your filter criteria</h3>
          <p className="text-xs text-zinc-400">
            Try adjusting your search keywords, clearing state filters or selecting &quot;All Categories&quot;.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
