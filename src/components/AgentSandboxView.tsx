import React, { useState } from 'react';
import { ALL_TOOLS } from '../data/tools';
import { AgentTool, AgentStepLog, AgentCognitivePhase } from '../types';
import {
  Brain,
  Wrench,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Terminal,
  ShieldAlert,
  Database,
  Sliders,
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const AgentSandboxView: React.FC = () => {
  // Agent Config
  const [agentName, setAgentName] = useState('Dr. Nexus (Research Agent)');
  const [goal, setGoal] = useState('Investigate sudden anomalous temperature spikes in Data Center Sector 7.');
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'inspect_entity',
    'read_sensor',
    'write_scratchpad',
    'execute_terminal',
    'verify_goal',
  ]);
  const [memoryMode, setMemoryMode] = useState<'NONE' | 'SCRATCHPAD'>('SCRATCHPAD');
  const [planningMode, setPlanningMode] = useState<'ReAct' | 'Plan-and-Solve'>('ReAct');
  const [humanApproval, setHumanApproval] = useState(true);

  // Dynamic Sandbox Environment State
  const [envEntities, setEnvEntities] = useState([
    { id: 'rack_7a', name: 'Server Rack 7A', status: 'Temperature 94°C (CRITICAL HEAT)' },
    { id: 'coolant_pump', name: 'Liquid Coolant Pump #2', status: 'FLOW BLOCKED: Valve stuck closed' },
    { id: 'backup_fan', name: 'Emergency Auxiliary Fan', status: 'STANDBY: Ready to engage' },
  ]);

  // Simulation execution state
  const [isRunning, setIsRunning] = useState(false);
  const [stepLogs, setStepLogs] = useState<AgentStepLog[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [obstacleInjected, setObstacleInjected] = useState<string | null>(null);
  const [scratchpad, setScratchpad] = useState<Record<string, string>>({});

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStepLogs([]);
    setCurrentStep(0);
    setScratchpad({});
    setObstacleInjected(null);
  };

  const injectObstacle = (type: 'SENSOR_OFFLINE' | 'VALVE_JAMMED' | 'PERMISSION_DENIED') => {
    if (type === 'SENSOR_OFFLINE') {
      setObstacleInjected('Sensor Disconnected (Connection Refused)');
      setEnvEntities((prev) =>
        prev.map((e) => (e.id === 'rack_7a' ? { ...e, status: 'SENSOR ERROR: Connection Refused' } : e))
      );
    } else if (type === 'VALVE_JAMMED') {
      setObstacleInjected('Mechanical Jam on Coolant Pump');
      setEnvEntities((prev) =>
        prev.map((e) => (e.id === 'coolant_pump' ? { ...e, status: 'MOTOR OVERLOAD: Jammed' } : e))
      );
    } else {
      setObstacleInjected('Terminal Error: EACCES Permission Denied');
    }
  };

  // Step generator for the sandbox
  const handleExecuteNextStep = () => {
    const nextStepNum = currentStep + 1;
    setCurrentStep(nextStepNum);

    if (nextStepNum === 1) {
      const log: AgentStepLog = {
        id: `sb_${nextStepNum}`,
        stepNumber: nextStepNum,
        phase: 'EXECUTING_TOOL',
        thought: `Goal received: "${goal}". Inspecting environment entities to diagnose temperature spike.`,
        toolCall: {
          toolId: 'inspect_entity',
          toolName: 'inspect_entity',
          args: { targetId: 'rack_7a' },
        },
        observation: {
          raw: envEntities[0]?.status || 'Rack temperature is critical.',
        },
        reflection: 'Cooling failed. Let me check the coolant pump and auxiliary systems.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      if (memoryMode === 'SCRATCHPAD') {
        setScratchpad((prev) => ({ ...prev, rack_status: '94C_CRITICAL' }));
      }
    } else if (nextStepNum === 2) {
      if (obstacleInjected) {
        // Agent handles the unexpected obstacle!
        const log: AgentStepLog = {
          id: `sb_${nextStepNum}`,
          stepNumber: nextStepNum,
          phase: 'OBSERVING',
          thought: 'Attempting to inspect Coolant Pump #2...',
          toolCall: {
            toolId: 'read_sensor',
            toolName: 'read_sensor',
            args: { sensorType: 'pump_pressure' },
          },
          observation: {
            raw: `ALERT: ${obstacleInjected}!`,
            isError: true,
          },
          reflection: 'Obstacle encountered! I need to adapt and engage the emergency auxiliary fan.',
          timestamp: new Date().toLocaleTimeString(),
        };
        setStepLogs((prev) => [...prev, log]);
      } else {
        const log: AgentStepLog = {
          id: `sb_${nextStepNum}`,
          stepNumber: nextStepNum,
          phase: 'EXECUTING_TOOL',
          thought: 'Coolant valve is stuck. Engaging Emergency Auxiliary Fan via terminal command.',
          toolCall: {
            toolId: 'execute_terminal',
            toolName: 'execute_terminal',
            args: { command: 'activate_aux_fan --speed=100' },
          },
          observation: {
            raw: 'Auxiliary Fan spinning up at 6000 RPM. Airflow increased by 300 CFM.',
          },
          reflection: 'Airflow is restored. Checking if rack temperature begins declining.',
          timestamp: new Date().toLocaleTimeString(),
        };
        setStepLogs((prev) => [...prev, log]);
        setEnvEntities((prev) =>
          prev.map((e) => (e.id === 'backup_fan' ? { ...e, status: 'RUNNING: 6000 RPM (Cooling Active)' } : e))
        );
      }
    } else if (nextStepNum >= 3) {
      const log: AgentStepLog = {
        id: `sb_${nextStepNum}`,
        stepNumber: nextStepNum,
        phase: 'SUCCESS',
        thought: 'Temperature stabilized at 41°C. Mission complete.',
        toolCall: {
          toolId: 'verify_goal',
          toolName: 'verify_goal',
          args: { evidence: 'Sector 7 thermal anomaly resolved.' },
        },
        observation: {
          raw: 'All systems within acceptable thermal boundaries.',
        },
        reflection: 'Autonomously adapted to environment state.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setIsRunning(false);
      setEnvEntities((prev) =>
        prev.map((e) => (e.id === 'rack_7a' ? { ...e, status: 'Temperature 41°C (NORMAL)' } : e))
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#8DA08E]/15 text-[#4F5A50] border border-[#8DA08E]/30">
              AGENT DESIGN LAB
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D2926] font-display mt-1">
            Build & Test Your Own Custom Agent
          </h2>
          <p className="text-xs text-[#7A746B]">
            Configure the agent's brain, arm it with specific tools, inject environmental chaos, and watch how it reasons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="sandbox-step-btn"
            onClick={handleExecuteNextStep}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            <Play className="w-4 h-4" /> Trigger Next Cognitive Step
          </button>
          <button
            id="sandbox-reset-btn"
            onClick={handleReset}
            className="p-2.5 rounded-2xl bg-[#F5F1E9] hover:bg-white text-[#7A746B] hover:text-[#2D2926] border border-[#E8E2D6] transition-all"
            title="Reset sandbox"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Left Architect Controls (5 cols), Right Arena (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agent Design Form */}
        <div className="lg:col-span-5 space-y-5">
          {/* Agent Persona & Goal */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8DA08E] font-mono flex items-center gap-1.5">
              <Brain className="w-4 h-4" /> 1. Agent Brain Identity
            </h3>

            <div>
              <label className="text-xs font-mono text-[#4A443F] block mb-1">Agent Name & Role</label>
              <input
                id="sandbox-agent-name-input"
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] px-3 py-2 text-xs text-[#2D2926] focus:outline-none focus:border-[#8DA08E] font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#4A443F] block mb-1">Primary Objective / Mission Prompt</label>
              <textarea
                id="sandbox-goal-textarea"
                rows={2}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] px-3 py-2 text-xs text-[#2D2926] focus:outline-none focus:border-[#8DA08E] font-medium"
              />
            </div>

            {/* Cognitive Architecture Settings */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-mono text-[#7A746B] block mb-1">Reasoning Strategy</label>
                <select
                  value={planningMode}
                  onChange={(e) => setPlanningMode(e.target.value as any)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] px-2 py-1.5 text-xs text-[#2D2926] font-mono"
                >
                  <option value="ReAct">ReAct (Reason + Act)</option>
                  <option value="Plan-and-Solve">Plan & Solve</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono text-[#7A746B] block mb-1">Memory Scratchpad</label>
                <select
                  value={memoryMode}
                  onChange={(e) => setMemoryMode(e.target.value as any)}
                  className="w-full rounded-xl bg-[#FDFBF7] border border-[#E8E2D6] px-2 py-1.5 text-xs text-[#2D2926] font-mono"
                >
                  <option value="SCRATCHPAD">Scratchpad (Enabled)</option>
                  <option value="NONE">None (Amnesia)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tool Arsenal Selection */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8DA08E] font-mono flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> 2. Tool Arsenal (Function Calling)
              </h3>
              <span className="text-[11px] font-mono text-[#7A746B]">
                {selectedTools.length} Equipped
              </span>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {ALL_TOOLS.map((t) => {
                const isSelected = selectedTools.includes(t.id);
                return (
                  <button
                    key={t.id}
                    id={`sandbox-tool-${t.id}`}
                    onClick={() => toggleTool(t.id)}
                    className={`w-full text-left p-2.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#8DA08E]/10 border-[#8DA08E]/40 text-[#2D2926]'
                        : 'bg-[#FDFBF7] border-[#E8E2D6] text-[#7A746B] hover:text-[#2D2926]'
                    }`}
                  >
                    <div>
                      <span className="font-semibold font-mono block text-[#2D2926]">
                        {t.name}()
                      </span>
                      <span className="text-[11px] text-[#7A746B] line-clamp-1">
                        {t.description}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-[#8DA08E] text-white' : 'bg-[#F5F1E9] text-[#7A746B] border border-[#E8E2D6]'
                      }`}
                    >
                      {isSelected ? 'EQUIPPED' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Environmental Chaos Injector */}
          <div className="rounded-3xl bg-white border border-[#D4A373]/40 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4A373] font-mono flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> 3. Inject Chaos / Obstacles
            </h3>
            <p className="text-[11px] text-[#7A746B]">
              Test how the agent recovers when the real world doesn't behave as planned!
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="inject-sensor-fail-btn"
                onClick={() => injectObstacle('SENSOR_OFFLINE')}
                className="p-2.5 rounded-2xl bg-[#FDFBF7] hover:bg-rose-50 border border-[#E8E2D6] hover:border-rose-200 text-[#4A443F] hover:text-rose-700 text-xs font-mono transition-all text-left"
              >
                💥 Break Sensor (503)
              </button>
              <button
                id="inject-valve-jam-btn"
                onClick={() => injectObstacle('VALVE_JAMMED')}
                className="p-2.5 rounded-2xl bg-[#FDFBF7] hover:bg-rose-50 border border-[#E8E2D6] hover:border-rose-200 text-[#4A443F] hover:text-rose-700 text-xs font-mono transition-all text-left"
              >
                ⚙️ Jam Coolant Valve
              </button>
            </div>
            {obstacleInjected && (
              <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-[11px] font-mono text-rose-700">
                Active Obstacle: {obstacleInjected}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Simulation Arena */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active World Environment Display */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2926] font-mono flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#8DA08E]" /> Active World Entities
              </h3>
              <span className="text-xs text-[#7A746B] font-mono">Sector 7 Simulation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {envEntities.map((ent) => (
                <div
                  key={ent.id}
                  className="rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] p-3 text-xs space-y-1"
                >
                  <span className="font-semibold text-[#2D2926] block">{ent.name}</span>
                  <p className="text-[11px] font-mono text-[#7A746B]">{ent.status}</p>
                </div>
              ))}
            </div>

            {/* Persistent Scratchpad */}
            {memoryMode === 'SCRATCHPAD' && (
              <div className="pt-3 border-t border-[#E8E2D6] text-xs font-mono">
                <span className="text-[#8DA08E] font-bold block mb-1">
                  Agent Scratchpad Memory:
                </span>
                <div className="p-3 rounded-2xl bg-[#2D2926] border border-[#4A443F] text-[#A69F92]">
                  {Object.keys(scratchpad).length > 0 ? (
                    JSON.stringify(scratchpad)
                  ) : (
                    <span className="text-[#7A746B] italic">No notes written yet.</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Live ReAct Cognitive Steps */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#8DA08E]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2D2926] font-mono">
                  Agent Cognitive Stream
                </h3>
              </div>
              <span className="text-xs text-[#7A746B] font-mono">Turn: {currentStep}</span>
            </div>

            {stepLogs.length === 0 ? (
              <div className="py-12 text-center text-[#A69F92] font-mono text-xs space-y-2">
                <Sparkles className="w-8 h-8 text-[#8DA08E]/50 mx-auto animate-pulse" />
                <p>Configure the agent and click "Trigger Next Cognitive Step" to run the loop!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {stepLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl bg-[#2D2926] border border-[#4A443F] p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[#8DA08E] font-mono font-bold">
                      <span>Step #{log.stepNumber}</span>
                      <span className="text-[10px] text-[#A69F92]">{log.timestamp}</span>
                    </div>

                    <div className="text-[#FDFBF7] font-mono">
                      <strong className="text-[#D4A373]">💭 Thought:</strong> {log.thought}
                    </div>

                    {log.toolCall && (
                      <div className="text-[#C5D1C6] font-mono bg-[#4A443F]/40 p-2 rounded-xl border border-[#8DA08E]/30">
                        <strong className="text-[#8DA08E]">🛠️ Action:</strong> {log.toolCall.toolName}(
                        {JSON.stringify(log.toolCall.args)})
                      </div>
                    )}

                    {log.observation && (
                      <div
                        className={`font-mono p-2 rounded-xl border ${
                          log.observation.isError
                            ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                            : 'bg-[#4A443F]/30 text-[#E8E2D6] border-[#A69F92]/40'
                        }`}
                      >
                        <strong
                          className={log.observation.isError ? 'text-rose-400' : 'text-[#D9E2E3]'}
                        >
                          👁️ Observation:
                        </strong>{' '}
                        {log.observation.raw}
                      </div>
                    )}

                    {log.reflection && (
                      <div className="text-[#8DA08E] font-mono">
                        <strong className="text-[#8DA08E]">🪞 Reflection:</strong> {log.reflection}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
