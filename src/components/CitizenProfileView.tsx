import React, { useState } from 'react';
import { 
  User, 
  CheckCircle2, 
  Save, 
  Trash2, 
  ShieldCheck, 
  GraduationCap, 
  MapPin, 
  DollarSign, 
  Globe,
  RotateCcw
} from 'lucide-react';
import { CitizenProfile, Language } from '../types';

interface CitizenProfileViewProps {
  profile: CitizenProfile;
  completeness: number;
  onSaveProfile: (profile: CitizenProfile) => void;
  onResetDemo: () => void;
  onResetAdmin: () => void;
  onDeleteAccount: () => void;
}

export const CitizenProfileView: React.FC<CitizenProfileViewProps> = ({
  profile,
  completeness,
  onSaveProfile,
  onResetDemo,
  onResetAdmin,
  onDeleteAccount
}) => {
  const [formData, setFormData] = useState<CitizenProfile>({ ...profile });
  const [savedNotice, setSavedNotice] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'financial' | 'privacy'>('personal');

  const handleChange = (field: keyof CitizenProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
            <User className="w-6 h-6 text-emerald-400" />
            <span>Citizen Profile & Welfare Attributes</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Required for deterministic scheme matching. Sensitive personal data is strictly optional and stored locally.
          </p>
        </div>

        {/* Demo Quick Switchers */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onResetDemo}
            className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-xs font-semibold text-emerald-300 transition"
          >
            Load MH Student Demo
          </button>
          <button
            onClick={onResetAdmin}
            className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-xs font-semibold text-amber-300 transition"
          >
            Admin Demo
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile saved successfully! Eligibility calculations will reflect your updated data.</span>
        </div>
      )}

      {/* Completeness Bar */}
      <div className="bg-[#182028] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-200 uppercase tracking-wider">
            Profile Completeness
          </span>
          <span className="font-mono font-bold text-emerald-400">{completeness}%</span>
        </div>
        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="text-[11px] text-zinc-400">
          A more complete profile enables PlacePilot to discover more relevant state and central government benefits.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#25303c] space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'personal'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Personal & Domicile
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'academic'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Education & Course
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'financial'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Financial & Household
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'privacy'
              ? 'border-emerald-400 text-emerald-300'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Privacy, Consent & Language
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="bg-[#182028] border border-[#2b3744] rounded-2xl p-6 shadow-xl space-y-6">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Age / Date of Birth</label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Gender</label>
              <select
                value={formData.gender || 'Male'}
                onChange={(e) => handleChange('gender', e.target.value as any)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Social Category *</label>
              <select
                value={formData.category || 'OBC'}
                onChange={(e) => handleChange('category', e.target.value as any)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="OBC">Other Backward Classes (OBC)</option>
                <option value="General">General / Open</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="Minority">Minority (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">State of Permanent Domicile *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">District</label>
              <input
                type="text"
                value={formData.district || ''}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Current Education Level</label>
              <select
                value={formData.educationLevel || 'Undergraduate'}
                onChange={(e) => handleChange('educationLevel', e.target.value as any)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="10th">Class 10th (Secondary)</option>
                <option value="12th">Class 12th (Higher Secondary)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="Undergraduate">Undergraduate Degree (e.g. B.Tech, B.Sc, B.Com)</option>
                <option value="Postgraduate">Postgraduate Degree (e.g. M.Tech, M.Sc, MBA)</option>
                <option value="Doctoral">Doctoral (Ph.D.)</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Course / Branch Name</label>
              <input
                type="text"
                value={formData.courseName || ''}
                onChange={(e) => handleChange('courseName', e.target.value)}
                placeholder="e.g. B.Tech Computer Engineering"
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Institution / College Name</label>
              <input
                type="text"
                value={formData.institutionName || ''}
                onChange={(e) => handleChange('institutionName', e.target.value)}
                placeholder="e.g. Shree L.R. Tiwari College of Engineering"
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Previous Academic Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.previousMarksPercentage || ''}
                onChange={(e) => handleChange('previousMarksPercentage', Number(e.target.value))}
                placeholder="e.g. 84.5"
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Academic Year</label>
              <select
                value={formData.currentAcademicYear || '2025-26'}
                onChange={(e) => handleChange('currentAcademicYear', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Annual Family Income (₹) *</label>
              <input
                type="number"
                required
                value={formData.annualFamilyIncome}
                onChange={(e) => handleChange('annualFamilyIncome', Number(e.target.value))}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white font-mono text-emerald-400 font-bold"
              />
              <span className="text-[10px] text-zinc-500 mt-0.5 block">
                Must match your income certificate issued by the Tehsildar / revenue authority.
              </span>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Occupation</label>
              <input
                type="text"
                value={formData.occupation || 'Student'}
                onChange={(e) => handleChange('occupation', e.target.value)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              />
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Ration Card Type</label>
              <select
                value={formData.rationCardType || 'BPL'}
                onChange={(e) => handleChange('rationCardType', e.target.value as any)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="BPL">Below Poverty Line (BPL - Yellow)</option>
                <option value="Antyodaya">Antyodaya Anna Yojana (AAY)</option>
                <option value="APL">Above Poverty Line (APL - Orange/White)</option>
                <option value="None">None</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Area Type</label>
              <select
                value={formData.areaType || 'Urban'}
                onChange={(e) => handleChange('areaType', e.target.value as any)}
                className="w-full p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="Urban">Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4 text-xs text-zinc-300">
            <div>
              <label className="text-zinc-300 font-semibold block mb-1">Preferred Language</label>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value as Language)}
                className="w-full sm:w-64 p-2.5 bg-[#12161a] border border-[#2d3947] rounded-xl text-white"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={(e) => handleChange('consentGiven', e.target.checked)}
                  className="accent-emerald-500 rounded"
                />
                <span>
                  I grant consent for PlacePilot AI to evaluate my profile deterministically against government welfare scheme rules.
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-rose-950/60 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-rose-300">Delete Account & Data</h5>
                <p className="text-[11px] text-zinc-500">
                  Permanently clear all local stored documents, drafts, and profile information.
                </p>
              </div>
              <button
                type="button"
                onClick={onDeleteAccount}
                className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs transition"
              >
                Delete Account Data
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-3 border-t border-[#25303c]">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
