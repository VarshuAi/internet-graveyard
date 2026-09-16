"use client";

import React, { useState, useEffect } from 'react';
import { 
  GraveEntity, 
  GraveyardStats, 
  DiscoveryCandidate, 
  UserSubmission,
  GraveStatus,
  GraveCategory,
  CauseCategory
} from '@/types/graveyard';
import { StatusBadge } from '@/components/StatusBadge';
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Activity, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Plus, 
  Save, 
  Search, 
  Server, 
  Layers,
  Terminal,
  AlertTriangle,
  Lock,
  Key,
  LogOut,
  Bot,
  Play,
  Sparkles,
  Globe
} from 'lucide-react';
import { ALL_SEED_ENTITIES } from '@/data/seed-entities-batch2';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'review_queue' | 'submissions' | 'entities' | 'scanner' | 'scraper'>('overview');
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState<GraveyardStats | null>(null);
  const [candidates, setCandidates] = useState<DiscoveryCandidate[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [entities, setEntities] = useState<GraveEntity[]>([]);

  // Scraper Engine State
  const [scraperSource, setScraperSource] = useState<'all' | 'wikipedia' | 'hn' | 'probe'>('all');
  const [scraperLimit, setScraperLimit] = useState(8);
  const [scraperAutoIngest, setScraperAutoIngest] = useState(false);
  const [scraperTargetDomain, setScraperTargetDomain] = useState('');
  const [scraperLoading, setScraperLoading] = useState(false);
  const [scraperReport, setScraperReport] = useState<any>(null);
  const [scraperLogs, setScraperLogs] = useState<string[]>([
    '[System Ready] Automation Scraper Engine idle. Select archival sources and execute discovery.'
  ]);

  // Live scanner state
  const [probeUrl, setProbeUrl] = useState('');
  const [probeLoading, setProbeLoading] = useState(false);
  const [probeResult, setProbeResult] = useState<any>(null);

  // Entity Editor State
  const [editingEntity, setEditingEntity] = useState<GraveEntity | null>(null);
  const [isNewEntity, setIsNewEntity] = useState(false);

  // Authentication Gate State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submittingAuth, setSubmittingAuth] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setCandidates(data.candidates || []);
        setSubmissions(data.submissions || []);
        setEntities(data.entities || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Verify auth session on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        if (res.ok) {
          setIsAuthenticated(true);
          fetchAdminData();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecking(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyInput.trim() || submittingAuth) return;

    setSubmittingAuth(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput.trim() })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasskeyInput('');
        fetchAdminData();
      } else {
        setAuthError(data.error || 'Access denied: Invalid curator passkey.');
      }
    } catch {
      setAuthError('Connection failure during authentication.');
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } finally {
      setIsAuthenticated(false);
    }
  };

  const handleCandidateAction = async (id: string, status: 'APPROVED' | 'REJECTED' | 'INVESTIGATING') => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_candidate', id, status })
      });
      if (res.ok) {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch (err) {
      console.error('Error updating candidate:', err);
    }
  };

  const handleSubmissionAction = async (id: string, status: 'APPROVED' | 'REJECTED' | 'INVESTIGATING') => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_submission', id, status })
      });
      if (res.ok) {
        setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      }
    } catch (err) {
      console.error('Error updating submission:', err);
    }
  };

  const handleRunProbe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!probeUrl.trim() || probeLoading) return;

    setProbeLoading(true);
    setProbeResult(null);
    try {
      const res = await fetch('/api/scanner/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: probeUrl })
      });
      const data = await res.json();
      if (res.ok) {
        setProbeResult(data.scan);
        fetchAdminData(); // Refresh candidates if candidate added
      }
    } catch (err) {
      console.error('Probe error:', err);
    } finally {
      setProbeLoading(false);
    }
  };

  const handleRunScraper = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (scraperLoading) return;

    setScraperLoading(true);
    setScraperReport(null);
    setScraperLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Initializing automated scrape pipeline (Source: ${scraperSource}, Limit: ${scraperLimit}, Auto-Ingest: ${scraperAutoIngest})...`
    ]);

    try {
      const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: scraperSource,
          limit: scraperLimit,
          autoIngest: scraperAutoIngest,
          targetDomain: scraperTargetDomain.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setScraperReport(data.report);
        const logLines = (data.report.logs || []).map((l: string) => `[${new Date().toLocaleTimeString()}] ${l}`);
        setScraperLogs(prev => [
          ...prev,
          ...logLines,
          `[${new Date().toLocaleTimeString()}] Pipeline completed! Discovered: ${data.report.totalDiscovered}, Auto-Ingested: ${data.report.autoIngested}, Candidates Queued: ${data.report.candidatesQueued}`
        ]);
        fetchAdminData();
      } else {
        setScraperLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] Scraper error: ${data.error || 'Unknown error'}`
        ]);
      }
    } catch (err: any) {
      setScraperLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Scraper request failed: ${err?.message || err}`
      ]);
    } finally {
      setScraperLoading(false);
    }
  };

  const handleSaveEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntity) return;

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_entity', entity: editingEntity })
      });
      if (res.ok) {
        alert('Entity successfully saved in the archives!');
        setEditingEntity(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-mono text-zinc-400">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-sm">VERIFYING CURATOR SESSION INTEGRITY...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 font-sans">
        <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-950 border-2 border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.15)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-red-950/70 border border-red-500/50 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Lock className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5" />
              <span>Restricted Archival Terminal</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              Curator Authentication
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Enter the master curator passkey to access database CRUD operations, submission moderation, and scanner controls.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-zinc-400 font-bold block">
                Curator Master Passkey:
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/15 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/70 font-mono tracking-wider"
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingAuth || !passkeyInput.trim()}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] cursor-pointer flex items-center justify-center gap-2"
            >
              {submittingAuth ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Terminal</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-white/10 text-center text-xs font-mono text-zinc-500 space-y-1">
            <div>TAMPER-PROOF AUDIT LOGGING ENABLED</div>
            <div className="text-[11px] text-zinc-600">Default key: <code className="text-zinc-400">graveyard-curator-2024</code></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-7 rounded-2xl bg-zinc-900/90 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-400">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Archaeology Command Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-md text-xs bg-red-500/15 border border-red-500/30 text-red-400 font-bold font-mono">
                ADMIN
              </span>
            </div>
            <p className="text-sm text-zinc-300 mt-1">
              Curate defunct records, moderate user reports, and monitor live scanner probes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 text-sm font-semibold cursor-pointer transition-colors shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white border border-red-500/40 text-sm font-semibold cursor-pointer transition-colors shadow-md"
            title="Lock session and exit"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Lock Terminal</span>
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-3 text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
            activeTab === 'overview' ? 'bg-white/15 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Overview Telemetry
        </button>
        <button
          onClick={() => setActiveTab('review_queue')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
            activeTab === 'review_queue' ? 'bg-white/15 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>Discovery Queue</span>
          {candidates.filter(c => c.status === 'PENDING').length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono font-bold">
              {candidates.filter(c => c.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
            activeTab === 'submissions' ? 'bg-white/15 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>User Submissions</span>
          {submissions.filter(s => s.status === 'PENDING').length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">
              {submissions.filter(s => s.status === 'PENDING').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('entities')}
          className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
            activeTab === 'entities' ? 'bg-white/15 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Entity Editor ({entities.length})
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
            activeTab === 'scanner' ? 'bg-white/15 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Activity className="w-4 h-4 text-red-400" />
          <span>Live Health Prober</span>
        </button>
        <button
          onClick={() => setActiveTab('scraper')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer font-medium ${
            activeTab === 'scraper' ? 'bg-white/15 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>Automation Scraper</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
            AI ENGINE
          </span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1.5 shadow-lg">
              <div className="text-xs font-mono text-zinc-300 uppercase font-bold tracking-wider">Total Relics Archived</div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-white">{stats.total_archived}</div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1.5 shadow-lg">
              <div className="text-xs font-mono text-zinc-300 uppercase font-bold tracking-wider">Confirmed Dead</div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-red-400">{stats.confirmed_dead}</div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1.5 shadow-lg">
              <div className="text-xs font-mono text-zinc-300 uppercase font-bold tracking-wider">At-Risk Surveillance</div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400">{stats.at_risk}</div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-1.5 shadow-lg">
              <div className="text-xs font-mono text-zinc-300 uppercase font-bold tracking-wider">Zombies & Abandoned</div>
              <div className="text-3xl sm:text-4xl font-mono font-black text-purple-400">{stats.zombie_services + stats.abandoned}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action summary */}
            <div className="p-6 rounded-xl bg-graveyard-850/60 border border-white/8 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Pending Verification Queue
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-graveyard-900 border border-white/5">
                  <span>Auto-Discovered Scanner Candidates</span>
                  <span className="font-bold text-red-400">{candidates.filter(c => c.status === 'PENDING').length} awaiting check</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-graveyard-900 border border-white/5">
                  <span>Community User Submissions</span>
                  <span className="font-bold text-amber-400">{submissions.filter(s => s.status === 'PENDING').length} in moderation</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-graveyard-900 border border-white/5">
                  <span>Digital Candles / Tributes Recorded</span>
                  <span className="font-bold text-white">{stats.total_candles_lit.toLocaleString()} tributes</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-xl bg-graveyard-850/60 border border-white/8 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Archaeological Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className="p-3 rounded-lg bg-graveyard-900 border border-white/10 hover:border-red-500/40 text-left space-y-1 transition-colors cursor-pointer"
                >
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-red-400" />
                    <span>Run Probe</span>
                  </div>
                  <p className="text-[11px] text-graveyard-400">Scan any live URL for shutdown language.</p>
                </button>
                <button
                  onClick={() => {
                    setIsNewEntity(true);
                    setEditingEntity({
                      id: `grave-${Date.now()}`,
                      slug: '',
                      name: '',
                      tagline: '',
                      description: '',
                      category: 'Social',
                      status: 'CONFIRMED_DEAD',
                      founded_year: 2010,
                      lifespan: '2010 — 2024',
                      cause_of_death_summary: '',
                      cause_category: 'Acquired & Discontinued',
                      logo_url: '',
                      primary_domain: '',
                      country: 'United States',
                      confidence_score: 95,
                      candle_count: 0,
                      is_verified: true,
                      verified_at: new Date().toISOString(),
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      final_moments: '',
                      last_known_state: {
                        website: { state_desc: 'Domain inactive or redirecting.' },
                        app: { store_status: 'Delisted', state_desc: 'Removed.' },
                        api: { endpoint_status: '410 Gone', state_desc: 'Decommissioned.' },
                        community: { platform: 'None', state_desc: 'Disbanded.' },
                        domain: { ownership: 'Defunct', state_desc: 'Parked.' }
                      }
                    });
                    setActiveTab('entities');
                  }}
                  className="p-3 rounded-lg bg-graveyard-900 border border-white/10 hover:border-red-500/40 text-left space-y-1 transition-colors cursor-pointer"
                >
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Carve New Grave</span>
                  </div>
                  <p className="text-[11px] text-graveyard-400">Add a new defunct entity directly.</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REVIEW QUEUE TAB */}
      {activeTab === 'review_queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Automated Discovery Review Queue ({candidates.length} Detected)
            </h2>
            <span className="text-xs text-graveyard-400">
              Evidence extracted via multi-signal diagnostic scanner
            </span>
          </div>

          <div className="space-y-4">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-5 rounded-xl bg-graveyard-850 border border-white/10 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{cand.service_name}</h3>
                    <div className="text-graveyard-400 font-mono">Domain: {cand.domain} • Category: {cand.category}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold">
                      Confidence: {cand.confidence_score}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-graveyard-400">
                      Status: {cand.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] text-graveyard-400 uppercase">Signals Detected:</div>
                  <ul className="list-disc list-inside text-graveyard-300 space-y-0.5">
                    {cand.detected_signals.map((sig, idx) => (
                      <li key={idx}>{sig}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-graveyard-900 border border-white/5 text-graveyard-400 font-sans text-xs">
                  <span className="font-mono font-bold text-graveyard-300">Raw Evidence:</span> {cand.raw_evidence}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCandidateAction(cand.id, 'INVESTIGATING')}
                    className="px-3 py-1.5 rounded-lg bg-graveyard-800 hover:bg-graveyard-750 text-graveyard-200 text-xs border border-white/10"
                  >
                    Investigate Further
                  </button>
                  <button
                    onClick={() => handleCandidateAction(cand.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-400 text-xs border border-red-500/30"
                  >
                    Reject Candidate
                  </button>
                  <button
                    onClick={() => handleCandidateAction(cand.id, 'APPROVED')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Approve & Publish Grave
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. USER SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">
            Community Submissions Moderation Queue ({submissions.length})
          </h2>

          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-xl bg-graveyard-850 border border-white/10 space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{sub.service_name}</h3>
                    <div className="text-graveyard-400">{sub.url} • Reported on {new Date(sub.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-graveyard-300 font-bold">
                    {sub.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-graveyard-900 border border-white/5 text-graveyard-200 font-sans">
                  <div className="font-mono text-[11px] text-graveyard-400 uppercase mb-1">What Happened:</div>
                  {sub.what_happened}
                </div>

                {sub.submitter_memory && (
                  <div className="p-3 rounded-lg bg-graveyard-900/50 border border-white/5 text-graveyard-300 font-sans italic">
                    <span className="font-mono text-[11px] text-graveyard-400 not-italic uppercase mb-1 block">Submitter Memory:</span>
                    "{sub.submitter_memory}"
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-graveyard-400">
                  <span>Sources: {sub.sources}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'REJECTED')}
                      className="px-3 py-1 rounded bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleSubmissionAction(sub.id, 'APPROVED')}
                      className="px-3 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-500"
                    >
                      Approve & Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ENTITY EDITOR TAB */}
      {activeTab === 'entities' && (
        <div className="space-y-6">
          {editingEntity ? (
            <form onSubmit={handleSaveEntity} className="p-6 rounded-2xl bg-graveyard-850 border border-white/10 space-y-5 text-xs">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-sm font-bold text-white uppercase">
                  {isNewEntity ? 'Carve New Grave' : `Editing Grave: ${editingEntity.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingEntity(null)}
                  className="text-graveyard-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-graveyard-400 uppercase">Entity Name:</label>
                  <input
                    type="text"
                    required
                    value={editingEntity.name}
                    onChange={(e) => setEditingEntity({ ...editingEntity, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-graveyard-400 uppercase">Slug:</label>
                  <input
                    type="text"
                    required
                    value={editingEntity.slug}
                    onChange={(e) => setEditingEntity({ ...editingEntity, slug: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-graveyard-400 uppercase">Status:</label>
                  <select
                    value={editingEntity.status}
                    onChange={(e) => setEditingEntity({ ...editingEntity, status: e.target.value as GraveStatus })}
                    className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                  >
                    <option value="CONFIRMED_DEAD">CONFIRMED DEAD</option>
                    <option value="AT_RISK">AT RISK</option>
                    <option value="ABANDONED">ABANDONED</option>
                    <option value="ZOMBIE">ZOMBIE</option>
                    <option value="OFFLINE">OFFLINE</option>
                    <option value="ACTIVE">ACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-graveyard-400 uppercase">Category:</label>
                  <input
                    type="text"
                    value={editingEntity.category}
                    onChange={(e) => setEditingEntity({ ...editingEntity, category: e.target.value as GraveCategory })}
                    className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-graveyard-400 uppercase">Lifespan (e.g. 2013 — 2017):</label>
                  <input
                    type="text"
                    value={editingEntity.lifespan}
                    onChange={(e) => setEditingEntity({ ...editingEntity, lifespan: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-graveyard-400 uppercase">Cause Category:</label>
                  <input
                    type="text"
                    value={editingEntity.cause_category}
                    onChange={(e) => setEditingEntity({ ...editingEntity, cause_category: e.target.value as CauseCategory })}
                    className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-graveyard-400 uppercase">Tagline:</label>
                <input
                  type="text"
                  value={editingEntity.tagline || ''}
                  onChange={(e) => setEditingEntity({ ...editingEntity, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-graveyard-400 uppercase">Description:</label>
                <textarea
                  rows={3}
                  value={editingEntity.description}
                  onChange={(e) => setEditingEntity({ ...editingEntity, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white resize-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-graveyard-400 uppercase">Cause of Demise Autopsy:</label>
                <textarea
                  rows={2}
                  value={editingEntity.cause_of_death_summary}
                  onChange={(e) => setEditingEntity({ ...editingEntity, cause_of_death_summary: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-graveyard-900 border border-white/10 text-white resize-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingEntity(null)}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Record to DB</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase text-white">
                  All Historical Entities ({entities.length})
                </h3>
                <button
                  onClick={() => {
                    setIsNewEntity(true);
                    setEditingEntity({
                      id: `grave-${Date.now()}`,
                      slug: '',
                      name: '',
                      tagline: '',
                      description: '',
                      category: 'Social',
                      status: 'CONFIRMED_DEAD',
                      founded_year: 2012,
                      lifespan: '2012 — 2024',
                      cause_of_death_summary: '',
                      cause_category: 'Acquired & Discontinued',
                      logo_url: '',
                      primary_domain: '',
                      country: 'Global',
                      confidence_score: 95,
                      candle_count: 0,
                      is_verified: true,
                      verified_at: new Date().toISOString(),
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      final_moments: '',
                      last_known_state: {
                        website: { state_desc: 'Inactive.' },
                        app: { store_status: 'Delisted', state_desc: 'Defunct.' },
                        api: { endpoint_status: '410 Gone', state_desc: 'Terminated.' },
                        community: { platform: 'None', state_desc: 'Dispersed.' },
                        domain: { ownership: 'Defunct', state_desc: 'Parked.' }
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Entity</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-graveyard-850 border border-white/10 space-y-2">
                {entities.map((ent) => (
                  <div
                    key={ent.id}
                    className="p-3 rounded-lg bg-graveyard-900 border border-white/5 flex items-center justify-between text-xs hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{ent.name}</span>
                      <span className="text-graveyard-400">({ent.lifespan})</span>
                      <StatusBadge status={ent.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsNewEntity(false);
                          setEditingEntity(ent);
                        }}
                        className="p-1.5 rounded bg-white/5 hover:bg-white/15 text-graveyard-300 hover:text-white"
                        title="Edit Entity"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. LIVE HEALTH PROBER TAB */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Live Domain Health & Shutdown Prober
            </h2>
            <p className="text-xs text-graveyard-400 font-sans">
              Test any live URL or domain right now. The scanner analyzes HTTP response codes, DNS records, TLS certificates, and inspects HTML bodies for explicit shutdown phrases like "closing our doors" or "service has shut down".
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRunProbe} className="p-6 rounded-xl bg-graveyard-850 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter domain or URL (e.g. vine.co, grooveshark.com, icq.com)..."
                value={probeUrl}
                onChange={(e) => setProbeUrl(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-graveyard-900 border border-white/10 text-white placeholder-graveyard-400 text-xs focus:outline-none focus:border-red-500/50"
              />
              <button
                type="submit"
                disabled={probeLoading || !probeUrl.trim()}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Activity className={`w-4 h-4 ${probeLoading ? 'animate-spin' : ''}`} />
                <span>{probeLoading ? 'Probing Target...' : 'Execute Archaeological Probe'}</span>
              </button>
            </div>
          </form>

          {/* Probe Results */}
          {probeResult && (
            <div className="p-6 rounded-xl bg-graveyard-850 border border-white/10 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    Scan Result: {probeResult.domain}
                  </h3>
                  <div className="text-xs text-graveyard-400">
                    Timestamp: {new Date(probeResult.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={probeResult.recommended_status} size="md" />
                  <span className="px-3 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold">
                    Confidence: {probeResult.confidence_score}%
                  </span>
                </div>
              </div>

              {/* Status Explanation */}
              <div className="p-3 rounded-lg bg-graveyard-900 border border-white/5 text-xs text-graveyard-200">
                <span className="font-bold text-white">Forensic Finding:</span> {probeResult.status_explanation}
              </div>

              {/* Signals */}
              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-graveyard-400">Signals Evaluated:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-graveyard-900 border border-white/5 flex items-center justify-between">
                    <span>HTTP Status Code:</span>
                    <span className="text-white font-bold">{probeResult.http_status || 'Connection Failed'}</span>
                  </div>
                  <div className="p-2.5 rounded bg-graveyard-900 border border-white/5 flex items-center justify-between">
                    <span>DNS Resolves:</span>
                    <span className={probeResult.dns_resolved ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {probeResult.dns_resolved ? 'YES' : 'NO (NXDOMAIN)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-graveyard-900 border border-white/5 flex items-center justify-between">
                    <span>SSL Certificate:</span>
                    <span className={probeResult.ssl_valid ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {probeResult.ssl_valid ? 'VALID' : 'INVALID / NONE'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-graveyard-900 border border-white/5 flex items-center justify-between">
                    <span>Shutdown Phrases Detected:</span>
                    <span className="text-amber-400 font-bold">
                      {probeResult.shutdown_phrases_detected.length} Matches
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. AUTOMATION SCRAPER TAB */}
      {activeTab === 'scraper' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5" />
                  <span>Automated Archival Crawler Engine</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Multi-Source Discovery Pipeline
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  Autonomous archaeology bot that scours Wikipedia historical category archives, Hacker News shutdown declarations (Algolia API), Internet Archive Wayback snapshots, and live DNS/HTTP/SSL signals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                  ENGINE ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* Controls Form */}
          <form onSubmit={handleRunScraper} className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Source Selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-zinc-300">
                  Data Source Engine:
                </label>
                <select
                  value={scraperSource}
                  onChange={(e) => setScraperSource(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-zinc-800 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="all">All Sources (Wikipedia + Hacker News)</option>
                  <option value="wikipedia">Wikipedia Defunct Categories & Infoboxes</option>
                  <option value="hn">Hacker News Shutdown & Sunset Letters</option>
                  <option value="probe">Single Target Deep Probe</option>
                </select>
              </div>

              {/* Batch Discovery Limit */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-zinc-300">
                  Batch Ingestion Limit:
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={scraperLimit}
                  onChange={(e) => setScraperLimit(parseInt(e.target.value) || 5)}
                  className="w-full p-3 rounded-xl bg-zinc-800 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Target Domain (Optional) */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold uppercase text-zinc-300">
                  Target Domain (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. vine.co, skiff.com, invisionapp.com"
                  value={scraperTargetDomain}
                  onChange={(e) => setScraperTargetDomain(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-800 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Toggle Auto-Ingest and Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={scraperAutoIngest}
                  onChange={(e) => setScraperAutoIngest(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-zinc-800 border-zinc-700 focus:ring-emerald-500 focus:ring-offset-zinc-900 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Direct Autopsy Auto-Ingest
                  </span>
                  <p className="text-[11px] text-zinc-400">
                    {scraperAutoIngest 
                      ? 'High-confidence candidates are published directly into the graveyard catalog.' 
                      : 'Candidates will be held in the Discovery Queue for curator review (recommended).'}
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={scraperLoading}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {scraperLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Scraper Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Automation Scraper</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Live Terminal Output */}
          <div className="rounded-2xl bg-zinc-950 border border-emerald-500/20 shadow-2xl overflow-hidden font-mono">
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Archaeological Scraper Telemetry Console
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScraperLogs(['[Console Cleared]'])}
                className="text-[11px] text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800 border border-white/5 transition-colors cursor-pointer"
              >
                Clear Log
              </button>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto space-y-1.5 text-xs text-emerald-400/90 selection:bg-emerald-500/30">
              {scraperLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed break-words font-mono">
                  {log.includes('error') || log.includes('Failed') ? (
                    <span className="text-red-400">{log}</span>
                  ) : log.includes('completed') || log.includes('Success') || log.includes('Auto-Ingested') ? (
                    <span className="text-emerald-300 font-bold">{log}</span>
                  ) : log.includes('Wikipedia') ? (
                    <span className="text-cyan-300">{log}</span>
                  ) : log.includes('HackerNews') ? (
                    <span className="text-amber-300">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scraper Report Summary Card */}
          {scraperReport && (
            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 space-y-6 shadow-xl animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white font-mono">
                      Scrape Execution Report
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Source: <span className="text-emerald-400 uppercase font-mono">{scraperReport.source}</span> • Duration: <span className="text-white font-mono">{scraperReport.durationMs}ms</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-center px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10">
                    <div className="text-zinc-400 text-[10px] uppercase">Discovered</div>
                    <div className="text-base font-black text-white">{scraperReport.totalDiscovered}</div>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10">
                    <div className="text-zinc-400 text-[10px] uppercase">Queued</div>
                    <div className="text-base font-black text-amber-400">{scraperReport.candidatesQueued}</div>
                  </div>
                  <div className="text-center px-3 py-1.5 rounded-lg bg-zinc-800 border border-white/10">
                    <div className="text-zinc-400 text-[10px] uppercase">Auto-Ingested</div>
                    <div className="text-base font-black text-emerald-400">{scraperReport.autoIngested}</div>
                  </div>
                </div>
              </div>

              {scraperReport.discoveredItems && scraperReport.discoveredItems.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase text-zinc-400 font-bold">
                    Discovered Relics & Verified Candidates:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scraperReport.discoveredItems.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          <span className="text-xs font-mono text-emerald-400">{item.domain || item.source}</span>
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {item.evidenceSummary || item.description || 'Defunct web platform identified via automated historical crawl.'}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300 font-mono">
                            {item.status || 'DEAD'}
                          </span>
                          {item.archiveUrl && (
                            <a
                              href={item.archiveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-zinc-400 hover:text-white underline font-mono ml-auto"
                            >
                              Wayback Snapshot →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
