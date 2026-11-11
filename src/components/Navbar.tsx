import React, { useState } from 'react';
import { 
  Compass, 
  GraduationCap, 
  CheckCircle2, 
  FileText, 
  Send, 
  Bot, 
  Bell, 
  User, 
  ShieldCheck, 
  Globe, 
  Menu, 
  X,
  Sparkles,
  ExternalLink,
  Lock,
  LogOut,
  LogIn
} from 'lucide-react';
import { CitizenProfile, Language } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  profile: CitizenProfile;
  onProfileChange: (p: CitizenProfile) => void;
  onResetDemo: () => void;
  onResetAdmin: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  profile,
  onProfileChange,
  onResetDemo,
  onResetAdmin,
  isAuthenticated,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'explorer', label: 'Scheme Explorer', icon: Compass },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'applications', label: 'Applications', icon: Send },
    { id: 'assistant', label: 'AI Assistant', icon: Bot, highlight: true },
    { id: 'reminders', label: 'Reminders', icon: Bell },
  ];

  const handleLangChange = (lang: Language) => {
    onProfileChange({ ...profile, language: lang });
    setLangMenuOpen(false);
  };

  const getLangLabel = () => {
    switch (profile.language) {
      case 'hi': return 'हिंदी';
      case 'mr': return 'मराठी';
      default: return 'English';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#121619] border-b border-[#232a31] shadow-lg">
      {/* Top GovTech Assurance Banner */}
      <div className="bg-[#192026] text-xs text-[#a0aec0] px-4 py-1 border-b border-[#232a31] flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">RULES DECIDE. AI ASSISTS. HUMANS APPROVE.</span>
          <span className="hidden md:inline text-zinc-500">|</span>
          <span className="hidden md:inline text-zinc-400">AgentX PS-01: Scheme Saathi • Tech Dynamites</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline-block text-zinc-400">Verified Portals: MahaDBT • NSP • myScheme</span>
          <button 
            onClick={() => onNavigate('admin')}
            className={`text-xs px-2 py-0.5 rounded transition ${profile.role === 'admin' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-amber-300'}`}
          >
            {profile.role === 'admin' ? 'Admin Mode (Active)' : 'Admin Login'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-600 flex items-center justify-center shadow-md shadow-emerald-950">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-[#fdfbf7]">
                  PlacePilot<span className="text-emerald-400"> AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                  Scheme Saathi
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Your welfare benefits journey, finally connected.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : item.highlight
                      ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-[#1a2026]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language & Citizen Switcher */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#1a2026] border border-[#2a343d] text-xs text-zinc-200 hover:border-zinc-500 transition"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium">{getLangLabel()}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#1a2026] border border-[#2d3741] rounded-lg shadow-xl py-1 z-50">
                  <button
                    onClick={() => handleLangChange('en')}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-emerald-600/20 hover:text-emerald-300 flex items-center justify-between"
                  >
                    <span>English</span>
                    {profile.language === 'en' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleLangChange('hi')}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-emerald-600/20 hover:text-emerald-300 flex items-center justify-between"
                  >
                    <span>हिंदी (Hindi)</span>
                    {profile.language === 'hi' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => handleLangChange('mr')}
                    className="w-full text-left px-3 py-1.5 text-xs text-zinc-200 hover:bg-emerald-600/20 hover:text-emerald-300 flex items-center justify-between"
                  >
                    <span>मराठी (Marathi)</span>
                    {profile.language === 'mr' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar & Logout / Login Switcher */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1a2026] border border-[#2d3741] hover:border-emerald-500/50 transition group"
                  title="Citizen Folio & Profile"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    profile.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {profile.role === 'admin' ? 'A' : (profile.fullName[0] || 'C')}
                  </div>
                  <div className="text-left text-xs leading-tight">
                    <p className="font-semibold text-zinc-200 group-hover:text-emerald-300 transition truncate max-w-[90px]">
                      {profile.role === 'admin' ? 'Admin' : profile.fullName.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {profile.role === 'admin' ? 'Administrator' : `${profile.category || 'Citizen'}`}
                    </p>
                  </div>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-[#1a2026] border border-[#2d3741] hover:bg-red-950/40 hover:border-red-800 text-zinc-400 hover:text-red-300 transition"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1a2026] border border-[#2d3741] hover:border-emerald-500/50 text-xs font-semibold text-zinc-200 hover:text-white transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-[#0d1e18] transition shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => onNavigate('assistant')}
              className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/40"
              aria-label="AI Assistant"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1a2026] text-zinc-300 hover:text-white"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#161c21] border-b border-[#2a343d] px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs text-zinc-400 font-medium">Select Language:</span>
            <div className="flex space-x-1">
              <button 
                onClick={() => handleLangChange('en')} 
                className={`text-xs px-2 py-1 rounded ${profile.language === 'en' ? 'bg-emerald-600 text-white' : 'bg-[#212930] text-zinc-300'}`}
              >
                EN
              </button>
              <button 
                onClick={() => handleLangChange('hi')} 
                className={`text-xs px-2 py-1 rounded ${profile.language === 'hi' ? 'bg-emerald-600 text-white' : 'bg-[#212930] text-zinc-300'}`}
              >
                हिंदी
              </button>
              <button 
                onClick={() => handleLangChange('mr')} 
                className={`text-xs px-2 py-1 rounded ${profile.language === 'mr' ? 'bg-emerald-600 text-white' : 'bg-[#212930] text-zinc-300'}`}
              >
                मराठी
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-lg text-xs font-medium text-left flex items-center space-x-2 ${
                    isActive
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#1b2229] text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-xs">
            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="text-zinc-300 hover:text-emerald-400 flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Edit Profile ({profile.fullName})</span>
            </button>
            <button
              onClick={() => {
                if (profile.role === 'admin') onResetDemo();
                else onResetAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-amber-400 text-xs font-medium"
            >
              {profile.role === 'admin' ? 'Switch to Citizen' : 'Switch to Admin'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
