"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GraveEntity, GraveStatus, GraveCategory, CauseCategory } from '@/types/graveyard';
import { GraveCard } from '@/components/GraveCard';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Database,
  Calendar,
  Layers,
  Skull,
  Activity,
  ArrowRight
} from 'lucide-react';
import { ALL_SEED_ENTITIES } from '@/data/seed-entities-batch2';

const STATUS_OPTIONS: (GraveStatus | 'ALL')[] = [
  'ALL',
  'CONFIRMED_DEAD',
  'AT_RISK',
  'ABANDONED',
  'ZOMBIE',
  'OFFLINE',
  'ACTIVE'
];

const CATEGORY_OPTIONS: (GraveCategory | 'ALL')[] = [
  'ALL',
  'Social',
  'Messaging',
  'Gaming',
  'Streaming',
  'Search',
  'Developer tools',
  'Web technology',
  'Communities',
  'Hardware'
];

const CAUSE_OPTIONS: (CauseCategory | 'ALL')[] = [
  'ALL',
  'Acquired & Discontinued',
  'Market Competition',
  'Strategic Pivot',
  'Legal & Regulatory',
  'Bankruptcy',
  'Lack of Monetization',
  'Security & Privacy',
  'Technological Obsolescence',
  'Community Collapse'
];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialStatus = searchParams.get('status') || 'ALL';

  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCause, setSelectedCause] = useState<string>('ALL');
  const [yearFrom, setYearFrom] = useState<string>('');
  const [yearTo, setYearTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'candles' | 'name' | 'oldest'>('recent');

  useEffect(() => {
    if (searchParams.get('q')) setSearchQuery(searchParams.get('q')!);
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category')!);
    if (searchParams.get('status')) setSelectedStatus(searchParams.get('status')!);
  }, [searchParams]);

  // Natural language query mapping helpers
  const filteredEntities = useMemo(() => {
    let list = [...ALL_SEED_ENTITIES];
    let q = searchQuery.toLowerCase().trim();

    // Natural Language Query Interpreters
    if (q.includes('dead social') || q.includes('social networks')) {
      list = list.filter(e => e.category === 'Social');
      q = q.replace(/dead social( networks)?/g, '').trim();
    }
    if (q.includes('abandoned developer') || q.includes('dev tools')) {
      list = list.filter(e => e.category === 'Developer tools');
      q = q.replace(/abandoned developer( tools)?/g, '').trim();
    }
    if (q.includes('games shut down') || q.includes('dead games')) {
      list = list.filter(e => e.category === 'Gaming');
      q = q.replace(/games shut down|dead games/g, '').trim();
    }
    if (q.match(/\b(19\d\d|20\d\d)\b/)) {
      const yearMatch = q.match(/\b(19\d\d|20\d\d)\b/);
      if (yearMatch) {
        const yr = parseInt(yearMatch[0]);
        list = list.filter(e => (e.death_year === yr || e.founded_year === yr));
        q = q.replace(yearMatch[0], '').trim();
      }
    }

    // Direct text search
    if (q.length > 0) {
      list = list.filter(e => {
        return (
          e.name.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q) ||
          e.primary_domain.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.cause_of_death_summary.toLowerCase().includes(q) ||
          e.cause_category.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
        );
      });
    }

    // Status filter
    if (selectedStatus !== 'ALL') {
      list = list.filter(e => e.status.toUpperCase() === selectedStatus.toUpperCase());
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter(e => e.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Cause filter
    if (selectedCause !== 'ALL') {
      list = list.filter(e => e.cause_category.toLowerCase() === selectedCause.toLowerCase());
    }

    // Year Range
    if (yearFrom) {
      const from = parseInt(yearFrom);
      list = list.filter(e => (e.death_year || e.founded_year) >= from);
    }
    if (yearTo) {
      const to = parseInt(yearTo);
      list = list.filter(e => (e.death_year || e.founded_year) <= to);
    }

    // Sorting
    if (sortBy === 'candles') {
      list.sort((a, b) => (b.candle_count || 0) - (a.candle_count || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => a.founded_year - b.founded_year);
    } else {
      // Default: recent
      list.sort((a, b) => (b.death_year || 2024) - (a.death_year || 2024));
    }

    return list;
  }, [searchQuery, selectedStatus, selectedCategory, selectedCause, yearFrom, yearTo, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedCause('ALL');
    setYearFrom('');
    setYearTo('');
  };

  const hasActiveFilters = searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedCause !== 'ALL' || yearFrom || yearTo;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10 font-sans">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 tracking-wider uppercase font-bold">
          <Database className="w-4 h-4 text-red-400" />
          <span>Archaeological Search Engine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight">
          Explore the Graveyard
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 font-sans max-w-3xl leading-relaxed">
          Full-text archaeological search across names, causes of death, defunct domains, categories, and lifespan eras.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, domain, cause of demise, or natural query (e.g. 'dead social networks', 'games from 2017')..."
          className="w-full h-16 pl-14 pr-12 rounded-2xl bg-zinc-900/90 border-2 border-white/15 text-white placeholder-zinc-400 font-sans text-base sm:text-lg focus:outline-none focus:border-red-500/70 focus:ring-2 focus:ring-red-500/30 transition-all shadow-2xl"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 group-focus-within:text-red-400 transition-colors" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Faceted Filter Toolbar */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-5 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-zinc-200 font-bold text-sm sm:text-base">
            <SlidersHorizontal className="w-5 h-5 text-red-400" />
            <span>Faceted Archaeological Filters:</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-bold underline underline-offset-2 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {/* Status filter */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-12 px-3.5 rounded-xl bg-zinc-950 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'All Statuses' : st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 px-3.5 rounded-xl bg-zinc-950 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cause of death filter */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">Cause of Demise:</label>
            <select
              value={selectedCause}
              onChange={(e) => setSelectedCause(e.target.value)}
              className="w-full h-12 px-3.5 rounded-xl bg-zinc-950 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              {CAUSE_OPTIONS.map((cause) => (
                <option key={cause} value={cause}>
                  {cause === 'ALL' ? 'All Demise Causes' : cause}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5 flex flex-col">
            <label className="text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">Order By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-12 px-3.5 rounded-xl bg-zinc-950 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500/50 cursor-pointer"
            >
              <option value="recent">Recently Buried (Newest Death)</option>
              <option value="candles">Most Candles Lit</option>
              <option value="name">Alphabetical (A—Z)</option>
              <option value="oldest">Historical Seniority (Oldest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between font-sans text-sm text-zinc-300 border-b border-white/10 pb-3">
        <div>
          Found <span className="text-white font-bold text-base">{filteredEntities.length}</span> archived memorials
          {searchQuery && <span> matching "<span className="text-red-400 font-bold">{searchQuery}</span>"</span>}
        </div>
        <span className="font-mono text-xs text-zinc-400">Registry synchronized</span>
      </div>

      {/* Live Probe Suggestion Banner if query looks like a domain */}
      {searchQuery && (searchQuery.includes('.') || searchQuery.startsWith('http')) && (
        <div className="p-5 rounded-2xl bg-zinc-900/90 border-2 border-red-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-zinc-200">
            <Activity className="w-5 h-5 text-red-400 animate-pulse shrink-0" />
            <span className="text-sm sm:text-base">
              Looking to test live domain status for <span className="text-white font-mono font-bold">{searchQuery}</span>?
            </span>
          </div>
          <Link
            href={`/lookup?q=${encodeURIComponent(searchQuery)}`}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center gap-2 shrink-0 shadow-md"
          >
            <span>Run Live Autopsy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Results Grid */}
      {filteredEntities.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 max-w-xl mx-auto">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/15 text-zinc-400">
            <Skull className="w-10 h-10 text-red-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No Graves Located in Archives</h3>
            <p className="text-sm sm:text-base text-zinc-300">
              {searchQuery 
                ? `We could not find an archived entity matching "${searchQuery}".` 
                : 'No memorials match the selected filter combination.'}
            </p>
          </div>

          {/* Live Prober Callout if search query entered */}
          {searchQuery ? (
            <div className="w-full p-6 rounded-2xl bg-red-950/20 border-2 border-red-500/30 space-y-4 text-left">
              <div className="flex items-center gap-2 text-red-400 text-sm font-bold uppercase tracking-wider font-mono">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Live Archaeological Prober</span>
              </div>
              <p className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed">
                Is <span className="text-white font-mono font-bold">"{searchQuery}"</span> a website or service you want to inspect? Run our live diagnostic scanner right now to evaluate its DNS, HTTP status, and SSL certificates across public networks.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href={`/lookup?q=${encodeURIComponent(searchQuery)}`}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all shadow-md flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Probe "{searchQuery}" Vital Signs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors cursor-pointer shadow-md"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {filteredEntities.map((entity) => (
            <GraveCard key={entity.id} entity={entity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-graveyard-400 font-mono text-xs">Loading archaeological search index...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
