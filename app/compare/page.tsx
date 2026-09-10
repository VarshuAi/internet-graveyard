"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Skull, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { CURATED_RIVALRIES, RivalryItem } from '@/data/rivalries';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const [selectedRivalry, setSelectedRivalry] = useState<RivalryItem>(CURATED_RIVALRIES[0]);

  return (
    <div className="min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Header Dossier */}
        <div className="relative rounded-3xl bg-zinc-900/90 border border-white/10 p-8 sm:p-12 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-mono font-bold tracking-wider">
              <Scale className="w-4 h-4" />
              <span>FORENSIC COMPARISON • HEAD-TO-HEAD AUTOPSY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-sans font-black text-white tracking-tight">
              Why Did One Die and One Survive?
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
              Every dead internet product left behind blueprints of what went wrong. Compare legendary rivalries side-by-side to uncover the critical product, distribution, and business mistakes that sealed their fate.
            </p>
          </div>

          {/* Quick Switcher Pills */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="text-xs font-mono text-zinc-400 uppercase font-semibold">
              Select Curated Internet Showdown:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {CURATED_RIVALRIES.map((riv) => {
                const isSelected = selectedRivalry.id === riv.id;
                return (
                  <button
                    key={riv.id}
                    onClick={() => setSelectedRivalry(riv)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer border",
                      isSelected
                        ? "bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        : "bg-zinc-800/80 border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-750"
                    )}
                  >
                    {riv.nameA} <span className="text-zinc-400 font-normal">vs</span> {riv.nameB}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* The Head-to-Head Arena */}
        <div className="space-y-8">
          
          {/* Side by Side Dual Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* PLATFORM A: The Fallen / Deceased */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border-2 border-red-500/30 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
                  <Skull className="w-3.5 h-3.5" />
                  <span>THE DECEASED</span>
                </div>
                <span className="text-xs font-mono text-zinc-400 font-semibold">
                  Lifespan: {selectedRivalry.lifespanA}
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{selectedRivalry.nameA}</h2>
                <p className="text-sm text-zinc-300 font-sans italic mt-1">
                  "{selectedRivalry.taglineA}"
                </p>
              </div>

              {/* Peak Scale */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <div className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Peak Historical Scale:</span>
                </div>
                <div className="text-white text-sm sm:text-base font-semibold">
                  {selectedRivalry.peakScaleA}
                </div>
              </div>

              {/* Fatal Flaw / Kill Factor */}
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-2">
                <div className="text-xs font-mono uppercase font-bold text-red-400 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>Fatal Flaw & Primary Cause of Death:</span>
                </div>
                <p className="text-sm sm:text-base text-zinc-100 font-sans leading-relaxed">
                  {selectedRivalry.fatalFlawA}
                </p>
              </div>

              {/* Memorial link */}
              <div className="pt-2">
                <Link
                  href={`/grave/${selectedRivalry.slugA}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-mono font-bold transition-all border border-white/15 group"
                >
                  <span>Open {selectedRivalry.nameA} Memorial & Autopsy</span>
                  <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* PLATFORM B: The Survivor / Successor */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border-2 border-emerald-500/30 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedRivalry.statusB}</span>
                </div>
                <span className="text-xs font-mono text-zinc-400 font-semibold">
                  Lifespan: {selectedRivalry.lifespanB}
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{selectedRivalry.nameB}</h2>
                <p className="text-sm text-zinc-300 font-sans italic mt-1">
                  "{selectedRivalry.taglineB}"
                </p>
              </div>

              {/* Peak Scale */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <div className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Market Scale & Reach:</span>
                </div>
                <div className="text-white text-sm sm:text-base font-semibold">
                  {selectedRivalry.peakScaleB}
                </div>
              </div>

              {/* Survival Factor */}
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                <div className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Survival Factor & Strategic Advantage:</span>
                </div>
                <p className="text-sm sm:text-base text-zinc-100 font-sans leading-relaxed">
                  {selectedRivalry.survivalFactorB}
                </p>
              </div>

              <div className="pt-2 text-xs font-mono text-zinc-400">
                Industry: {selectedRivalry.category}
              </div>
            </div>

          </div>

          {/* Autopsy Post-Mortem Verdict & Lessons */}
          <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/90 border border-white/10 space-y-8 shadow-2xl">
            
            {/* The Verdict */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>Coroner's Comparative Verdict</span>
              </div>
              <p className="text-base sm:text-xl text-zinc-100 font-serif italic leading-relaxed">
                "{selectedRivalry.postMortemVerdict}"
              </p>
            </div>

            {/* 3 Hard Lessons for Builders */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Archaeological Lessons for Modern Founders & Engineers:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedRivalry.lessons.map((lesson, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-2 font-sans"
                  >
                    <div className="text-xs font-mono text-red-400 font-bold">
                      RULE #{idx + 1}
                    </div>
                    <p className="text-sm text-zinc-300 leading-snug">
                      {lesson}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
