import React from 'react';
import { GameMode, Badge } from '../types';
import { Bot, Sparkles, Brain, Swords, GraduationCap, Award, Compass } from 'lucide-react';

interface NavbarProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  onOpenBadges: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  unlockedBadgesCount,
  totalBadgesCount,
  onOpenBadges,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E8E2D6] bg-white/95 backdrop-blur-md px-4 py-3 sm:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Game Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#8DA08E] text-white flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-[#2D2926] font-display">
                AgentCraft <span className="text-[#8DA08E] font-normal">Lab</span>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#8DA08E]/15 text-[#4F5A50] border border-[#8DA08E]/30">
                Simulator
              </span>
            </div>
            <p className="text-xs text-[#7A746B]">
              Understand AI Agents through Play & Experimentation
            </p>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F5F1E9] border border-[#E8E2D6]">
          <button
            id="nav-missions-btn"
            onClick={() => onSelectMode('MISSIONS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'MISSIONS'
                ? 'bg-[#8DA08E] text-white shadow-xs'
                : 'text-[#7A746B] hover:text-[#2D2926] hover:bg-white/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Missions</span>
          </button>

          <button
            id="nav-showdown-btn"
            onClick={() => onSelectMode('SHOWDOWN')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'SHOWDOWN'
                ? 'bg-[#8DA08E] text-white shadow-xs'
                : 'text-[#7A746B] hover:text-[#2D2926] hover:bg-white/60'
            }`}
          >
            <Swords className="w-4 h-4" />
            <span>Agent vs Chatbot</span>
          </button>

          <button
            id="nav-sandbox-btn"
            onClick={() => onSelectMode('SANDBOX')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'SANDBOX'
                ? 'bg-[#8DA08E] text-white shadow-xs'
                : 'text-[#7A746B] hover:text-[#2D2926] hover:bg-white/60'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Agent Lab</span>
          </button>

          <button
            id="nav-academy-btn"
            onClick={() => onSelectMode('ACADEMY')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentMode === 'ACADEMY'
                ? 'bg-[#8DA08E] text-white shadow-xs'
                : 'text-[#7A746B] hover:text-[#2D2926] hover:bg-white/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academy & Quiz</span>
          </button>
        </nav>

        {/* Badges / Progress Button */}
        <button
          id="badges-trigger-btn"
          onClick={onOpenBadges}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F1E9] border border-[#E8E2D6] text-[#4A443F] text-xs font-medium transition-all shadow-xs group"
          title="View unlocked Agent Architect Badges"
        >
          <Award className="w-4 h-4 text-[#D4A373] group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-[#2D2926]">Badges</span>
          <span className="font-mono font-bold bg-[#D4A373] text-white px-2 py-0.5 rounded-full text-[10px]">
            {unlockedBadgesCount}/{totalBadgesCount}
          </span>
        </button>
      </div>
    </header>
  );
};
