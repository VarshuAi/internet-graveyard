"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { GraveEntity } from '@/types/graveyard';
import { StatusBadge } from './StatusBadge';
import { EntityLogo } from './EntityLogo';
import { ArrowRight, Flame, Archive, Eye, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { soundFx } from '@/lib/audio/soundFx';

interface GraveCardProps {
  entity: GraveEntity;
  className?: string;
  onQuickInspect?: (entity: GraveEntity) => void;
}

export const GraveCard: React.FC<GraveCardProps> = ({ 
  entity, 
  className,
  onQuickInspect
}) => {
  const [candles, setCandles] = useState<number>(entity.candle_count || 1);
  const [litRecently, setLitRecently] = useState<boolean>(false);

  const handleLightCandle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    soundFx.playCandle();
    setCandles((prev) => prev + 1);
    setLitRecently(true);
    setTimeout(() => setLitRecently(false), 2000);

    // Persist via API in background
    fetch(`/api/entities/${entity.slug}/candle`, { method: 'POST' }).catch(() => {});
  };

  const isDead = entity.status === 'CONFIRMED_DEAD' || entity.status === 'OFFLINE' || entity.status === 'ABANDONED';
  const isActive = entity.status === 'ACTIVE';
  const isAtRisk = entity.status === 'AT_RISK';
  const isZombie = entity.status === 'ZOMBIE';

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between h-full rounded-xl bg-zinc-950/95 border transition-all duration-200 overflow-hidden font-sans shadow-lg hover:-translate-y-1',
        isDead && 'border-white/12 hover:border-red-500/50 hover:shadow-[0_16px_35px_rgba(239,68,68,0.15)]',
        isActive && 'border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_16px_35px_rgba(16,185,129,0.15)]',
        isAtRisk && 'border-amber-500/30 hover:border-amber-500/60 hover:shadow-[0_16px_35px_rgba(245,158,11,0.15)]',
        isZombie && 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_16px_35px_rgba(168,85,247,0.15)]',
        className
      )}
    >
      {/* Retro Netscape Top Chrome Bezel */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 px-3.5 py-1.5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-1.5 min-w-0">
          <span 
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              isDead && "bg-red-500",
              isActive && "bg-emerald-400 animate-pulse",
              isAtRisk && "bg-amber-400 animate-ping",
              isZombie && "bg-purple-400"
            )} 
          />
          <span className="uppercase tracking-wider text-zinc-400 font-semibold truncate text-[10px]">
            {entity.category}
          </span>
        </div>
        <div className="shrink-0">
          <StatusBadge status={entity.status} size="sm" />
        </div>
      </div>

      {/* Main card body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          {/* Identity: Authentic Logo + Full Name + Lifespan */}
          <div className="flex items-center gap-3 pt-0.5">
            <EntityLogo entity={entity} size="md" className="border border-white/15 shrink-0" />
            <div className="min-w-0 flex-1">
              <Link 
                href={`/grave/${entity.slug}`} 
                onClick={() => soundFx.playClick(850)}
                className="hover:underline block"
              >
                <h3 
                  className={cn(
                    "text-base sm:text-lg font-bold tracking-tight text-white transition-colors truncate font-serif",
                    isDead && "group-hover:text-red-400",
                    isActive && "group-hover:text-emerald-400",
                    isAtRisk && "group-hover:text-amber-400",
                    isZombie && "group-hover:text-purple-400"
                  )}
                  title={entity.name}
                >
                  {entity.name}
                </h3>
              </Link>
              <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                {entity.lifespan}
              </div>
            </div>
          </div>

          {/* Tagline / Description */}
          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed font-sans min-h-[34px]">
            {entity.tagline || entity.description}
          </p>
        </div>

        {/* Demise & Status information */}
        <div className="pt-2.5 border-t border-white/10 space-y-1.5 text-xs font-sans mt-auto">
          <div className="flex items-center justify-between">
            <span className="uppercase text-[10px] font-mono text-zinc-500 font-bold tracking-wider shrink-0">
              {isActive ? 'STATUS:' : 'DEMISE:'}
            </span>
            <span className="text-zinc-300 font-medium truncate max-w-[65%] text-right text-xs" title={isActive ? 'Active Production' : entity.cause_category}>
              {isActive ? 'Live Production' : entity.cause_category}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="uppercase text-[10px] font-mono text-zinc-500 font-bold tracking-wider shrink-0">
              {isActive ? 'MONITORED:' : 'BURIED:'}
            </span>
            <span className={cn("font-mono text-xs", isActive ? "text-emerald-400 font-semibold" : "text-zinc-400")}>
              {isActive 
                ? 'Active Registry' 
                : (entity.death_date || (entity.death_year ? `${entity.death_year}` : 'Defunct'))}
            </span>
          </div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="px-4 py-2.5 bg-zinc-900 border-t border-white/10 flex items-center justify-between text-xs font-sans mt-auto">
        {/* Interactive Candle Light Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLightCandle}
            title="Light a memorial candle"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono font-bold transition-all",
              litRecently 
                ? "bg-amber-500/30 text-amber-300 scale-105" 
                : "text-amber-400/90 hover:text-amber-300 hover:bg-amber-950/40"
            )}
          >
            <Flame className={cn("w-3.5 h-3.5 transition-transform", litRecently && "animate-bounce text-amber-300")} />
            <span>{candles}</span>
          </button>

          {/* Quick Inspect Dossier Button */}
          {onQuickInspect && (
            <button
              onClick={(e) => {
                e.preventDefault();
                soundFx.playClick(750);
                onQuickInspect(entity);
              }}
              title="Quick inspect autopsy dossier"
              className="text-zinc-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Memorial Link */}
        <Link
          href={`/grave/${entity.slug}`}
          onClick={() => soundFx.playClick(850)}
          className={cn(
            "flex items-center gap-1 font-bold group/btn transition-colors shrink-0 text-xs",
            isActive ? "text-emerald-400 hover:text-emerald-300" : "text-red-400 hover:text-red-300"
          )}
        >
          <span>{isActive ? 'Inspect' : 'Memorial'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  );
};
