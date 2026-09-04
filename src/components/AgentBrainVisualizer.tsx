import React from 'react';
import { AgentCognitivePhase, AgentStepLog } from '../types';
import { Target, Eye, Brain, Wrench, FileText, CheckCircle2, AlertTriangle, ArrowRight, RotateCw } from 'lucide-react';

interface AgentBrainVisualizerProps {
  currentPhase: AgentCognitivePhase;
  currentStepLog?: AgentStepLog;
  goalText: string;
  scratchpadNotes: Record<string, string>;
  memoryMode: 'NONE' | 'SCRATCHPAD' | 'EPISODIC';
  selectedToolName?: string;
  isPaused: boolean;
}

export const AgentBrainVisualizer: React.FC<AgentBrainVisualizerProps> = ({
  currentPhase,
  currentStepLog,
  goalText,
  scratchpadNotes,
  memoryMode,
  selectedToolName,
  isPaused,
}) => {
  const isNodeActive = (phaseList: AgentCognitivePhase[]) => phaseList.includes(currentPhase);

  return (
    <div className="w-full rounded-3xl bg-white border border-[#E8E2D6] p-5 sm:p-6 shadow-sm">
      {/* Header & Phase Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E2D6] pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#8DA08E] animate-ping" />
          <h2 className="text-xs uppercase tracking-widest text-[#A69F92] font-bold font-mono">
            Cognitive Pipeline Architecture
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#7A746B] font-mono">Cycle State:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase transition-all ${
              currentPhase === 'THINKING'
                ? 'bg-[#D4A373]/20 text-[#9C6D3F] border border-[#D4A373]/40 animate-pulse'
                : currentPhase === 'EXECUTING_TOOL' || currentPhase === 'SELECTING_TOOL'
                ? 'bg-[#8DA08E]/20 text-[#4F5A50] border border-[#8DA08E]/40 animate-pulse'
                : currentPhase === 'OBSERVING'
                ? 'bg-[#C5D1C6]/40 text-[#4A554B] border border-[#8DA08E]/30'
                : currentPhase === 'WAITING_APPROVAL'
                ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-bounce'
                : currentPhase === 'SUCCESS'
                ? 'bg-[#8DA08E] text-white border border-[#8DA08E]'
                : 'bg-[#F5F1E9] text-[#7A746B] border border-[#E8E2D6]'
            }`}
          >
            {currentPhase.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Interactive Loop Flow Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative mb-5">
        {/* Node 1: Goal */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${
            isNodeActive(['IDLE', 'PERCEIVING'])
              ? 'bg-[#8DA08E]/10 border-[#8DA08E] shadow-sm scale-[1.01]'
              : 'bg-[#FDFBF7] border-[#E8E2D6] opacity-90'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-[#8DA08E]">
            <Target className="w-4 h-4" />
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">1. Goal Directive</span>
          </div>
          <p className="text-xs text-[#2D2926] line-clamp-2 font-medium" title={goalText}>
            {goalText}
          </p>
        </div>

        {/* Node 2: Perception */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${
            isNodeActive(['PERCEIVING', 'OBSERVING'])
              ? 'bg-[#D4A373]/15 border-[#D4A373] shadow-sm scale-[1.01]'
              : 'bg-[#FDFBF7] border-[#E8E2D6] opacity-90'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-[#D4A373]">
            <Eye className="w-4 h-4" />
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">2. Perception</span>
          </div>
          <p className="text-xs text-[#7A746B] leading-relaxed">
            {currentStepLog?.observation
              ? currentStepLog.observation.raw.slice(0, 55) + '...'
              : 'Scanning environment entities and sensory telemetry...'}
          </p>
        </div>

        {/* Node 3: Memory / Scratchpad */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${
            isNodeActive(['REMEMBERING', 'REFLECTING'])
              ? 'bg-[#C5D1C6]/30 border-[#8DA08E] shadow-sm scale-[1.01]'
              : 'bg-[#FDFBF7] border-[#E8E2D6] opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 text-[#4F5A50]">
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#8DA08E]" />
              <span className="text-[11px] font-bold font-mono uppercase tracking-wider">3. Memory</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E8E2D6] text-[#4A443F] font-mono">
              {memoryMode}
            </span>
          </div>
          <div className="text-xs font-mono">
            {memoryMode === 'NONE' ? (
              <span className="text-rose-600 font-semibold">Memory Disabled (Amnesia!)</span>
            ) : Object.keys(scratchpadNotes).length > 0 ? (
              <span className="text-[#8DA08E] font-semibold">
                {Object.keys(scratchpadNotes).length} notes stored
              </span>
            ) : (
              <span className="text-[#A69F92]">Scratchpad empty</span>
            )}
          </div>
        </div>

        {/* Node 4: Reasoning Core (LLM Brain) */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${
            isNodeActive(['THINKING'])
              ? 'bg-[#E6D5C3]/40 border-[#D4A373] shadow-sm scale-[1.01]'
              : 'bg-[#FDFBF7] border-[#E8E2D6] opacity-90'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-[#D4A373]">
            <Brain className="w-4 h-4" />
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">4. Reasoning (ReAct)</span>
          </div>
          <p className="text-xs text-[#2D2926] italic line-clamp-2">
            {currentStepLog?.thought
              ? `"${currentStepLog.thought}"`
              : 'Synthesizing observations into strategy...'}
          </p>
        </div>

        {/* Node 5: Tool Execution */}
        <div
          className={`relative rounded-2xl p-4 border transition-all duration-300 ${
            isNodeActive(['SELECTING_TOOL', 'EXECUTING_TOOL', 'WAITING_APPROVAL'])
              ? 'bg-[#D9E2E3]/50 border-[#7A746B] shadow-sm scale-[1.01]'
              : 'bg-[#FDFBF7] border-[#E8E2D6] opacity-90'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-[#4A443F]">
            <Wrench className="w-4 h-4 text-[#8DA08E]" />
            <span className="text-[11px] font-bold font-mono uppercase tracking-wider">5. Tool Action</span>
          </div>
          <div className="text-xs font-mono text-[#2D2926] truncate">
            {selectedToolName ? (
              <span className="text-[#4F5A50] font-bold bg-[#8DA08E]/20 px-2 py-0.5 rounded-full border border-[#8DA08E]/30">
                {selectedToolName}()
              </span>
            ) : (
              <span className="text-[#A69F92]">Awaiting selection</span>
            )}
          </div>
        </div>
      </div>

      {/* Live Cognitive Thought Bubble (Espresso Charcoal Terminal) */}
      {currentStepLog && (
        <div className="rounded-2xl bg-[#2D2926] border border-[#4A443F] p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-[#4A443F] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase font-bold text-[#D4A373] flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-[#D4A373]" /> Inside the Agent's Mind (Step {currentStepLog.stepNumber})
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#A69F92]">
              Pattern: Reason + Act (ReAct)
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Thought */}
            <div className="bg-[#4A443F]/30 border border-[#D4A373]/30 rounded-xl p-3 text-[#FDFBF7]">
              <span className="font-bold text-[#D4A373] font-mono mr-2">💭 THOUGHT:</span>
              <span className="leading-relaxed">{currentStepLog.thought}</span>
            </div>

            {/* Action / Tool Call */}
            {currentStepLog.toolCall && (
              <div className="bg-[#4A443F]/40 border border-[#8DA08E]/40 rounded-xl p-3 text-[#C5D1C6] font-mono">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#8DA08E] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> ACTION (TOOL CALL):
                  </span>
                  <span className="text-[11px] text-[#D4A373] font-semibold">{currentStepLog.toolCall.toolName}</span>
                </div>
                <pre className="text-[11px] bg-[#1F1C1A] p-2 rounded-lg border border-[#4A443F] overflow-x-auto text-[#E6D5C3]">
                  {JSON.stringify(currentStepLog.toolCall.args, null, 2)}
                </pre>
              </div>
            )}

            {/* Observation / Environment Feedback */}
            {currentStepLog.observation && (
              <div
                className={`border rounded-xl p-3 font-mono ${
                  currentStepLog.observation.isError
                    ? 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                    : 'bg-[#4A443F]/30 border-[#A69F92]/40 text-[#E8E2D6]'
                }`}
              >
                <span
                  className={`font-bold mr-2 ${
                    currentStepLog.observation.isError ? 'text-rose-400' : 'text-[#D9E2E3]'
                  }`}
                >
                  👁️ OBSERVATION (FEEDBACK):
                </span>
                <span className="leading-relaxed">{currentStepLog.observation.raw}</span>
              </div>
            )}

            {/* Reflection */}
            {currentStepLog.reflection && (
              <div className="bg-[#8DA08E]/15 border border-[#8DA08E]/40 rounded-xl p-3 text-[#FDFBF7]">
                <span className="font-bold text-[#8DA08E] font-mono mr-2">🪞 REFLECTION:</span>
                <span className="leading-relaxed">{currentStepLog.reflection}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
