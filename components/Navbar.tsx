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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-950/95 backdrop-blur-md">
      {/* Top retro-futuristic OS titlebar */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-1 bg-zinc-900 border-b border-white/10 text-[11px] font-mono text-zinc-300 select-none">
        {/* Left window badge */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 mr-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-700 border border-white/20 inline-block" />
            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-700 border border-white/20 inline-block" />
            <span className="w-2.5 h-2.5 rounded-sm bg-red-800/80 border border-red-500/30 inline-block" />
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider font-semibold text-zinc-200">
            SYS.ARCHIVE_V3 // 1,027 SITES INDEXED
          </span>
          <span className="hidden md:inline-block text-zinc-500">•</span>
          <span className="hidden md:inline-block text-zinc-400">
            547 DEAD • 434 ACTIVE • 36 ZOMBIES • 10 AT RISK
          </span>
        </div>

        {/* Right controls: Sound & CRT toggle & Open Data Hub */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Enable Synthesized Retro Sound" : "Mute Sound"}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono transition-colors",
              isMuted 
                ? "bg-zinc-800/80 border-white/10 text-zinc-400 hover:text-white" 
                : "bg-emerald-950/50 border-emerald-500/40 text-emerald-400 font-bold"
            )}
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 animate-pulse" />}
            <span className="hidden sm:inline">{isMuted ? "MUTED" : "AUDIO ON"}</span>
          </button>

          {/* CRT Scanline Toggle Button */}
          <button
            onClick={handleToggleScanlines}
            title="Toggle CRT Scanline Overlay"
            className={cn(
              "hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border text-[11px] font-mono transition-colors",
              scanlinesActive
                ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-300"
                : "bg-zinc-800/80 border-white/10 text-zinc-400 hover:text-white"
            )}
          >
            <Tv className="w-3 h-3" />
            <span>CRT {scanlinesActive ? "ON" : "OFF"}</span>
          </button>

          <span className="hidden sm:inline text-white/20">|</span>

          <Link 
            href="/export" 
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
          >
            <ArrowDownToLine className="w-3 h-3" />
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
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-red-950/60 border-2 border-red-500/40 flex items-center justify-center text-red-400 group-hover:border-red-500/90 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0">
            <span className="font-serif font-black text-xl">†</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white uppercase group-hover:text-red-400 transition-colors drop-shadow-sm">
              INTERNET GRAVEYARD
            </span>
            <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase -mt-0.5 hidden sm:block font-medium">
              Web Archaeology & Relic Necropolis
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-0.5 font-sans text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClick(750)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150',
                  isActive
                    ? 'bg-white/12 text-white font-bold shadow-sm'
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/15 hover:border-emerald-500/50 hover:bg-zinc-850 text-zinc-300 hover:text-white font-mono text-xs transition-all shadow-sm group"
            title="Search Archive (Cmd+K / Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-pulse" />
            <span className="hidden md:inline text-zinc-400">Search Archive...</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/10 text-[10px] text-zinc-400 font-bold group-hover:text-emerald-300">
              ⌘K
            </span>
          </button>

          <Link
            href="/random"
            onClick={() => soundFx.playClick(800)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-850 border border-white/15 hover:border-red-500/50 hover:bg-zinc-800 text-white font-sans text-xs font-semibold transition-all shadow-sm group"
          >
            <Shuffle className="w-3.5 h-3.5 text-red-400 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
            <span>Random</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 border border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 border-t border-white/10 bg-zinc-950/98 space-y-2 font-sans text-sm">
          <div className="pt-2 pb-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSearch();
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-zinc-300 font-mono text-xs"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-400" />
                <span>Search 1,027 Relics...</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400">⌘K</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 pt-1">
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
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-xs font-medium',
                    isActive
                      ? 'bg-white/15 text-white font-bold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{link.label}</span>
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
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/50 border border-red-500/40 text-red-400 font-bold text-xs"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Grave</span>
            </Link>
            <button
              onClick={handleToggleSound}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/15 text-zinc-300 text-xs font-mono"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
