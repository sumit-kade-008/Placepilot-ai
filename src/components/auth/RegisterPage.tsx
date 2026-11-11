import React, { useState } from 'react';
import { 
  Bot, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  MapPin, 
  Languages, 
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { CitizenProfile, Language } from '../../types';
import { checkPasswordStrength, validateRegistration } from '../../utils/authValidator';

interface RegisterPageProps {
  onRegisterSuccess: (user: CitizenProfile, token: string) => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding: () => void;
}

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Uttar Pradesh',
  'Gujarat',
  'Delhi',
  'Tamil Nadu',
  'Rajasthan',
  'Madhya Pradesh',
  'West Bengal',
  'Bihar',
  'Punjab',
  'Haryana',
  'Telangana',
  'Kerala',
  'Andhra Pradesh',
  'Odisha',
  'Assam',
  'Jharkhand',
  'Chhattisgarh',
  'Uttarakhand',
  'Himachal Pradesh',
  'Goa'
];

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateToLanding
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const strength = checkPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const check = validateRegistration({
      fullName,
      email,
      password,
      confirmPassword,
      state,
      district,
      language,
      termsAccepted
    });

    if (!check.isValid) {
      setFieldErrors(check.errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          confirmPassword,
          state,
          district,
          language
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please check details.');
      }

      onRegisterSuccess(data.user, data.token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1215] text-[#fdfbf7] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb */}
      <div className="max-w-4xl w-full mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-emerald-400 transition"
        >
          <span>← Back to PlacePilot AI</span>
        </button>
        <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>New Citizen Registration • Default Citizen Role</span>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto bg-[#141a1f] border border-[#242e38] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-[#0d1e18] shadow-lg mb-3">
            <Bot className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#fdfbf7]">
            Create Your PlacePilot Account
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Access verified welfare schemes, deterministic eligibility checks, and AI-assisted scholarship applications.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Registration Issue</p>
              <p className="text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleRegister} className="max-w-2xl mx-auto space-y-5">
          {/* 1. Full Legal Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Full Legal Name <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-zinc-500" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Aarav Sharma"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b2229] border text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${
                  fieldErrors.fullName ? 'border-red-500' : 'border-[#2d3844] focus:border-emerald-500'
                }`}
              />
            </div>
            {fieldErrors.fullName && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* 2. Email Address */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Email Address <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-zinc-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b2229] border text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${
                  fieldErrors.email ? 'border-red-500' : 'border-[#2d3844] focus:border-emerald-500'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-[11px] text-red-400 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* 3. Password & Confirm Password in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-zinc-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1b2229] border text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${
                    fieldErrors.password ? 'border-red-500' : 'border-[#2d3844] focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Confirm Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-zinc-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1b2229] border text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-[#2d3844] focus:border-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="p-3 rounded-xl bg-[#1b2229] border border-[#2b3540] text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-[11px]">Password Security:</span>
                <span className={`font-bold text-[11px] ${
                  strength.label === 'Strong' ? 'text-emerald-400' : strength.label === 'Medium' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {strength.label}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden flex">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                />
              </div>
              {strength.feedback.length > 0 && (
                <p className="text-[10px] text-zinc-400">
                  Tip: {strength.feedback.join(' ')}
                </p>
              )}
            </div>
          )}

          {/* 4. State & District in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                State / Union Territory <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                </div>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b2229] border border-[#2d3844] text-sm text-[#fdfbf7] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s} className="bg-[#1b2229] text-white">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {fieldErrors.state && (
                <p className="text-[11px] text-red-400 mt-1">{fieldErrors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                District / City
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g., Thane, Pune, Mumbai"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1b2229] border border-[#2d3844] text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* 5. Preferred Language */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Preferred Language for Portal & AI Assistant
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  language === 'en'
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-[#1b2229] text-zinc-400 border-[#2d3844] hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  language === 'hi'
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-[#1b2229] text-zinc-400 border-[#2d3844] hover:text-white'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setLanguage('mr')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  language === 'mr'
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-[#1b2229] text-zinc-400 border-[#2d3844] hover:text-white'
                }`}
              >
                मराठी (Marathi)
              </button>
            </div>
          </div>

          {/* 6. Terms & Privacy Acceptance */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded bg-[#1b2229] border-[#2d3844] text-emerald-600 focus:ring-emerald-500/50"
              />
              <span className="text-xs text-zinc-300 leading-relaxed">
                I accept the PlacePilot{' '}
                <span className="text-emerald-400 font-semibold underline">Terms of Service</span> and{' '}
                <span className="text-emerald-400 font-semibold underline">Citizen Privacy Charter</span>.
                I understand that PlacePilot prepares application drafts with deterministic rules, and requires my explicit human approval before any official portal submissions.
              </span>
            </label>
            {fieldErrors.termsAccepted && (
              <p className="text-[11px] text-red-400 mt-1.5">{fieldErrors.termsAccepted}</p>
            )}
          </div>

          {/* 7. Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-[#0d1e18] shadow-lg shadow-emerald-950/60 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                <span>Creating Account & Provisioning Profile...</span>
              </>
            ) : (
              <>
                <span>Create PlacePilot Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-2">
            <span className="text-xs text-zinc-400">
              Already have an account?{' '}
            </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition"
            >
              Sign In to PlacePilot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
