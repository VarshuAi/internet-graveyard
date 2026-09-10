import React from 'react';
import Link from 'next/link';
import { graveyardDb } from '@/lib/db';
import { StatCounter } from '@/components/StatCounter';
import { GraveCard } from '@/components/GraveCard';
import { StatusBadge } from '@/components/StatusBadge';
import { EntityLogo } from '@/components/EntityLogo';
import { TodayInHistoryBanner } from '@/components/TodayInHistoryBanner';
import { 
  Search, 
  Shuffle, 
  Skull, 
  AlertTriangle, 
  Compass, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Globe, 
  FileText,
  Activity,
  Landmark,
  Volume2,
  Scale,
  Newspaper
} from 'lucide-react';

export const revalidate = 0; // Dynamic server rendering

export default function HomePage() {
  const stats = graveyardDb.getStats();
  const recentlyBuried = graveyardDb.getRecentlyBuried(8);
  const atRiskEntities = graveyardDb.getAtRiskEntities().slice(0, 3);

  const categories = [
    { name: 'Social', count: '142 Graves', desc: 'Networks, feeds & graphs', href: '/explore?category=Social' },
    { name: 'Messaging', count: '89 Graves', desc: 'Instant chat, P2P & IRC', href: '/explore?category=Messaging' },
    { name: 'Gaming', count: '164 Graves', desc: 'MMOs, virtual worlds & flash', href: '/explore?category=Gaming' },
    { name: 'Streaming', count: '73 Graves', desc: 'Music, video & audio hubs', href: '/explore?category=Streaming' },
    { name: 'Search', count: '41 Graves', desc: 'Early crawlers & portals', href: '/explore?category=Search' },
    { name: 'Developer tools', count: '115 Graves', desc: 'APIs, frameworks & task apps', href: '/explore?category=Developer+tools' },
    { name: 'Web technology', count: '98 Graves', desc: 'Runtimes, protocols & plug-ins', href: '/explore?category=Web+technology' },
    { name: 'Communities', count: '180 Graves', desc: 'Forums, Q&As & guestbooks', href: '/explore?category=Communities' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="relative w-full py-20 md:py-28 px-4 sm:px-6 flex flex-col items-center text-center overflow-hidden border-b border-white/10 bg-radial-fog">
        {/* Subtle Ambient Background Particle Glow */}
        <div className="absolute top-1/4 w-[32rem] h-[32rem] bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-7">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-300 text-xs sm:text-sm font-mono font-semibold tracking-wider animate-in fade-in shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span>DIGITAL ARCHAEOLOGY & FORENSIC DATABASE</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-sans font-black tracking-tight text-white uppercase drop-shadow-sm">
            INTERNET GRAVEYARD
          </h1>

          {/* Core Philosophy */}
          <div className="space-y-2.5">
            <p className="text-xl sm:text-2xl md:text-3xl text-zinc-100 font-medium tracking-normal max-w-3xl mx-auto">
              Everything online eventually disappears.
            </p>
            <p className="text-base sm:text-lg text-zinc-300 font-sans max-w-2xl mx-auto leading-relaxed">
              We document, verify, and preserve what the internet lost.
            </p>
          </div>

          {/* Primary Search Box */}
          <div className="pt-4 max-w-3xl mx-auto w-full">
            <form action="/explore" method="GET" className="relative w-full group">
              <input
                type="text"
                name="q"
                placeholder="Search websites, apps, games, services, causes (or enter a URL)..."
                className="w-full h-16 pl-14 pr-36 rounded-2xl bg-zinc-900/90 border-2 border-white/15 text-white placeholder-zinc-400 font-sans text-base sm:text-lg focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all shadow-2xl"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 group-focus-within:text-red-400 transition-colors" />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans text-sm font-bold transition-all shadow-lg cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-3 text-xs sm:text-sm font-sans text-zinc-400">
              <span className="font-semibold text-zinc-400">Popular searches:</span>
              <span className="inline-flex items-center gap-2">
                <Link href="/grave/vine" className="text-zinc-200 hover:text-white underline decoration-white/30 font-medium">Vine</Link>
                <span className="text-zinc-600">•</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Link href="/grave/google-reader" className="text-zinc-200 hover:text-white underline decoration-white/30 font-medium">Google Reader</Link>
                <span className="text-zinc-600">•</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Link href="/grave/geocities" className="text-zinc-200 hover:text-white underline decoration-white/30 font-medium">GeoCities</Link>
                <span className="text-zinc-600">•</span>
              </span>
              <Link href="/grave/club-penguin" className="text-zinc-200 hover:text-white underline decoration-white/30 font-medium">Club Penguin</Link>
            </div>

            {/* Check Any Website Banner */}
            <div className="pt-4">
              <Link
                href="/lookup"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-850 border border-white/15 hover:border-red-500/50 text-zinc-200 hover:text-white text-xs sm:text-sm font-sans font-medium transition-all group shadow-md text-left"
              >
                <Activity className="w-4 h-4 text-red-400 group-hover:animate-pulse shrink-0" />
                <span>Want to test any website on the internet? <span className="text-white font-bold underline decoration-red-500/70">Run Live Forensic Autopsy on Any URL &rarr;</span></span>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-sans text-sm font-bold">
            <Link
              href="/lookup"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-red-950/60 hover:bg-red-900/70 text-red-300 hover:text-white border border-red-500/50 transition-all shadow-xl hover:-translate-y-0.5 gap-2.5"
            >
              <Activity className="w-5 h-5 text-red-400 animate-pulse shrink-0" />
              <span>Check Any Website</span>
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white/12 hover:bg-white/18 text-white border border-white/15 transition-all shadow-xl hover:-translate-y-0.5 gap-2.5"
            >
              <Compass className="w-5 h-5 text-red-400 shrink-0" />
              <span>Explore Graveyard</span>
            </Link>

            <Link
              href="/random"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 transition-all shadow-xl hover:-translate-y-0.5 gap-2.5"
            >
              <Shuffle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Random Grave</span>
            </Link>

            <Link
              href="/recently-buried"
              className="inline-flex items-center justify-center h-12 px-6 rounded-xl bg-zinc-850 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 transition-all shadow-xl hover:-translate-y-0.5 gap-2.5"
            >
              <Skull className="w-5 h-5 text-zinc-400 shrink-0" />
              <span>Recently Buried</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. ANIMATED STATISTICS BAR */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 -mt-8 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
          <StatCounter
            value={stats.total_archived}
            label="Archived Entities"
            color="text-white"
          />
          <StatCounter
            value={stats.confirmed_dead}
            label="Confirmed Dead"
            color="text-red-400"
          />
          <StatCounter
            value={stats.abandoned}
            label="Abandoned Platforms"
            color="text-orange-400"
          />
          <StatCounter
            value={stats.zombie_services}
            label="Zombie Services"
            color="text-purple-400"
          />
        </div>
      </section>

      {/* TODAY IN INTERNET HISTORY BANNER */}
      <TodayInHistoryBanner />

      {/* ARCHAEOLOGICAL LABORATORIES & ARCHIVES */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Cemetery Map */}
          <Link
            href="/grounds"
            className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-red-500/50 hover:bg-zinc-850/80 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  The Cemetery Map
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Interactive aerial grounds. Explore the Google Mausoleum, P2P Cove, and light memorial candles.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-400 group-hover:translate-x-1 transition-transform">
              <span>Walk the Grounds</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 2. Sound Vault */}
          <Link
            href="/sounds"
            className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-emerald-500/50 hover:bg-zinc-850/80 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Sounds of the Dead Web
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Acoustic fossils. Synthesize the ICQ Uh-Oh!, AOL dial-up screech, and MSN Messenger nudge.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Enter Soundboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 3. Autopsy Rivals */}
          <Link
            href="/compare"
            className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-cyan-500/50 hover:bg-zinc-850/80 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Autopsy Rivals (/compare)
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Head-to-head post-mortems. Why Vine died and TikTok won, MySpace vs Facebook, Napster vs Spotify.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Compare Rivals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* 4. Sunset Gazette */}
          <Link
            href="/gazette"
            className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-amber-500/50 hover:bg-zinc-850/80 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Newspaper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  The Sunset Gazette
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Daily archival broadsheet. Discover historical shutdowns, final days, and quotes of deleted history.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Read Gazette</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3. RECENTLY BURIED SHOWCASE */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-red-400 tracking-wider uppercase mb-1">
              <Skull className="w-4 h-4" />
              <span>Cemetery Ledger</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-black text-white tracking-tight">
              Recently Buried & Defunct
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-sans mt-1.5 max-w-2xl">
              Documented services with confirmed date of demise, forensically audited causes, and preserved memories.
            </p>
          </div>

          <Link
            href="/recently-buried"
            className="flex items-center gap-2 text-sm font-sans font-bold text-red-400 hover:text-red-300 transition-colors shrink-0 group"
          >
            <span>View Complete Cemetery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {recentlyBuried.map((entity) => (
            <GraveCard key={entity.id} entity={entity} />
          ))}
        </div>
      </section>

      {/* 4. DYING NOW / AT RISK SPOTLIGHT */}
      <section className="w-full border-y border-amber-500/15 bg-amber-500/[0.03] py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-400 tracking-wider uppercase mb-1">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
                <span>Multi-Signal Detection Radar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-black text-white tracking-tight">
                Dying Now — Services At Risk
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 font-sans mt-1.5 max-w-2xl leading-relaxed">
                Services that have not died yet, but show multiple corroborated signals of terminal decline (zero commits, DNS instability, unrenewed SSL, traffic collapse).
              </p>
            </div>

            <Link
              href="/dying-now"
              className="flex items-center gap-2 text-sm font-sans font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0 group"
            >
              <span>Explore At-Risk Radar ({stats.at_risk} Active)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* At Risk Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {atRiskEntities.map((entity) => (
              <div
                key={entity.id}
                className="p-6 sm:p-7 rounded-2xl bg-zinc-900/90 border border-amber-500/30 shadow-xl flex flex-col justify-between h-full space-y-5"
              >
                <div className="space-y-3.5">
                  {/* Category & Status top bar */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/8">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold truncate">
                      {entity.category}
                    </span>
                    <div className="shrink-0">
                      <StatusBadge status="AT_RISK" size="sm" />
                    </div>
                  </div>

                  {/* Identity with EntityLogo + Full Name + Domain */}
                  <div className="flex items-center gap-3.5 pt-0.5">
                    <EntityLogo entity={entity} size="md" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-black text-white font-sans truncate" title={entity.name}>
                        {entity.name}
                      </h3>
                      <div className="text-xs font-mono text-zinc-400 mt-0.5 truncate">{entity.primary_domain}</div>
                    </div>
                  </div>

                  {/* Risk confidence meter */}
                  <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                      <span className="text-zinc-400 font-medium">Degradation Risk:</span>
                      <span className="text-amber-400 font-bold text-base font-mono">{entity.confidence_score}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full"
                        style={{ width: `${entity.confidence_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Signals detected preview with min-height for baseline stability */}
                  <div className="space-y-1.5 text-xs sm:text-sm min-h-[76px] flex flex-col justify-start">
                    <span className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Signals Detected:</span>
                    {entity.risk_signals?.slice(0, 3).map((sig) => (
                      <div key={sig.id} className="flex items-center justify-between text-zinc-300 text-xs sm:text-sm font-sans">
                        <span className="truncate max-w-[80%]">{sig.label}</span>
                        <span className="text-amber-400 font-mono font-bold shrink-0">+{sig.points}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/grave/${entity.slug}`}
                  className="pt-4 border-t border-white/10 flex items-center justify-between text-sm text-amber-400 hover:text-amber-300 font-bold font-sans transition-colors mt-auto shrink-0"
                >
                  <span>Inspect Risk Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EXPLORE BY ARCHAEOLOGICAL CATEGORY */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-8">
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-zinc-400 tracking-wider uppercase mb-1">
            <Compass className="w-4 h-4 text-red-400" />
            <span>Archaeological Taxonomies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-sans font-black text-white tracking-tight">
            Browse Defunct Ecosystems
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 font-sans mt-1.5">
            Navigate through specialized sectors of digital ruins from Web 1.0 to modern mobile app graveyards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 items-stretch">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="p-6 rounded-2xl bg-zinc-900/90 border border-white/10 hover:border-red-500/40 hover:bg-zinc-850 transition-all duration-200 group flex flex-col justify-between shadow-md hover:-translate-y-1 h-full min-h-[160px]"
            >
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-zinc-400 mb-2.5">
                    <span className="text-red-400 font-bold">{cat.count}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors font-sans">
                    {cat.name}
                  </h3>
                </div>
                <p className="text-sm text-zinc-300 mt-2 font-sans leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. SUBMISSION CALLOUT BANNER */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border border-white/15 p-8 sm:p-14 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3.5 text-center md:text-left max-w-xl">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-red-400">
              Community Archaeology
            </span>
            <h3 className="text-3xl sm:text-4xl font-sans font-black text-white tracking-tight">
              Remember a service that disappeared?
            </h3>
            <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
              Help us document what the internet lost. Submit defunct websites, forgotten apps, or dead developer tools to our forensic archaeological review queue.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/submit"
              className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans font-bold text-sm sm:text-base tracking-wider uppercase transition-all shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 inline-block cursor-pointer"
            >
              Submit an Entity for Review
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
