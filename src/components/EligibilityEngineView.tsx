import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Building2, 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  UserCheck, 
  Edit3, 
  ShieldCheck, 
  BookOpen
} from 'lucide-react';
import { Scheme, CitizenProfile, EligibilityOutcome, EligibilityEvaluation } from '../types';
import { SCHEME_RULES } from '../data/rules';
import { evaluateSchemeEligibility } from '../utils/rulesEngine';

interface EligibilityEngineViewProps {
  schemes: Scheme[];
  initialSchemeId?: string;
  profile: CitizenProfile;
  onUpdateProfile: (p: CitizenProfile) => void;
  onViewDocuments: (schemeId: string) => void;
  onStartApplication: (schemeId: string) => void;
}

export const EligibilityEngineView: React.FC<EligibilityEngineViewProps> = ({
  schemes,
  initialSchemeId = 'MAHA_OBC_SCHOLARSHIP',
  profile,
  onUpdateProfile,
  onViewDocuments,
  onStartApplication
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId);
  const [isEditingProfileInline, setIsEditingProfileInline] = useState<boolean>(false);
  const [editableProfile, setEditableProfile] = useState<CitizenProfile>({ ...profile });

  const selectedScheme = useMemo(() => {
    return schemes.find(s => s.id === selectedSchemeId) || schemes[0];
  }, [schemes, selectedSchemeId]);

  const rule = useMemo(() => {
    return SCHEME_RULES[selectedSchemeId] || null;
  }, [selectedSchemeId]);

  // Execute deterministic engine
  const evaluation: EligibilityEvaluation = useMemo(() => {
    if (!rule) {
      return {
        schemeId: selectedSchemeId,
        outcome: 'NEEDS_OFFICIAL_VERIFICATION',
        summary: 'No automated deterministic rule registered for this scheme. Official department guidelines must be checked.',
        conditionResults: [],
        missingFields: [],
        recommendedAction: 'Verify directly on official department portal.',
        evaluatedAt: new Date().toISOString()
      };
    }
    return evaluateSchemeEligibility(rule, profile);
  }, [rule, profile, selectedSchemeId]);

  const handleSaveInlineProfile = () => {
    onUpdateProfile(editableProfile);
    setIsEditingProfileInline(false);
  };

  const getOutcomeBadge = (outcome: EligibilityOutcome) => {
    switch (outcome) {
      case 'ELIGIBLE':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-black text-sm uppercase tracking-wide">ELIGIBLE</span>
              <p className="text-[11px] text-emerald-400 font-normal">All published rules satisfied</p>
            </div>
          </div>
        );
      case 'NOT_ELIGIBLE':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-950/80 border border-rose-600 text-rose-300">
            <XCircle className="w-5 h-5 text-rose-400" />
            <div>
              <span className="font-black text-sm uppercase tracking-wide">NOT ELIGIBLE</span>
              <p className="text-[11px] text-rose-400 font-normal">Conditions not satisfied</p>
            </div>
          </div>
        );
      case 'ADDITIONAL_INFO_REQUIRED':
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-950/80 border border-amber-600 text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-black text-sm uppercase tracking-wide">INFO REQUIRED</span>
              <p className="text-[11px] text-amber-400 font-normal">Missing profile fields</p>
            </div>
          </div>
        );
      case 'NEEDS_OFFICIAL_VERIFICATION':
      default:
        return (
          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-950/80 border border-teal-600 text-teal-300">
            <HelpCircle className="w-5 h-5 text-teal-400" />
            <div>
              <span className="font-black text-sm uppercase tracking-wide">OFFICIAL VERIFICATION</span>
              <p className="text-[11px] text-teal-400 font-normal">Requires manual verification</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-[#fdfbf7]">
              Deterministic Eligibility Rules Engine
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
              RULES DECIDE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Condition-by-condition mathematical evaluation against published Government Gazette and department guidelines.
          </p>
        </div>

        <button
          onClick={() => {
            setEditableProfile({ ...profile });
            setIsEditingProfileInline(!isEditingProfileInline);
          }}
          className="px-3.5 py-2 rounded-xl bg-[#1e2732] hover:bg-[#283442] border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-emerald-300 transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditingProfileInline ? 'Cancel Inline Edit' : 'Edit Profile Attributes'}</span>
        </button>
      </div>

      {/* Scheme Selector Dropdown */}
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-4 sm:p-5 shadow-lg">
        <label className="text-xs font-bold text-zinc-300 block mb-2 uppercase tracking-wider">
          Select Government Scheme to Test
        </label>
        <select
          value={selectedSchemeId}
          onChange={(e) => setSelectedSchemeId(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
        >
          {schemes.map(s => (
            <option key={s.id} value={s.id}>
              {s.title} ({s.level} • {s.category})
            </option>
          ))}
        </select>
      </div>

      {/* Inline Profile Editor Drawer */}
      {isEditingProfileInline && (
        <div className="bg-[#161e26] border border-emerald-600/40 rounded-2xl p-5 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h4 className="font-bold text-sm text-emerald-300 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4" />
              <span>Simulate / Update Citizen Profile For Rules Check</span>
            </h4>
            <span className="text-xs text-zinc-400">Updates live in localStorage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">State Domicile</label>
              <input
                type="text"
                value={editableProfile.state}
                onChange={(e) => setEditableProfile({ ...editableProfile, state: e.target.value })}
                className="w-full p-2 bg-[#12161a] border border-zinc-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Social Category</label>
              <select
                value={editableProfile.category || 'OBC'}
                onChange={(e) => setEditableProfile({ ...editableProfile, category: e.target.value as any })}
                className="w-full p-2 bg-[#12161a] border border-zinc-700 rounded-lg text-white"
              >
                <option value="OBC">OBC</option>
                <option value="General">General</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Minority">Minority</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                value={editableProfile.annualFamilyIncome}
                onChange={(e) => setEditableProfile({ ...editableProfile, annualFamilyIncome: Number(e.target.value) })}
                className="w-full p-2 bg-[#12161a] border border-zinc-700 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1">Education Level</label>
              <select
                value={editableProfile.educationLevel || 'Undergraduate'}
                onChange={(e) => setEditableProfile({ ...editableProfile, educationLevel: e.target.value as any })}
                className="w-full p-2 bg-[#12161a] border border-zinc-700 rounded-lg text-white"
              >
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="12th">Class 12th</option>
                <option value="10th">Class 10th</option>
                <option value="Diploma">Diploma</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setIsEditingProfileInline(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveInlineProfile}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow"
            >
              Apply & Re-evaluate
            </button>
          </div>
        </div>
      )}

      {/* Outcome Verdict Card */}
      <div className="bg-[#181f26] border border-[#2b3744] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Evaluation Verdict for:
            </span>
            <span className="text-xs font-semibold text-zinc-200">{selectedScheme?.title}</span>
          </div>

          <h3 className="text-lg font-bold text-zinc-100">
            {evaluation.summary}
          </h3>

          <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">
            {evaluation.recommendedAction}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end flex-shrink-0 space-y-3">
          {getOutcomeBadge(evaluation.outcome)}
          <span className="text-[11px] text-zinc-500 font-mono">
            Evaluated: {new Date(evaluation.evaluatedAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Detailed Condition Matrix Table */}
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-[#242e39] bg-[#141b22] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm text-zinc-100">
              Published Rule Conditions Breakdown ({evaluation.conditionResults.length} Rules)
            </h4>
          </div>
          <span className="text-xs text-zinc-400 font-mono">Deterministic Logic Engine</span>
        </div>

        {evaluation.conditionResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#12161a] text-zinc-400 uppercase tracking-wider border-b border-[#232c37] font-semibold text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mandatory Rule Condition</th>
                  <th className="py-3 px-4">Citizen Profile Value</th>
                  <th className="py-3 px-4">Engine Comparison Note</th>
                  <th className="py-3 px-4">Result</th>
                  <th className="py-3 px-4">Government Guideline Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232c37] text-zinc-200">
                {evaluation.conditionResults.map((c, i) => (
                  <tr key={i} className="hover:bg-[#1a232c] transition">
                    <td className="py-3 px-4 font-medium text-zinc-100 max-w-xs">
                      {c.requirementText}
                    </td>
                    <td className="py-3 px-4 font-mono text-zinc-300">
                      {String(c.citizenValue)}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {c.comparisonNote}
                    </td>
                    <td className="py-3 px-4">
                      {c.result === 'PASS' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PASS</span>
                        </span>
                      )}
                      {c.result === 'FAIL' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-700/60 font-bold text-[11px]">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>FAIL</span>
                        </span>
                      )}
                      {c.result === 'MISSING' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 font-bold text-[11px]">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>MISSING</span>
                        </span>
                      )}
                      {c.result === 'VERIFY' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/60 font-bold text-[11px]">
                          <HelpCircle className="w-3 h-3 text-teal-400" />
                          <span>VERIFY</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-400 font-mono text-[11px] max-w-xs">
                      {c.reference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-400 text-xs">
            No specific condition criteria on file. Please refer to official department guidelines.
          </div>
        )}
      </div>

      {/* Action Next Steps Footer */}
      <div className="bg-[#141b22] border border-[#273441] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-zinc-100">
            Next Action in Scheme Readiness Journey
          </h4>
          <p className="text-xs text-zinc-400">
            {evaluation.outcome === 'ELIGIBLE' 
              ? 'Prepare your document checklist and proceed to application prefill.'
              : 'Review requirements, update profile fields, or view other schemes.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onViewDocuments(selectedScheme.id)}
            className="px-4 py-2.5 rounded-xl bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 font-semibold text-xs flex items-center space-x-1.5 transition"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Document Readiness Studio</span>
          </button>

          <button
            onClick={() => onStartApplication(selectedScheme.id)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 flex items-center space-x-1.5 transition"
          >
            <span>Prefill Application Draft</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
