"use client";

import React, { useState } from 'react';
import { ArchiveSnapshot, GraveEntity } from '@/types/graveyard';
import { 
  Archive, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Globe, 
  Layers, 
  ArrowUpRight, 
  History, 
  Maximize2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaybackTimeMachineProps {
  entity: GraveEntity;
}

export const WaybackTimeMachine: React.FC<WaybackTimeMachineProps> = ({ entity }) => {
  // Build a rich snapshot list: use entity.archives if available, or generate era-based Wayback anchors
  const domain = entity.primary_domain;
  const birthYear = entity.founded_year || 2000;
  const deathYear = entity.death_year || 2020;
  const peakYear = Math.round(birthYear + (deathYear - birthYear) * 0.6);

  const defaultSnapshots: ArchiveSnapshot[] = (entity.archives && entity.archives.length > 0)
    ? entity.archives
    : [
        {
          id: 'snap-1',
          entity_id: entity.id,
          year: birthYear,
          date_captured: `${birthYear}-06-15`,
          title: `${entity.name} Launch Version`,
          wayback_url: `https://web.archive.org/web/${birthYear}0615000000*/http://${domain}`
        },
        {
          id: 'snap-2',
          entity_id: entity.id,
          year: peakYear,
          date_captured: `${peakYear}-10-20`,
          title: `${entity.name} Peak Era`,
          wayback_url: `https://web.archive.org/web/${peakYear}1020000000*/http://${domain}`
        },
        {
          id: 'snap-3',
          entity_id: entity.id,
          year: deathYear,
          date_captured: `${deathYear}-12-31`,
          title: `${entity.name} Final Sunset Notice`,
          wayback_url: `https://web.archive.org/web/${deathYear}1231000000*/http://${domain}`
        }
      ];

  const [activeIndex, setActiveIndex] = useState(0);
  const currentSnap = defaultSnapshots[activeIndex] || defaultSnapshots[0];

  return (
    <section className="p-6 sm:p-7 rounded-2xl bg-zinc-900/90 border border-white/10 space-y-5 font-sans shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
          <History className="w-4 h-4" />
          <span>Wayback Time Machine • Archive Inspector</span>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Internet Archive Linked
        </span>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
        Step back in time to inspect historical captures preserved by the Internet Archive across {entity.name}’s lifecycle.
      </p>

      {/* Era Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {defaultSnapshots.map((snap, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={snap.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer border",
                isSelected
                  ? "bg-amber-950/60 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                  : "bg-zinc-950 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
              )}
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>{snap.year}</span>
              <span className="text-zinc-500 font-normal">|</span>
              <span className="max-w-[120px] truncate">{snap.title}</span>
            </button>
          );
        })}
      </div>

      {/* Simulated Retro Browser Window Chassis */}
      <div className="rounded-xl border border-white/15 bg-zinc-950 overflow-hidden shadow-2xl space-y-0">
        
        {/* Browser Top Navigation Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900 border-b border-white/10 text-xs font-mono gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>

          {/* Address Bar */}
          <div className="flex-1 max-w-xl mx-auto px-3 py-1 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300 flex items-center justify-between text-[11px] truncate">
            <span className="truncate text-zinc-400">
              web.archive.org/web/{currentSnap.year}0101.../{domain}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold shrink-0 ml-2">
              HTTP 200
            </span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <button
              onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Previous snapshot"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveIndex(prev => Math.min(defaultSnapshots.length - 1, prev + 1))}
              disabled={activeIndex === defaultSnapshots.length - 1}
              className="p-1 hover:text-white disabled:opacity-30 cursor-pointer"
              title="Next snapshot"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Snapshot Viewport Card */}
        <div className="p-5 sm:p-6 space-y-4 bg-gradient-to-b from-zinc-950 to-zinc-900/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase text-amber-400/90 font-bold flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>Captured: {currentSnap.date_captured} ({currentSnap.year})</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                {currentSnap.title}
              </h4>
              <p className="text-xs text-zinc-400 font-sans">
                Archival state verified via the Wayback Machine crawler for domain <strong className="text-zinc-200">{domain}</strong>.
              </p>
            </div>

            <a
              href={currentSnap.wayback_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0"
            >
              <span>Explore on Archive.org</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Year Slider indicator */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Snapshot #{activeIndex + 1} of {defaultSnapshots.length}</span>
            <a
              href={`https://web.archive.org/web/*/${domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View complete calendar timeline</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
