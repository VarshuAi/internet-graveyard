import React from 'react';
import Link from 'next/link';
import { GraveEntity } from '@/types/graveyard';
import { StatusBadge } from './StatusBadge';
import { EntityLogo } from './EntityLogo';
import { ArrowRight, Flame, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GraveCardProps {
  entity: GraveEntity;
  className?: string;
}

export const GraveCard: React.FC<GraveCardProps> = ({ entity, className }) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between h-full rounded-2xl bg-zinc-900/90 border border-white/12 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.85)] overflow-hidden font-sans',
        className
      )}
    >
      {/* Top subtle glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/0 group-hover:via-red-500/70 to-transparent transition-all duration-500" />

      {/* Main card body with flex-1 to fill space evenly */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* Top block */}
        <div className="space-y-3">
          {/* 1. Category & Status Badge Row */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/8">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold truncate">
              {entity.category}
            </span>
            <div className="shrink-0">
              <StatusBadge status={entity.status} size="sm" />
            </div>
          </div>

          {/* 2. Main Identity: Authentic Brand Logo + Full Name + Lifespan (FULL CARD WIDTH) */}
          <div className="flex items-center gap-3.5 pt-0.5">
            <EntityLogo entity={entity} size="md" />
            <div className="min-w-0 flex-1">
              <Link href={`/grave/${entity.slug}`} className="hover:underline block">
                <h3 
                  className="text-lg sm:text-xl font-black text-white group-hover:text-red-400 tracking-tight transition-colors truncate"
                  title={entity.name}
                >
                  {entity.name}
                </h3>
              </Link>
              <div className="text-xs font-mono text-zinc-300 font-bold mt-0.5">
                {entity.lifespan}
              </div>
            </div>
          </div>

          {/* 3. Short Description */}
          <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-relaxed font-sans min-h-[40px]">
            {entity.tagline || entity.description}
          </p>
        </div>

        {/* 4. Demise & Buried information */}
        <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-sans mt-auto">
          <div className="flex items-center justify-between">
            <span className="uppercase text-xs font-bold text-zinc-400 tracking-wider shrink-0">Demise:</span>
            <span className="text-zinc-200 font-medium truncate max-w-[65%] text-right" title={entity.cause_category}>
              {entity.cause_category}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="uppercase text-xs font-bold text-zinc-400 tracking-wider shrink-0">Buried:</span>
            <span className="text-zinc-300 font-mono">
              {entity.death_date || (entity.death_year ? `${entity.death_year}` : 'Defunct')}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Footer action - strictly aligned to bottom */}
      <div className="px-5 sm:px-6 py-3.5 bg-zinc-950/90 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm font-sans mt-auto">
        <div className="flex items-center gap-3.5 text-zinc-300">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium" title="Candles lit">
            <Flame className="w-4 h-4 shrink-0" />
            <span className="font-mono font-bold">{entity.candle_count || 0}</span>
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400 font-medium" title="Historical snapshots">
            <Archive className="w-4 h-4 shrink-0" />
            <span className="font-mono">{entity.archives?.length || 1}</span>
          </span>
        </div>

        <Link
          href={`/grave/${entity.slug}`}
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold group/btn transition-colors shrink-0"
        >
          <span>View Memorial</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>
    </div>
  );
};
