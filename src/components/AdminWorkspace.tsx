import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Activity, 
  FileText, 
  Lock,
  Edit2,
  Trash2,
  History
} from 'lucide-react';
import { Scheme, AuditLog, VerificationStatus } from '../types';
import { SCHEME_CATEGORIES } from '../data/schemes';

interface AdminWorkspaceProps {
  schemes: Scheme[];
  auditLogs: AuditLog[];
  onSaveScheme: (scheme: Scheme) => void;
  onUpdateSourceStatus: (schemeId: string, status: VerificationStatus) => void;
}

export const AdminWorkspace: React.FC<AdminWorkspaceProps> = ({
  schemes,
  auditLogs,
  onSaveScheme,
  onUpdateSourceStatus
}) => {
  const [activeTab, setActiveTab] = useState<'schemes' | 'sources' | 'analytics' | 'audit'>('analytics');
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

  // Analytics Metrics
  const totalSchemes = schemes.length;
  const verifiedSchemes = schemes.filter(s => s.sourceVerificationStatus === 'VERIFIED').length;
  const pendingSchemes = schemes.filter(s => s.sourceVerificationStatus === 'PENDING').length;
  const brokenSchemes = schemes.filter(s => s.sourceVerificationStatus === 'BROKEN').length;
  const scholarshipsCount = schemes.filter(s => s.isScholarship).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#25303c]">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-[#fdfbf7] flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>Admin Government Portal Workspace</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
              ADMIN ROLE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage nationwide scheme catalogue, verify official government sources, monitor broken URLs, and inspect audit logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#25303c] space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'analytics' ? 'border-amber-400 text-amber-300' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Analytics & Health
        </button>
        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'schemes' ? 'border-amber-400 text-amber-300' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Scheme Management ({schemes.length})
        </button>
        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'sources' ? 'border-amber-400 text-amber-300' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Source Verification Monitor
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 transition border-b-2 ${
            activeTab === 'audit' ? 'border-amber-400 text-amber-300' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Security & Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#182028] border border-[#2b3744] p-4 rounded-2xl">
              <span className="text-xs text-zinc-400 font-medium block">Total Catalogue Schemes</span>
              <span className="text-2xl font-black text-white mt-1 block">{totalSchemes}</span>
              <span className="text-[10px] text-zinc-500 mt-1 block">Central + State</span>
            </div>

            <div className="bg-[#182028] border border-emerald-800/50 p-4 rounded-2xl">
              <span className="text-xs text-emerald-400 font-medium block">Verified Sources</span>
              <span className="text-2xl font-black text-emerald-300 mt-1 block">{verifiedSchemes}</span>
              <span className="text-[10px] text-emerald-500 mt-1 block">Audited URLs</span>
            </div>

            <div className="bg-[#182028] border border-amber-800/50 p-4 rounded-2xl">
              <span className="text-xs text-amber-400 font-medium block">Pending Verification</span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">{pendingSchemes}</span>
              <span className="text-[10px] text-amber-500 mt-1 block">Gazette awaiting</span>
            </div>

            <div className="bg-[#182028] border border-rose-800/50 p-4 rounded-2xl">
              <span className="text-xs text-rose-400 font-medium block">Broken / 404 Links</span>
              <span className="text-2xl font-black text-rose-300 mt-1 block">{brokenSchemes}</span>
              <span className="text-[10px] text-rose-500 mt-1 block">Requires manual audit</span>
            </div>
          </div>

          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-sm text-zinc-200">System Source Verification Coverage</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              PlacePilot AI adheres strictly to the rule: <em>&quot;Never label an unofficial website as an official government website. Open verified external links in a new tab using safe external-link attributes.&quot;</em> Each portal record tracks domain suffix (.gov.in / .nic.in) and last audited date.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Scheme Management */}
      {activeTab === 'schemes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-zinc-200">All Registered Schemes</h3>
          </div>

          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12161a] text-zinc-400 uppercase tracking-wider text-[11px] border-b border-[#242e38]">
                  <tr>
                    <th className="p-3">Scheme Name</th>
                    <th className="p-3">Level / State</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Official Application URL</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242e38] text-zinc-300">
                  {schemes.map((s) => (
                    <tr key={s.id} className="hover:bg-[#1d2630]">
                      <td className="p-3 font-semibold text-zinc-100 max-w-xs truncate">
                        {s.title}
                      </td>
                      <td className="p-3">
                        {s.level} • {s.state}
                      </td>
                      <td className="p-3">{s.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.sourceVerificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300' : s.sourceVerificationStatus === 'PENDING' ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {s.sourceVerificationStatus}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-zinc-400 max-w-xs truncate">
                        {s.officialApplicationUrl || s.officialSourceUrl}
                      </td>
                      <td className="p-3">
                        <a
                          href={s.officialSourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center space-x-1"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Source Verification Monitor */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-zinc-200">
            Source Verification Audit Table
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schemes.slice(0, 8).map((s) => (
              <div key={s.id} className="bg-[#182028] border border-[#2b3744] p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-zinc-100 truncate">{s.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    s.sourceVerificationStatus === 'VERIFIED' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {s.sourceVerificationStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-zinc-400 font-mono">
                  <p className="truncate">URL: {s.officialSourceUrl}</p>
                  <p>Last Verified: {s.lastVerifiedDate}</p>
                </div>

                <div className="flex space-x-2 pt-2 border-t border-zinc-800 text-xs">
                  <button
                    onClick={() => onUpdateSourceStatus(s.id, 'VERIFIED')}
                    className="flex-1 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-semibold"
                  >
                    Mark Verified
                  </button>
                  <button
                    onClick={() => onUpdateSourceStatus(s.id, 'BROKEN')}
                    className="flex-1 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-semibold"
                  >
                    Flag Broken
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Security & Audit Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-zinc-200 flex items-center space-x-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Immutable Application & Human Approval Audit Trail</span>
          </h3>

          <div className="bg-[#182028] border border-[#2b3744] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#12161a] text-zinc-400 uppercase tracking-wider text-[11px] border-b border-[#242e38]">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Actor</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242e38] text-zinc-300">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#1d2630]">
                      <td className="p-3 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-3 font-mono text-zinc-200">{log.actor}</td>
                      <td className="p-3 font-bold text-emerald-400">{log.action}</td>
                      <td className="p-3 text-zinc-300 max-w-md">{log.details}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.level === 'SECURITY' ? 'bg-amber-950 text-amber-300' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {log.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
