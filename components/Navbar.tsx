"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Flame, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  PlusCircle, 
  Menu, 
  X, 
  Shuffle, 
  Shield, 
  Database,
  Skull,
  Activity,
  Volume2,
  VolumeX,
  Scale,
  Landmark,
  Newspaper,
  ArrowDownToLine,
  Tv,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { soundFx } from '@/lib/audio/soundFx';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(true);

  useEffect(() => {
    setIsMuted(soundFx.getMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundFx.playClick(850);
    }
  };

  const handleToggleScanlines = () => {
    soundFx.playClick(700);
    setScanlinesActive((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('scanlines-disabled');
      } else {
        document.documentElement.classList.add('scanlines-disabled');
      }
      return next;
    });
  };

  const openSearch = () => {
    soundFx.playClick(900);
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const navLinks = [
    { href: '/explore', label: 'Explore', icon: Database },
    { href: '/grounds', label: 'Cemetery Map', icon: Landmark },
    { href: '/lookup', label: 'Vital Signs', icon: Activity },
    { href: '/gazette', label: 'Gazette', icon: Newspaper },
    { href: '/sounds', label: 'Sound Vault', icon: Volume2 },
    { href: '/compare', label: 'Compare', icon: Scale },
    { href: '/timeline', label: 'Timeline', icon: Clock },
    { href: '/dying-now', label: 'Dying Now', icon: AlertTriangle, highlight: true },
    { href: '/submit', label: 'Submit', icon: PlusCircle }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-zinc-950/85 backdrop-blur-xl transition-all duration-200">
      {/* Top retro-futuristic telemetry ticker bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-1.5 bg-zinc-950/90 border-b border-white/[0.06] text-[11px] font-mono text-zinc-300 select-none overflow-x-hidden">
        {/* Left window telemetry indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1 mr-1 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/60 border border-white/20 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/60 border border-white/20 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-600/60 border border-red-500/40 inline-block" />
          </div>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-wider font-semibold text-zinc-200 truncate">
            SYS.ARCHIVE // 1,027 SITES INDEXED
          </span>
          <span className="hidden md:inline-block text-zinc-600 shrink-0">•</span>
          <span className="hidden md:inline-block text-zinc-400 shrink-0 whitespace-nowrap">
            <span className="text-red-400 font-bold">547</span> EXTINCT • <span className="text-emerald-400 font-bold">434</span> ACTIVE • <span className="text-purple-400 font-bold">36</span> ZOMBIES • <span className="text-amber-400 font-bold">10</span> AT RISK
          </span>
        </div>

        {/* Right controls: Sound FX, CRT Scanlines, and Data Export */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono shrink-0">
          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Enable Synthesized Retro Sound" : "Mute Synthesized Sound"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium transition-all duration-150 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500/60",
              isMuted 
                ? "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20" 
                : "bg-emerald-950/40 border-emerald-500/40 text-emerald-400 font-semibold shadow-[0_0_10px_rgba(16,185,129,0.2)]"
            )}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse shrink-0" />}
            <span className="hidden sm:inline">{isMuted ? "AUDIO OFF" : "AUDIO ON"}</span>
          </button>

          {/* CRT Scanline Toggle Button */}
          <button
            onClick={handleToggleScanlines}
            title="Toggle CRT Scanline Overlay"
            aria-label="Toggle CRT Scanline Overlay"
            className={cn(
              "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium transition-all duration-150 cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500/60",
              scanlinesActive
                ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-300 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
            )}
          >
            <Tv className="w-3.5 h-3.5 shrink-0" />
            <span>CRT {scanlinesActive ? "ON" : "OFF"}</span>
          </button>

          <span className="hidden sm:inline text-white/20">|</span>

          <Link 
            href="/export" 
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors shrink-0"
          >
            <ArrowDownToLine className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">DATA HUB</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
        {/* Brand Logo */}
        <Link 
          href="/" 
          onClick={() => soundFx.playClick(900)}
          className="flex items-center gap-3 group shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500/60 rounded-xl"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 border border-white/15 group-hover:border-red-500/70 flex items-center justify-center text-red-500 group-hover:text-red-400 transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
            <span className="font-serif font-black text-xl leading-none flex items-center justify-center -translate-y-[1px]">†</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-bold text-base sm:text-lg xl:text-xl tracking-tight text-white uppercase group-hover:text-red-400 transition-colors drop-shadow-sm whitespace-nowrap">
              INTERNET GRAVEYARD
            </span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase -mt-0.5 hidden sm:block font-medium truncate">
              Web Archaeology & Relic Necropolis
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 font-sans text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClick(750)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap text-xs focus-visible:ring-2 focus-visible:ring-amber-500/60',
                  isActive
                    ? 'bg-white/12 text-white font-bold shadow-sm border border-white/10'
                    : 'text-zinc-300 hover:text-white hover:bg-white/8',
                  link.highlight && !isActive && 'text-amber-400 hover:text-amber-300'
                )}
              >
                <Icon className={cn('w-3.5 h-3.5 shrink-0', link.highlight ? 'text-amber-400' : 'text-zinc-400')} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Global Search Button & Random Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Cmd+K Search Launcher */}
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/15 hover:border-emerald-500/50 hover:bg-zinc-850 text-zinc-300 hover:text-white font-mono text-xs transition-all shadow-sm group shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/60"
            title="Search Archive (Cmd+K / Ctrl+K)"
            aria-label="Open command palette search"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-pulse shrink-0" />
            <span className="hidden xl:inline text-zinc-400">Search Archive...</span>
            <span className="hidden md:inline xl:hidden text-zinc-400">Search...</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 text-[10px] text-zinc-400 font-bold group-hover:text-emerald-300 shrink-0">
              ⌘K
            </span>
          </button>

          <Link
            href="/random"
            onClick={() => soundFx.playClick(800)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/15 hover:border-red-500/50 hover:bg-zinc-850 text-white font-sans text-xs font-semibold transition-all shadow-sm group shrink-0 focus-visible:ring-2 focus-visible:ring-amber-500/60"
          >
            <Shuffle className="w-3.5 h-3.5 text-red-400 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
            <span>Random</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/8 border border-white/10 shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/60"
            aria-label="Toggle Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 shrink-0" /> : <Menu className="w-5 h-5 shrink-0" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 border-t border-white/[0.08] bg-zinc-950/98 backdrop-blur-2xl space-y-3 font-sans text-sm animate-in slide-in-from-top-2 duration-200">
          <div className="pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-zinc-900 border border-white/15 text-zinc-300 font-mono text-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/60"
            >
              <span className="flex items-center gap-2 min-w-0">
                <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">Search 1,027 Relics...</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 shrink-0 font-bold">⌘K</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    soundFx.playClick(750);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors text-xs font-medium min-w-0 min-h-[44px]',
                    isActive
                      ? 'bg-white/15 text-white font-bold border border-white/10'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5 bg-zinc-900/60'
                  )}
                >
                  <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/random"
              onClick={() => {
                soundFx.playClick(800);
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 font-bold text-xs shrink-0 min-h-[44px]"
            >
              <Shuffle className="w-4 h-4 shrink-0 text-red-400" />
              <span>Random Grave</span>
            </Link>
            <button
              onClick={handleToggleSound}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-zinc-300 text-xs font-mono shrink-0 flex items-center gap-2 min-h-[44px] cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 shrink-0" /> : <Volume2 className="w-4 h-4 shrink-0" />}
              <span>{isMuted ? "Unmute" : "Mute"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
