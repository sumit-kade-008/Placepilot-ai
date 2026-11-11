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
  Sparkles, 
  AlertCircle, 
  UserCheck, 
  ShieldAlert,
  Compass,
  FileCheck2,
  Languages
} from 'lucide-react';
import { CitizenProfile } from '../../types';
import { validateEmail } from '../../utils/authValidator';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient';

interface LoginPageProps {
  onLoginSuccess: (user: CitizenProfile, token: string, rememberMe: boolean) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  onNavigateToLanding
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const handleGoogleLogin = async () => {
    if (isLoading || isGoogleLoading) return;
    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);

      if (!isSupabaseConfigured()) {
        throw new Error(
          "Supabase Google OAuth is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment, and configure Google Client ID & Secret in your Supabase Dashboard (Authentication > Providers > Google)."
        );
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error("Google authentication URL was not returned.");
      }

      // If browser hasn't automatically redirected, proceed to returned OAuth URL
      if (typeof window !== 'undefined' && data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Google OAuth error:", error);
      setErrorMessage(error.message || "Google login failed.");
      setIsGoogleLoading(false);
    }
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    const errors: { email?: string; password?: string } = {};

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error;
    }
    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate. Please check your credentials.');
      }

      onLoginSuccess(data.user, data.token, rememberMe);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoType: 'citizen' | 'admin') => {
    if (demoType === 'citizen') {
      setEmail('citizen.demo@placepilot.local');
      setPassword('Password123!');
    } else {
      setEmail('admin.demo@placepilot.local');
      setPassword('AdminPassword2026!');
    }
    setValidationErrors({});
    setErrorMessage(null);
  };

  const handleQuickDemoSignIn = async (demoType: 'citizen' | 'admin') => {
    fillDemoAccount(demoType);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const targetEmail = demoType === 'citizen' ? 'citizen.demo@placepilot.local' : 'admin.demo@placepilot.local';
      const targetPass = demoType === 'citizen' ? 'Password123!' : 'AdminPassword2026!';
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: targetPass })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');
      onLoginSuccess(data.user, data.token, true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1215] text-[#fdfbf7] flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb/Back link */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={onNavigateToLanding}
          className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-emerald-400 transition"
        >
          <span>← Back to PlacePilot AI Home</span>
        </button>
        <span className="text-[11px] text-zinc-500 font-mono">
          SECURE CITIZEN ACCESS • TLS 1.3
        </span>
      </div>

      <div className="max-w-6xl w-full mx-auto bg-[#141a1f] border border-[#242e38] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* ============================================================== */}
        {/* LEFT PANEL: Branding & Visual Experience                       */}
        {/* Deep emerald, charcoal, warm cream & subtle orange accents    */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 relative bg-gradient-to-br from-[#0a231b] via-[#0f1d1c] to-[#121619] p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#242e38]">
          {/* Subtle Ambient Glowing Gradients */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-300/30">
                <Bot className="w-7 h-7 text-[#0d1e18]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold tracking-tight text-[#fdfbf7]">
                    PlacePilot<span className="text-emerald-400"> AI</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-600/40">
                    Scheme Saathi
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 font-medium">
                  RULES DECIDE. AI ASSISTS. HUMANS APPROVE.
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#fdfbf7] leading-snug">
                Your welfare benefits journey,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                  finally connected.
                </span>
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-md">
                Discover government schemes, understand your eligibility, prepare applications and track your benefits — all in one place.
              </p>
            </div>
          </div>

          {/* Graphic Illustration: Citizen Welfare Access */}
          <div className="relative z-10 my-4 p-5 rounded-2xl bg-[#0b1b16]/70 border border-emerald-500/20 backdrop-blur-sm shadow-inner">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/40">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-200">MahaDBT • NSP • myScheme Integration</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                22 Schemes Live
              </span>
            </div>

            {/* 3 Mandated Feature Highlights */}
            <div className="space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Discover eligible schemes</h4>
                  <p className="text-[11px] text-zinc-400">
                    Deterministic rules engine checks your income, caste, and education against gazette criteria.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck2 className="w-4 h-4 text-teal-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Prepare applications easily</h4>
                  <p className="text-[11px] text-zinc-400">
                    Auto-fill drafts, extract document data, and review with mandatory human sign-off.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Languages className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#fdfbf7]">Access assistance in your language</h4>
                  <p className="text-[11px] text-zinc-400">
                    Complete support in English, हिंदी, and मराठी with instant voice/text guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AgentX Hackathon PS-01 • Tech Dynamites</span>
            </span>
            <span>Shree L.R. Tiwari CoE</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: Login Form                                        */}
        {/* ============================================================== */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-[#141a1f]">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#fdfbf7]">
                Welcome Back
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Sign in to continue your welfare benefits journey.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Authentication Error</p>
                  <p className="text-red-300/90">{errorMessage}</p>
                  {errorMessage.includes('Supabase Google OAuth') && (
                    <div className="mt-2.5 pt-2 border-t border-red-800/60 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoSignIn('citizen')}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-[11px] transition shadow-sm"
                      >
                        <span>⚡ Sign In as Citizen Demo (Instant)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoSignIn('admin')}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-medium text-[11px] transition shadow-sm"
                      >
                        <span>🛡️ Sign In as Admin Demo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              {/* 1. Email Address */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationErrors.email) {
                        setValidationErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="name@placepilot.local or personal email"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1b2229] border text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${
                      validationErrors.email ? 'border-red-500/80 ring-1 ring-red-500' : 'border-[#2d3844] focus:border-emerald-500'
                    }`}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-[11px] text-red-400 mt-1">{validationErrors.email}</p>
                )}
              </div>

              {/* 2. Password & 3. Show/Hide */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Password
                  </label>
                  {/* 5. Forgot Password Link */}
                  <button
                    type="button"
                    onClick={onNavigateToForgotPassword}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 hover:underline transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationErrors.password) {
                        setValidationErrors(prev => ({ ...prev, password: undefined }));
                      }
                    }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl bg-[#1b2229] border text-sm text-[#fdfbf7] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition ${
                      validationErrors.password ? 'border-red-500/80 ring-1 ring-red-500' : 'border-[#2d3844] focus:border-emerald-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-[11px] text-red-400 mt-1">{validationErrors.password}</p>
                )}
              </div>

              {/* 4. Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#1b2229] border-[#2d3844] text-emerald-600 focus:ring-emerald-500/50 focus:ring-offset-0"
                  />
                  <span className="text-xs text-zinc-300">Remember this device</span>
                </label>
                <span className="text-[11px] text-zinc-500">24-hour session</span>
              </div>

              {/* 6. Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-[#0d1e18] shadow-lg shadow-emerald-950/50 hover:shadow-emerald-900/60 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to PlacePilot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* 7. Divider with OR */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#26313d]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#141a1f] px-3 text-zinc-400 font-semibold tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* 8. Google Sign-In Option via Supabase OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-[#2d3844] bg-[#1a2026] hover:bg-[#202830] text-zinc-200 text-xs font-semibold flex items-center justify-center space-x-2.5 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* ============================================================== */}
          {/* SECTION 5 DEMO LOGIN (Mandated for Hackathon Testing)           */}
          {/* ============================================================== */}
          <div className="mt-6 pt-5 border-t border-[#242e38]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>1-Click Hackathon Demo Logins</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Dev Sandbox</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {/* Citizen Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('citizen')}
                className="p-2.5 rounded-xl bg-[#19231f] hover:bg-[#1e2c26] border border-emerald-600/30 text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Citizen Demo</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    OBC • ₹1.5L
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-300 truncate">
                  citizen.demo@placepilot.local
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Vedant Sharma (MH College Student)
                </p>
              </button>

              {/* Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('admin')}
                className="p-2.5 rounded-xl bg-[#231e18] hover:bg-[#2c251e] border border-amber-600/30 text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Admin Demo</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    Role: Admin
                  </span>
                </div>
                <p className="text-[11px] font-mono text-zinc-300 truncate">
                  admin.demo@placepilot.local
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Pooja Kulkarni (Welfare Officer)
                </p>
              </button>
            </div>

            {/* 9. Create an Account Link */}
            <div className="text-center">
              <span className="text-xs text-zinc-400">
                New to PlacePilot AI?{' '}
              </span>
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition"
              >
                Create a Citizen Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
