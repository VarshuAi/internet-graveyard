"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GraveEntity } from '@/types/graveyard';
import { 
  getGhostPersonality, 
  generateGhostResponse, 
  GhostMessage, 
  GhostPersonality 
} from '@/lib/ghost/ghostDialogueEngine';
import { relicAudio } from '@/lib/audio/soundArchive';
import { Terminal, Send, Sparkles, Power, RefreshCw, Volume2, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DigitalGhostTerminalProps {
  entity: GraveEntity;
  className?: string;
}

export const DigitalGhostTerminal: React.FC<DigitalGhostTerminalProps> = ({
  entity,
  className
}) => {
  const [personality] = useState<GhostPersonality>(() => getGhostPersonality(entity));
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GhostMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOpenTerminal = () => {
    setIsOpen(true);
    try {
      relicAudio.playTerminalPowerOn();
    } catch {}

    if (messages.length === 0) {
      // Stream initial greeting
      streamGhostMessage(personality.greeting);
    }
  };

  const streamGhostMessage = (fullText: string) => {
    setIsTyping(true);
    const msgId = `ghost-${Date.now()}`;
    let charIndex = 0;

    // Add empty message placeholder
    setMessages(prev => [
      ...prev,
      {
        id: msgId,
        sender: 'ghost',
        text: '',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    const interval = setInterval(() => {
      charIndex += 2; // Stream 2 characters per tick for crisp pace
      const currentSlice = fullText.slice(0, charIndex);

      setMessages(prev =>
        prev.map(m => (m.id === msgId ? { ...m, text: currentSlice } : m))
      );

      // Play soft mechanical keyclick sound every few letters
      if (soundEnabled && charIndex % 6 === 0) {
        try {
          relicAudio.playKeyClick();
        } catch {}
      }

      if (charIndex >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28);
  };

  const handleSendMessage = (textToSend?: string) => {
    const q = (textToSend || inputValue).trim();
    if (!q || isTyping) return;

    if (!isOpen) {
      setIsOpen(true);
      try {
        relicAudio.playTerminalPowerOn();
      } catch {}
    }

    // Append user message
    const userMsg: GhostMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Generate ghost response
    const reply = generateGhostResponse(entity, q);
    setTimeout(() => {
      streamGhostMessage(reply);
    }, 450);
  };

  const handleResetSession = () => {
    try {
      relicAudio.playTerminalPowerOn();
    } catch {}
    setMessages([]);
    setTimeout(() => {
      streamGhostMessage(personality.greeting);
    }, 200);
  };

  return (
    <section className={cn("rounded-2xl border border-emerald-500/30 bg-[#060907] overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.12)] font-mono text-emerald-400", className)}>
      
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a110d] border-b border-emerald-500/25">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-widest uppercase text-emerald-300">
            DIGITAL GHOST COMMUNICATOR // {entity.slug.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className={cn(
              "px-2 py-1 rounded text-[11px] transition-colors cursor-pointer border",
              soundEnabled 
                ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                : "bg-zinc-900 border-white/10 text-zinc-500"
            )}
            title="Toggle Audio Feedback"
          >
            <Volume2 className="w-3 h-3 inline mr-1" />
            Audio: {soundEnabled ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={handleResetSession}
            className="p-1 rounded bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-400 cursor-pointer"
            title="Reset Terminal Session"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          {!isOpen ? (
            <button
              onClick={handleOpenTerminal}
              className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors cursor-pointer"
            >
              Initialize Link
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded bg-red-950/40 border border-red-500/30 hover:bg-red-900/50 text-red-400 cursor-pointer"
              title="Close Link"
            >
              <Power className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Screen Body */}
      {isOpen ? (
        <div className="relative p-4 sm:p-6 flex flex-col min-h-[360px] max-h-[500px] overflow-y-auto space-y-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a1811] via-[#050a07] to-[#020503] select-text">
          
          {/* Subtle CRT Scanline overlay */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] opacity-60" />

          {/* Telemetry Status Line */}
          <div className="text-[11px] text-emerald-500/70 border-b border-emerald-500/20 pb-2">
            {personality.statusLine}
          </div>

          {/* Message Stream */}
          <div className="flex-1 space-y-4 z-20">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "p-3 rounded-lg text-xs sm:text-sm leading-relaxed",
                  m.sender === 'user'
                    ? "bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 self-end ml-8"
                    : "bg-black/60 border border-emerald-500/20 text-emerald-300 mr-8 whitespace-pre-wrap font-mono"
                )}
              >
                <div className="flex items-center justify-between text-[10px] text-emerald-500/60 pb-1 mb-1 border-b border-emerald-500/10">
                  <span className="font-bold uppercase tracking-wider">
                    {m.sender === 'user' ? 'YOU >' : `${entity.name.toUpperCase()} (GHOST) >`}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <div>{m.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="text-xs text-emerald-400 animate-pulse flex items-center gap-1.5 pl-1">
                <span>Receiving telemetry packets</span>
                <span className="inline-block w-2 h-4 bg-emerald-400 animate-ping" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="pt-2 border-t border-emerald-500/20 z-20">
            <div className="text-[10px] text-emerald-500/80 mb-2 uppercase tracking-wider font-bold">
              Suggested Inquiries:
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {personality.suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p)}
                  disabled={isTyping}
                  className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-[11px] whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 pt-2 border-t border-emerald-500/20 z-20"
          >
            <span className="text-emerald-400 font-bold shrink-0 text-xs sm:text-sm">GHOST&gt;</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask this defunct relic a question..."
              disabled={isTyping}
              className="flex-1 bg-black/70 border border-emerald-500/40 rounded-lg px-3 py-2 text-xs sm:text-sm text-emerald-200 placeholder-emerald-600/60 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <span>Transmit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      ) : (
        /* Dormant teaser preview */
        <div 
          onClick={handleOpenTerminal}
          className="p-5 sm:p-6 bg-[#07100b] hover:bg-[#0a150f] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="text-xs text-emerald-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>DORMANT PHANTOM PROCESS DETECTED</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-mono">
              Initialize a real-time spectral link to converse with {entity.name}’s digital ghost about its memories, demise, and legacy.
            </p>
          </div>

          <button
            onClick={handleOpenTerminal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0 cursor-pointer"
          >
            <span>Open Ghost Terminal</span>
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </section>
  );
};
