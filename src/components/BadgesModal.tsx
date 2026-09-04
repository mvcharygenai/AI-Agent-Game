import React from 'react';
import { BADGES_DATA } from '../data/concepts';
import {
  Award,
  Sparkles,
  Wrench,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Users,
  X,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
}) => {
  if (!isOpen) return null;

  const iconMap: Record<string, React.ElementType> = {
    Sparkles,
    Wrench,
    Cpu,
    ShieldCheck,
    RefreshCw,
    Users,
    Award,
  };

  const unlockedCount = unlockedBadgeIds.length;
  const totalCount = BADGES_DATA.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/60 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full rounded-3xl bg-white border border-[#E8E2D6] p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4A373]/20 text-[#D4A373] flex items-center justify-center border border-[#D4A373]/40">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2D2926] font-display">
                Agent Architect Mastery Badges
              </h3>
              <p className="text-xs text-[#7A746B] font-mono">
                Progress: {unlockedCount} of {totalCount} Badges Unlocked (
                {Math.round((unlockedCount / totalCount) * 100)}%)
              </p>
            </div>
          </div>

          <button
            id="close-badges-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#F5F1E9] hover:bg-[#E8E2D6] text-[#7A746B] hover:text-[#2D2926] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            const IconComponent = iconMap[badge.icon] || Award;

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-[#FDFBF7] border-[#D4A373]/50 shadow-sm'
                    : 'bg-[#F5F1E9]/60 border-[#E8E2D6] opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-[#D4A373] text-white shadow-sm'
                      : 'bg-[#E8E2D6] text-[#A69F92]'
                  }`}
                >
                  {isUnlocked ? (
                    <IconComponent className="w-5 h-5" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold text-xs ${isUnlocked ? 'text-[#2D2926]' : 'text-[#7A746B]'}`}>
                      {badge.title}
                    </span>
                    {isUnlocked && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isUnlocked ? 'text-[#7A746B]' : 'text-[#A69F92]'}`}>
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E8E2D6] flex justify-end">
          <button
            id="dismiss-badges-modal-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
