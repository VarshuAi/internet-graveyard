"use client";

import React, { useState } from 'react';
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
  Scale,
  Landmark,
  Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-zinc-950/90 backdrop-blur-md">
      {/* Top micro telemetry bar */}
      <div className="hidden sm:flex items-center justify-between px-6 py-1.5 bg-zinc-900/95 border-b border-white/8 text-xs font-mono text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider font-semibold">ARCHIVAL SYSTEM STATUS: OPERATIONAL</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="tracking-wider text-zinc-400">"The internet forgets. We archive what disappeared."</span>
          <span className="text-white/20">|</span>
          <span className="text-zinc-300 font-semibold">EST. 2024 DIGITAL ARCHAEOLOGY</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-18 py-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-red-950/50 border border-red-500/40 flex items-center justify-center text-red-400 group-hover:border-red-500/80 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.25)] shrink-0">
            <span className="font-mono font-black text-lg">†</span>
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-black text-lg sm:text-xl tracking-tight text-white uppercase group-hover:text-red-400 transition-colors">
              INTERNET GRAVEYARD
            </span>
            <span className="text-xs font-sans tracking-wider text-zinc-400 uppercase -mt-0.5 hidden sm:block font-medium">
              Defunct Web Archaeology
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-150',
                  isActive
                    ? 'bg-white/12 text-white font-bold shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/8',
                  link.highlight && !isActive && 'text-amber-400 hover:text-amber-300'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', link.highlight ? 'text-amber-400' : 'text-zinc-400')} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons: Random Grave & Search */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <Link
            href="/random"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-850 border border-white/15 hover:border-red-500/50 hover:bg-zinc-800 text-white font-sans text-sm font-semibold transition-all shadow-md group"
          >
            <Shuffle className="w-4 h-4 text-red-400 group-hover:rotate-180 transition-transform duration-500 shrink-0" />
            <span>Random Grave</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/random"
            className="p-2 rounded-lg bg-zinc-850 border border-white/10 text-red-400"
            title="Random Grave"
          >
            <Shuffle className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 border-t border-white/10 bg-zinc-950/95 space-y-1 font-sans text-sm">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors',
                  isActive
                    ? 'bg-white/12 text-white font-bold'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/random"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-bold"
            >
              <Shuffle className="w-4 h-4" />
              <span>Explore Random Grave</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
