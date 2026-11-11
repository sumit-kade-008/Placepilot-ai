import React, { useState, useEffect, useMemo } from 'react';
import { 
  Send, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Scheme, CitizenProfile, DocumentItem, ApplicationDraft } from '../types';
import { getFormTemplateForScheme } from '../data/formTemplates';
import { validateApplicationForm } from '../utils/formValidator';

interface ApplicationFormStudioProps {
  schemes: Scheme[];
  initialSchemeId?: string;
  profile: CitizenProfile;
  documents: DocumentItem[];
  existingDrafts: ApplicationDraft[];
  onSaveDraft: (draft: ApplicationDraft) => void;
  onProceedToApproval: (draft: ApplicationDraft) => void;
}

export const ApplicationFormStudio: React.FC<ApplicationFormStudioProps> = ({
  schemes,
  initialSchemeId = 'MAHA_OBC_SCHOLARSHIP',
  profile,
  documents,
  existingDrafts,
  onSaveDraft,
  onProceedToApproval
}) => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(initialSchemeId);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<boolean>(false);

  const selectedScheme = schemes.find(s => s.id === selectedSchemeId) || schemes[0];
  const template = useMemo(() => getFormTemplateForScheme(selectedSchemeId), [selectedSchemeId]);
  const allFields = useMemo(() => template.sections.flatMap(s => s.fields), [template]);

  // Load existing draft or prefill from profile + OCR
  useEffect(() => {
    const existing = existingDrafts.find(d => d.schemeId === selectedSchemeId);
    if (existing && existing.formData && Object.keys(existing.formData).length > 0) {
      setFormData(existing.formData);
      return;
    }

    // Prefill from Profile & Extracted Documents
    const prefilled: Record<string, any> = {};

    template.sections.forEach(sec => {
      sec.fields.forEach(field => {
        // Profile mapping
        if (field.profileMapping && (profile as any)[field.profileMapping] !== undefined) {
          prefilled[field.name] = (profile as any)[field.profileMapping];
        }

        // Document Extraction mapping
        if (field.documentExtractionMapping) {
          const matchDoc = documents.find(d => 
            d.documentType.toLowerCase().includes(field.documentExtractionMapping!.documentType.toLowerCase()) ||
            field.documentExtractionMapping!.documentType.toLowerCase().includes(d.documentType.toLowerCase())
          );
          if (matchDoc?.extractedData?.[field.documentExtractionMapping.field]) {
            prefilled[field.name] = matchDoc.extractedData[field.documentExtractionMapping.field];
          }
        }
      });
    });

    setFormData(prefilled);
  }, [selectedSchemeId, profile, documents, existingDrafts, template]);

  const validation = useMemo(() => {
    return validateApplicationForm(allFields, formData);
  }, [allFields, formData]);

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetToProfile = () => {
    const prefilled: Record<string, any> = {};
    template.sections.forEach(sec => {
      sec.fields.forEach(field => {
        if (field.profileMapping && (profile as any)[field.profileMapping] !== undefined) {
          prefilled[field.name] = (profile as any)[field.profileMapping];
        }
      });
    });
    setFormData(prefilled);
  };

  const handleSaveDraft = () => {
    const existing = existingDrafts.find(d => d.schemeId === selectedSchemeId);
    const draft: ApplicationDraft = {
      id: existing ? existing.id : `app-${Date.now()}`,
      citizenId: profile.id,
      schemeId: selectedScheme.id,
      schemeTitle: selectedScheme.title,
      schemeCategory: selectedScheme.category,
      status: 'Draft In Progress',
      statusAttribution: 'PlacePilot-generated',
      formData,
      validationErrors: validation.errors,
      isApprovedByHuman: false,
      notes: existing?.notes || [`Draft saved with ${validation.completionPercentage}% fields completed.`],
      timeline: existing?.timeline || [
        { status: 'Draft In Progress', timestamp: new Date().toISOString(), note: 'Application form prefilled and edited.', source: 'PlacePilot-generated' }
      ],
      officialPortalUrl: selectedScheme.officialApplicationUrl || selectedScheme.officialSourceUrl,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveDraft(draft);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleProceedToHumanApproval = () => {
    const existing = existingDrafts.find(d => d.schemeId === selectedSchemeId);
    const draft: ApplicationDraft = {
      id: existing ? existing.id : `app-${Date.now()}`,
      citizenId: profile.id,
      schemeId: selectedScheme.id,
      schemeTitle: selectedScheme.title,
      schemeCategory: selectedScheme.category,
      status: validation.isValid ? 'Ready for Review' : 'Draft In Progress',
      statusAttribution: 'PlacePilot-generated',
      formData,
      validationErrors: validation.errors,
      isApprovedByHuman: false,
      notes: existing?.notes || [],
      timeline: existing?.timeline || [],
      officialPortalUrl: selectedScheme.officialApplicationUrl || selectedScheme.officialSourceUrl,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDraft(draft);
    onProceedToApproval(draft);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Application Form Studio</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Automated field prefill from profile & verified document extraction. Draft storage & live validation.
          </p>
        </div>

        {/* Progress & Save */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block font-medium">Form Completion</span>
            <span className="text-sm font-black text-emerald-400">{validation.completionPercentage}%</span>
          </div>
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-medium flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Application draft successfully saved to your profile!</span>
        </div>
      )}

      {/* Scheme Selector & Draft Bar */}
      <div className="bg-[#171f27] border border-[#283543] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-zinc-300 block mb-1.5 uppercase tracking-wider">
            Preparing Application Draft For:
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full px-3.5 py-2 bg-[#12161a] border border-[#2d3947] rounded-xl text-sm font-semibold text-white"
          >
            {schemes.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleResetToProfile}
          className="text-xs text-zinc-400 hover:text-emerald-400 flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Re-sync from Profile</span>
        </button>
      </div>

      {/* Validation Banner */}
      {!validation.isValid && validation.errors.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-1.5">
          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>{validation.errors.length} Required Field(s) Pending Correction</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-200/80 pl-1 space-y-0.5">
            {validation.errors.slice(0, 3).map((err, i) => (
              <li key={i}>{err.message}</li>
            ))}
            {validation.errors.length > 3 && (
              <li>...and {validation.errors.length - 3} other field(s)</li>
            )}
          </ul>
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        {template.sections.map((section) => (
          <div key={section.id} className="bg-[#181f26] border border-[#2a3643] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#fdfbf7] flex items-center space-x-2 pb-3 border-b border-[#25303c]">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{section.title}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => {
                const val = formData[field.name] ?? '';
                const hasError = validation.errors.some(e => e.field === field.name);

                return (
                  <div key={field.id} className={field.type === 'textarea' || field.type === 'checkbox' ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1 flex items-center justify-between">
                      <span>
                        {field.label} {field.required && <span className="text-rose-400 font-bold">*</span>}
                      </span>
                      {field.profileMapping && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Auto-filled
                        </span>
                      )}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={val}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className={`w-full p-2.5 bg-[#12161a] border rounded-xl text-xs text-white focus:outline-none ${
                          hasError ? 'border-rose-500' : 'border-[#2d3947] focus:border-emerald-500'
                        }`}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={val}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        className={`w-full p-2.5 bg-[#12161a] border rounded-xl text-xs text-white focus:outline-none ${
                          hasError ? 'border-rose-500' : 'border-[#2d3947] focus:border-emerald-500'
                        }`}
                      >
                        <option value="">-- Select {field.label} --</option>
                        {field.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'checkbox' ? (
                      <label className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={Boolean(val)}
                          onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                          className="accent-emerald-500 rounded"
                        />
                        <span>{field.label}</span>
                      </label>
                    ) : (
                      <input
                        type={field.type}
                        value={val}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className={`w-full p-2.5 bg-[#12161a] border rounded-xl text-xs text-white focus:outline-none ${
                          hasError ? 'border-rose-500' : 'border-[#2d3947] focus:border-emerald-500'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="bg-[#141b22] border border-[#273441] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-zinc-100">
            Form Ready for Review
          </h4>
          <p className="text-xs text-zinc-400">
            RULES DECIDE. AI ASSISTS. HUMANS APPROVE. Proceed to the Human Approval Center before final external handoff.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={handleSaveDraft}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#222b35] hover:bg-[#2c3743] text-zinc-200 border border-zinc-700 font-semibold text-xs transition"
          >
            Save Draft
          </button>

          <button
            onClick={handleProceedToHumanApproval}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 flex items-center justify-center space-x-1.5 transition"
          >
            <span>Review & Approve</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
