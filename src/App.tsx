import React, { useState, useEffect } from 'react';
import { GameMode } from './types';
import { Navbar } from './components/Navbar';
import { MissionView } from './components/MissionView';
import { AgentVsChatbotView } from './components/AgentVsChatbotView';
import { AgentSandboxView } from './components/AgentSandboxView';
import { AgentAcademyView } from './components/AgentAcademyView';
import { BadgesModal } from './components/BadgesModal';
import { BADGES_DATA } from './data/concepts';
import { Award, Sparkles, Brain, Bot, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('MISSIONS');
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agentcraft_badges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [latestUnlockedBadge, setLatestUnlockedBadge] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('agentcraft_badges', JSON.stringify(unlockedBadges));
    } catch (e) {
      console.warn('Could not save badges to localStorage', e);
    }
  }, [unlockedBadges]);

  const handleUnlockBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges((prev) => [...prev, badgeId]);
      const badgeObj = BADGES_DATA.find((b) => b.id === badgeId);
      if (badgeObj) {
        setLatestUnlockedBadge(badgeObj.title);
        setTimeout(() => {
          setLatestUnlockedBadge(null);
        }, 4500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A443F] flex flex-col font-sans selection:bg-[#8DA08E]/30 selection:text-[#2D2926]">
      {/* Top Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        unlockedBadgesCount={unlockedBadges.length}
        totalBadgesCount={BADGES_DATA.length}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentMode === 'MISSIONS' && (
          <MissionView onUnlockBadge={handleUnlockBadge} />
        )}
        {currentMode === 'SHOWDOWN' && <AgentVsChatbotView />}
        {currentMode === 'SANDBOX' && <AgentSandboxView />}
        {currentMode === 'ACADEMY' && (
          <AgentAcademyView onUnlockBadge={handleUnlockBadge} />
        )}
      </main>

      {/* Floating Badge Unlock Toast Notification */}
      {latestUnlockedBadge && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#D4A373] text-white font-bold shadow-xl shadow-[#D4A373]/25 border border-[#E6D5C3] animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <Award className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-mono text-[#FDFBF7]/90">
              Badge Unlocked!
            </div>
            <div className="text-sm font-extrabold">{latestUnlockedBadge}</div>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        unlockedBadgeIds={unlockedBadges}
      />

      {/* Footer */}
      <footer className="border-t border-[#E8E2D6] bg-[#F5F1E9] py-5 px-4 text-center text-xs text-[#7A746B] font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#8DA08E] flex items-center justify-center text-white text-[10px] font-bold">
              A
            </div>
            <span className="text-[#2D2926] font-semibold">
              AgentCraft: The AI Agent Game
            </span>
            <span className="text-[#A69F92]">— Natural Tones Edition</span>
          </div>
          <div className="flex items-center gap-4 text-[#7A746B] font-mono text-[11px]">
            <span>Architecture: Model + Tools + Memory + ReAct Loop</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
