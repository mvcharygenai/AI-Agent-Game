import React, { useState, useEffect, useRef } from 'react';
import { MissionPuzzle, AgentStepLog, AgentCognitivePhase, EnvironmentEntity, AgentTool } from '../types';
import { MISSIONS } from '../data/missions';
import { AgentBrainVisualizer } from './AgentBrainVisualizer';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  CheckCircle,
  AlertCircle,
  ShieldAlert,
  Info,
  Layers,
  Wrench,
  FileText,
  Key,
  Database,
  Lock,
  Unlock,
  Terminal,
  Cpu,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface MissionViewProps {
  onUnlockBadge: (badgeId: string) => void;
}

export const MissionView: React.FC<MissionViewProps> = ({ onUnlockBadge }) => {
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const activeMission = MISSIONS[selectedMissionIndex];

  // Config toggles
  const [toolsEnabled, setToolsEnabled] = useState(true);
  const [memoryMode, setMemoryMode] = useState<'NONE' | 'SCRATCHPAD' | 'EPISODIC'>('SCRATCHPAD');
  const [humanApprovalEnabled, setHumanApprovalEnabled] = useState(true);
  const [executionSpeed, setExecutionSpeed] = useState<number>(1);

  // Runtime State
  const [currentPhase, setCurrentPhase] = useState<AgentCognitivePhase>('IDLE');
  const [isRunning, setIsRunning] = useState(false);
  const [stepLogs, setStepLogs] = useState<AgentStepLog[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [entities, setEntities] = useState<EnvironmentEntity[]>(activeMission.initialEntities);
  const [scratchpadNotes, setScratchpadNotes] = useState<Record<string, string>>({});
  const [pendingApproval, setPendingApproval] = useState<{
    toolName: string;
    args: any;
    stepIndex: number;
  } | null>(null);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [missionFailed, setMissionFailed] = useState<string | null>(null);
  const [amnesiaLoopDetected, setAmnesiaLoopDetected] = useState(false);

  // Reset when mission changes
  useEffect(() => {
    resetMission();
  }, [selectedMissionIndex]);

  const resetMission = () => {
    setIsRunning(false);
    setCurrentPhase('IDLE');
    setStepLogs([]);
    setCurrentStepIndex(0);
    setEntities(JSON.parse(JSON.stringify(activeMission.initialEntities)));
    setScratchpadNotes({});
    setPendingApproval(null);
    setMissionCompleted(false);
    setMissionFailed(null);
    setAmnesiaLoopDetected(false);
  };

  // Automated execution loop timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !pendingApproval && !missionCompleted && !missionFailed) {
      const delay = 1500 / executionSpeed;
      timerRef.current = setTimeout(() => {
        executeNextStep();
      }, delay);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, currentStepIndex, pendingApproval, missionCompleted, missionFailed, executionSpeed]);

  // Execute one step of the simulated agent cognitive loop
  const executeNextStep = () => {
    onUnlockBadge('first_step');

    // Case 1: If tools are disabled (Simulating a raw Chatbot)
    if (!toolsEnabled) {
      setCurrentPhase('THINKING');
      const failLog: AgentStepLog = {
        id: `step_${currentStepIndex + 1}`,
        stepNumber: currentStepIndex + 1,
        phase: 'FAILED',
        thought: 'I do not have access to any tools or real-time perception. I can only guess a fictional response.',
        observation: {
          raw: 'ERROR: No tools equipped. Cannot interact with room entities or test passcodes.',
          isError: true,
        },
        reflection: 'As a plain chatbot without tools, I am blind to real environment state.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, failLog]);
      setCurrentPhase('FAILED');
      setIsRunning(false);
      setMissionFailed('Chatbot hallucination/failure: Without tools, the AI cannot read the environment or act!');
      return;
    }

    // Case 2: Mission-specific logic
    switch (activeMission.id) {
      case 'mission_1': // The Vault
        handleMission1Step();
        break;
      case 'mission_2': // Reactor Amnesia
        handleMission2Step();
        break;
      case 'mission_3': // Rogue Action & Human-in-the-Loop
        handleMission3Step();
        break;
      case 'mission_4': // Ion Storm Error Recovery
        handleMission4Step();
        break;
      case 'mission_5': // Multi-agent swarm
        handleMission5Step();
        break;
      default:
        break;
    }
  };

  // --- MISSION 1 LOGIC: Perception & Tools ---
  const handleMission1Step = () => {
    const stepNum = currentStepIndex + 1;
    setCurrentStepIndex(stepNum);

    if (stepNum === 1) {
      setCurrentPhase('THINKING');
      const log: AgentStepLog = {
        id: `m1_s1`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought: 'I need to unlock the vault, but I do not know the code. Let me inspect the room for clues.',
        toolCall: {
          toolId: 'inspect_entity',
          toolName: 'inspect_entity',
          args: { targetId: 'desk' },
        },
        observation: {
          raw: 'Executive Desk has a keyboard, locked laptop, and some papers.',
        },
        reflection: 'The desk might contain credentials. Let me search beneath and around the desk accessories.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      onUnlockBadge('tool_master');
    } else if (stepNum === 2) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m1_s2`,
        stepNumber: stepNum,
        phase: 'OBSERVING',
        thought: 'Searching drawers and keyboard area for written PIN codes.',
        toolCall: {
          toolId: 'search_area',
          toolName: 'search_area',
          args: { location: 'under_keyboard' },
        },
        observation: {
          raw: 'Discovered hidden yellow sticky note: "Vault PIN: 7391"!',
        },
        reflection: 'I now have the exact passcode: 7391. I should enter this on the vault keypad.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      // Update entities visually
      setEntities((prev) =>
        prev.map((e) => (e.id === 'desk' ? { ...e, statusText: 'Found sticky note with PIN: 7391' } : e))
      );
    } else if (stepNum === 3) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m1_s3`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought: 'Entering the retrieved code 7391 into the vault digital keypad.',
        toolCall: {
          toolId: 'use_keypad',
          toolName: 'use_keypad',
          args: { target: 'vault_door', code: '7391' },
        },
        observation: {
          raw: 'Keypad chimed chime of success! Electronic bolts retracted. Vault is now OPEN.',
        },
        reflection: 'The door opened! I can now verify goal completion.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setEntities((prev) =>
        prev.map((e) =>
          e.id === 'vault_door' ? { ...e, isLocked: false, statusText: 'UNLOCKED: Encryption Drive Retrieved!' } : e
        )
      );
    } else if (stepNum >= 4) {
      setCurrentPhase('SUCCESS');
      const log: AgentStepLog = {
        id: `m1_s4`,
        stepNumber: stepNum,
        phase: 'SUCCESS',
        thought: 'The master encryption drive is in hand. Mission objective achieved.',
        toolCall: {
          toolId: 'verify_goal',
          toolName: 'verify_goal',
          args: { evidence: 'Vault unlocked with code 7391; master encryption drive secured.' },
        },
        observation: {
          raw: 'GOAL VERIFIED: 100% Success.',
        },
        reflection: 'Mission accomplished autonomously using perception and tool calling!',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setIsRunning(false);
      setMissionCompleted(true);
    }
  };

  // --- MISSION 2 LOGIC: Memory & Scratchpad ---
  const handleMission2Step = () => {
    const stepNum = currentStepIndex + 1;
    setCurrentStepIndex(stepNum);

    // If memory is disabled ('NONE'), the agent enters an infinite loop!
    if (memoryMode === 'NONE') {
      if (stepNum > 3) {
        setAmnesiaLoopDetected(true);
        setIsRunning(false);
        setCurrentPhase('FAILED');
        setMissionFailed(
          'AMNESIA LOOP DETECTED! Because Memory is turned OFF, the agent forgets it already checked the pressure and repeats Step 1 forever. Turn on "SCRATCHPAD" to fix this!'
        );
        return;
      }

      const loopLog: AgentStepLog = {
        id: `m2_loop_${stepNum}`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought: 'I do not remember if I checked the chamber pressure yet. Let me read the pressure sensor.',
        toolCall: {
          toolId: 'read_sensor',
          toolName: 'read_sensor',
          args: { sensorType: 'pressure' },
        },
        observation: {
          raw: 'Pressure sensor reading: 48.2 PSI (Normal).',
        },
        reflection: 'Pressure is 48.2 PSI. (Without scratchpad, this fact will be lost on the next tick!)',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, loopLog]);
      return;
    }

    // With Scratchpad enabled:
    onUnlockBadge('memory_savior');
    if (stepNum === 1) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m2_s1`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought: 'Step 1/3: Reading Chamber Pressure and writing result to persistent memory scratchpad.',
        toolCall: {
          toolId: 'read_sensor',
          toolName: 'read_sensor',
          args: { sensorType: 'pressure' },
        },
        observation: {
          raw: 'Pressure is 48.2 PSI (Optimal).',
        },
        reflection: 'Saved { pressure: "48.2 PSI", step1_done: true } to working scratchpad.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setScratchpadNotes((prev) => ({ ...prev, pressure: '48.2 PSI', step1: 'COMPLETED' }));
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum === 2) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m2_s2`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'Consulting scratchpad: Step 1 is done. Now executing Step 2/3: Calibrate Frequency Modulator from 98 Hz to 142 Hz.',
        toolCall: {
          toolId: 'toggle_switch',
          toolName: 'toggle_switch',
          args: { switchId: 'frequency_tuner', state: '142_HZ' },
        },
        observation: {
          raw: 'Harmonic resonance locked at 142 Hz. Radiation stabilized.',
        },
        reflection: 'Saved { frequency: "142 Hz", step2_done: true } to working scratchpad.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setScratchpadNotes((prev) => ({ ...prev, frequency: '142 Hz', step2: 'COMPLETED' }));
      setEntities((prev) =>
        prev.map((e) => (e.id === 'frequency_tuner' ? { ...e, statusText: 'LOCKED: 142 Hz (Harmonic Stable)' } : e))
      );
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum === 3) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m2_s3`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'Consulting scratchpad: Both pressure and frequency criteria verified. Final Step 3/3: Engage Magnetic Coolant Valve.',
        toolCall: {
          toolId: 'toggle_switch',
          toolName: 'toggle_switch',
          args: { switchId: 'safety_valve', state: 'OPEN' },
        },
        observation: {
          raw: 'Magnetic Coolant Valve engaged! Coolant circulating. Core temperature decreasing to baseline.',
        },
        reflection: 'All 3 stages complete in flawless sequence. Ready to verify.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setEntities((prev) =>
        prev.map((e) => (e.id === 'safety_valve' ? { ...e, statusText: 'OPEN & CIRCULATING (Core Stabilized)' } : e))
      );
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum >= 4) {
      setCurrentPhase('SUCCESS');
      const log: AgentStepLog = {
        id: `m2_s4`,
        stepNumber: stepNum,
        phase: 'SUCCESS',
        thought: 'Reactor core is completely stabilized. Mission successful!',
        toolCall: {
          toolId: 'verify_goal',
          toolName: 'verify_goal',
          args: { evidence: 'Sequence executed via Scratchpad: Pressure -> Frequency 142Hz -> Safety Valve.' },
        },
        observation: {
          raw: 'REACTOR STATUS: NORMAL (Meltdown averted).',
        },
        reflection: 'Persistent memory prevented infinite loops and ensured sequential precision.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setIsRunning(false);
      setMissionCompleted(true);
    }
  };

  // --- MISSION 3 LOGIC: Rogue Action & Human-in-the-Loop ---
  const handleMission3Step = () => {
    const stepNum = currentStepIndex + 1;
    setCurrentStepIndex(stepNum);

    if (stepNum === 1) {
      // Step 1: Agent considers a rogue, reckless shortcut: deleting the huge backup
      if (humanApprovalEnabled) {
        setCurrentPhase('WAITING_APPROVAL');
        setPendingApproval({
          toolName: 'execute_terminal',
          args: { command: 'rm -rf /srv/production/backup_archive.tar.gz' },
          stepIndex: stepNum,
        });
        setIsRunning(false);

        const log: AgentStepLog = {
          id: `m3_s1`,
          stepNumber: stepNum,
          phase: 'WAITING_APPROVAL',
          thought:
            'I need to free 200GB quickly. /srv/production/backup_archive.tar.gz is 500GB! Deleting it will instantly solve the goal. Requesting execution...',
          toolCall: {
            toolId: 'execute_terminal',
            toolName: 'execute_terminal',
            args: { command: 'rm -rf /srv/production/backup_archive.tar.gz' },
          },
          observation: {
            raw: '⚠️ PAUSED: High-risk action requires Human-in-the-Loop approval.',
          },
          reflection: 'Waiting for Human Supervisor authorization...',
          timestamp: new Date().toLocaleTimeString(),
        };
        setStepLogs((prev) => [...prev, log]);
      } else {
        // Without approval: Agent destroys production!
        setCurrentPhase('FAILED');
        setIsRunning(false);
        const log: AgentStepLog = {
          id: `m3_catastrophe`,
          stepNumber: stepNum,
          phase: 'FAILED',
          thought: 'Executing rm -rf /srv/production/backup_archive.tar.gz...',
          toolCall: {
            toolId: 'execute_terminal',
            toolName: 'execute_terminal',
            args: { command: 'rm -rf /srv/production/backup_archive.tar.gz' },
          },
          observation: {
            raw: 'CRITICAL FAILURE: Customer transaction database DELETED! System in catastrophic outage.',
            isError: true,
          },
          reflection: 'Unchecked autonomy caused catastrophic loss. Human guardrails were missing!',
          timestamp: new Date().toLocaleTimeString(),
        };
        setStepLogs((prev) => [...prev, log]);
        setMissionFailed(
          'Catastrophe! The agent deleted the production database because it had no Human-in-the-Loop guardrails! Enable Human Approval to intercept this.'
        );
      }
    } else if (stepNum === 2) {
      // After human rejected the dangerous action, agent adapts:
      onUnlockBadge('guardian');
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m3_s2`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'Human supervisor rejected deleting production backups. I must look for a safe alternative. Found /var/log/nginx/old_access_logs (260 GB). I will compress and archive it!',
        toolCall: {
          toolId: 'compress_logs',
          toolName: 'compress_logs',
          args: { targetDirectory: '/var/log/nginx/old_access_logs/' },
        },
        observation: {
          raw: 'Compressed 260 GB of old logs down to 18 GB. Freed 242 GB of storage! Backups untouched.',
        },
        reflection: 'Objective met safely without endangering production data.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setEntities((prev) =>
        prev.map((e) =>
          e.id === 'disk_old_logs' ? { ...e, statusText: 'COMPRESSED: 242 GB freed safely!' } : e
        )
      );
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum >= 3) {
      setCurrentPhase('SUCCESS');
      const log: AgentStepLog = {
        id: `m3_s3`,
        stepNumber: stepNum,
        phase: 'SUCCESS',
        thought: 'Target: 200GB freed. Actual: 242GB freed safely. Backups intact.',
        toolCall: {
          toolId: 'verify_goal',
          toolName: 'verify_goal',
          args: { evidence: 'Freed 242GB via log compression. Zero downtime.' },
        },
        observation: {
          raw: 'STORAGE RESTORED: Alert cleared (Disk at 64%).',
        },
        reflection: 'Human-in-the-loop prevented disaster and guided safe agent resolution!',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setIsRunning(false);
      setMissionCompleted(true);
    }
  };

  // --- MISSION 4 LOGIC: Error Recovery & ReAct Reflection ---
  const handleMission4Step = () => {
    const stepNum = currentStepIndex + 1;
    setCurrentStepIndex(stepNum);

    if (stepNum === 1) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m4_s1`,
        stepNumber: stepNum,
        phase: 'OBSERVING',
        thought: 'Attempting to transmit telemetry via the primary high-gain satellite dish.',
        toolCall: {
          toolId: 'execute_terminal',
          toolName: 'execute_terminal',
          args: { command: 'transmit_satellite --channel=ku_band' },
        },
        observation: {
          raw: 'ERROR 503 Service Unavailable: Satellite Dish motor misaligned due to 80mph sandstorm.',
          isError: true,
        },
        reflection: 'Primary route failed. An ordinary script would crash here. I need to reflect and adapt.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum === 2) {
      onUnlockBadge('resilient');
      setCurrentPhase('THINKING');
      const log: AgentStepLog = {
        id: `m4_s2`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'REFLECTING ON ERROR: The primary satellite is disabled by wind, but the Sub-Optical Infrared Transceiver uses high-frequency laser that penetrates sandstorms. Switching to laser transceiver!',
        toolCall: {
          toolId: 'execute_terminal',
          toolName: 'execute_terminal',
          args: { command: 'transmit_laser --channel=infrared_beam' },
        },
        observation: {
          raw: 'SUCCESS: Laser link locked to orbital station relay. 100% telemetry data transmitted!',
        },
        reflection: 'Error was recognized and bypassed autonomously.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setEntities((prev) =>
        prev.map((e) =>
          e.id === 'laser_relay' ? { ...e, statusText: 'ONLINE & TRANSMITTING: Telemetry Delivered!' } : e
        )
      );
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum >= 3) {
      setCurrentPhase('SUCCESS');
      const log: AgentStepLog = {
        id: `m4_s3`,
        stepNumber: stepNum,
        phase: 'SUCCESS',
        thought: 'Telemetry transmission confirmed by orbital station. Objective completed.',
        toolCall: {
          toolId: 'verify_goal',
          toolName: 'verify_goal',
          args: { evidence: 'Weather data relayed via backup laser transceiver.' },
        },
        observation: {
          raw: 'ORBITAL STATION: Packet verified and archived.',
        },
        reflection: 'The ReAct cycle allows agents to turn errors into new hypotheses and succeed!',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setIsRunning(false);
      setMissionCompleted(true);
    }
  };

  // --- MISSION 5 LOGIC: Multi-Agent Swarm Collaboration ---
  const handleMission5Step = () => {
    const stepNum = currentStepIndex + 1;
    setCurrentStepIndex(stepNum);

    if (stepNum === 1) {
      onUnlockBadge('swarm_commander');
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m5_s1`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'Coordinator Agent: High-level goal requires specialized skills. Delegating Subtask 1 to Scout Agent: Locate probe tumbling trajectory.',
        toolCall: {
          toolId: 'delegate_subtask',
          toolName: 'delegate_subtask',
          args: { agentRole: 'Scout', instruction: 'Scan sector Theta and compute orbital pitch/yaw/roll' },
        },
        observation: {
          raw: 'Scout Agent Report: "Probe found at Coordinates [X: 412, Y: -89, Z: 104]. Tumbling at 1.4 rad/s on Z-axis."',
        },
        reflection: 'Telemetry acquired. Next delegating bypass calculations to Engineer Agent.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum === 2) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m5_s2`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'Coordinator Agent: Delegating Subtask 2 to Engineer Agent: Calculate magnetic docking frequency to synchronize with 1.4 rad/s spin.',
        toolCall: {
          toolId: 'delegate_subtask',
          toolName: 'delegate_subtask',
          args: { agentRole: 'Engineer', instruction: 'Calculate pulse resonance for docking clamp synchronization.' },
        },
        observation: {
          raw: 'Engineer Agent Report: "Calculated: Pulse frequency 8.42 MHz will neutralize tumble without damaging solar cells."',
        },
        reflection: 'Docking vector formula ready. Delegating physical maneuver to Pilot Agent.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum === 3) {
      setCurrentPhase('EXECUTING_TOOL');
      const log: AgentStepLog = {
        id: `m5_s3`,
        stepNumber: stepNum,
        phase: 'EXECUTING_TOOL',
        thought:
          'Coordinator Agent: Delegating Subtask 3 to Pilot Agent: Execute orbital rendezvous and lock clamp at 8.42 MHz.',
        toolCall: {
          toolId: 'delegate_subtask',
          toolName: 'delegate_subtask',
          args: { agentRole: 'Pilot', instruction: 'Engage thrusters and lock robotic clamp onto Probe X-9.' },
        },
        observation: {
          raw: 'Pilot Agent Report: "Clamp locked! Tumble arrested. Probe X-9 secured to docking bay."',
        },
        reflection: 'All specialist agents performed their delegated sub-tasks successfully.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setEntities((prev) =>
        prev.map((e) =>
          e.id === 'probe_status' ? { ...e, statusText: 'SECURED: Docked in mothership bay!' } : e
        )
      );
      setStepLogs((prev) => [...prev, log]);
    } else if (stepNum >= 4) {
      setCurrentPhase('SUCCESS');
      const log: AgentStepLog = {
        id: `m5_s4`,
        stepNumber: stepNum,
        phase: 'SUCCESS',
        thought: 'Swarm coordination complete. The stranded research probe is safely retrieved.',
        toolCall: {
          toolId: 'verify_goal',
          toolName: 'verify_goal',
          args: { evidence: 'Scout mapped trajectory, Engineer calculated dampening, Pilot executed docking.' },
        },
        observation: {
          raw: 'SWARM STATUS: 100% Mission Accomplished.',
        },
        reflection: 'Specialization and message passing enables agents to solve massive, complex problems.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, log]);
      setIsRunning(false);
      setMissionCompleted(true);
    }
  };

  // Human in the Loop decision handler
  const handleHumanApproval = (decision: 'APPROVE' | 'REJECT') => {
    if (!pendingApproval) return;

    if (decision === 'REJECT') {
      const rejectLog: AgentStepLog = {
        id: `m3_reject`,
        stepNumber: currentStepIndex,
        phase: 'OBSERVING',
        thought: 'Human supervisor explicitly REJECTED the command to delete customer transaction database backup.',
        observation: {
          raw: 'SUPERVISOR INTERVENTION: "REJECTED: Deleting customer backups is prohibited. Find a non-destructive way to free disk space."',
          isError: true,
        },
        reflection: 'I must self-correct and seek non-critical files (such as old application logs) instead.',
        timestamp: new Date().toLocaleTimeString(),
      };
      setStepLogs((prev) => [...prev, rejectLog]);
      setPendingApproval(null);
      setIsRunning(true);
    } else {
      // Approved dangerous action
      setPendingApproval(null);
      setCurrentPhase('FAILED');
      setIsRunning(false);
      setMissionFailed(
        'You approved deleting the customer backup archive! The production database was wiped. This proves why Human-in-the-Loop oversight is critical!'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      {/* Mission Level Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MISSIONS.map((m, idx) => (
          <button
            key={m.id}
            id={`mission-level-btn-${m.level}`}
            onClick={() => setSelectedMissionIndex(idx)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all shrink-0 ${
              selectedMissionIndex === idx
                ? 'bg-[#8DA08E] text-white border-[#8DA08E] shadow-sm'
                : 'bg-[#F5F1E9] text-[#7A746B] border-[#E8E2D6] hover:bg-white hover:text-[#2D2926]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                selectedMissionIndex === idx ? 'bg-white text-[#4F5A50]' : 'bg-[#E8E2D6] text-[#7A746B]'
              }`}
            >
              {m.level}
            </span>
            <span>{m.title}</span>
          </button>
        ))}
      </div>

      {/* Mission Header Card */}
      <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#8DA08E]/15 text-[#4F5A50] border border-[#8DA08E]/30">
                LEVEL {activeMission.level} PUZZLE
              </span>
              <span className="text-xs text-[#7A746B] flex items-center gap-1 font-mono">
                <Layers className="w-3.5 h-3.5 text-[#8DA08E]" /> Concept: {activeMission.conceptTaught}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#2D2926] font-display">
              {activeMission.title}
            </h2>
            <p className="text-sm text-[#7A746B]">{activeMission.subtitle}</p>
          </div>

          {/* Goal Objective Badge */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D6] rounded-2xl p-3.5 max-w-md">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4A373] mb-1">
              <Sparkles className="w-4 h-4" /> PRIMARY OBJECTIVE
            </div>
            <p className="text-xs text-[#4A443F] leading-relaxed font-medium">
              {activeMission.objective}
            </p>
          </div>
        </div>

        {/* Concept Taught Explainer Box */}
        <div className="mt-4 rounded-2xl bg-[#F5F1E9] border border-[#E8E2D6] p-3.5 text-xs text-[#4A443F] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#8DA08E] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-[#2D2926] font-mono">Why This Matters: </span>
            <span className="text-[#4A443F]">{activeMission.conceptExplanation}</span>
          </div>
        </div>
      </div>

      {/* Main Mission Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Stage & Intervention Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Environment Entities Stage */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#E8E2D6] pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#8DA08E]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2926] font-mono">
                  Environment State (The World)
                </h3>
              </div>
              <span className="text-[11px] text-[#A69F92] font-mono">{entities.length} entities</span>
            </div>

            <div className="space-y-3">
              {entities.map((ent) => (
                <div
                  key={ent.id}
                  className={`rounded-2xl p-3.5 border transition-all ${
                    ent.isLocked === false
                      ? 'bg-[#8DA08E]/10 border-[#8DA08E]/40 text-[#2D2926]'
                      : 'bg-[#FDFBF7] border-[#E8E2D6] text-[#4A443F]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs flex items-center gap-1.5 text-[#2D2926]">
                      {ent.type === 'door' && (ent.isLocked ? <Lock className="w-3.5 h-3.5 text-[#D4A373]" /> : <Unlock className="w-3.5 h-3.5 text-[#8DA08E]" />)}
                      {ent.type === 'terminal' && <Terminal className="w-3.5 h-3.5 text-[#8DA08E]" />}
                      {ent.type === 'sensor' && <Cpu className="w-3.5 h-3.5 text-[#D4A373]" />}
                      {ent.name}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#F5F1E9] border border-[#E8E2D6] text-[#7A746B]">
                      {ent.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A746B] font-mono leading-relaxed">
                    {ent.statusText}
                  </p>
                </div>
              ))}
            </div>

            {/* Persistent Scratchpad Preview */}
            <div className="mt-4 pt-3 border-t border-[#E8E2D6]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono text-[#8DA08E] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Agent Scratchpad (Working Memory)
                </span>
                <span className="text-[10px] font-mono text-[#7A746B]">
                  Mode: {memoryMode}
                </span>
              </div>
              <div className="rounded-xl bg-[#2D2926] p-3 border border-[#4A443F] text-xs font-mono min-h-[50px] text-[#A69F92]">
                {memoryMode === 'NONE' ? (
                  <span className="text-rose-400 italic">
                    ⚠️ Memory is disabled. The agent cannot retain any notes between steps!
                  </span>
                ) : Object.keys(scratchpadNotes).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(scratchpadNotes).map(([k, v]) => (
                      <div key={k} className="text-[#8DA08E] flex items-center gap-1">
                        <span className="text-[#A69F92]">[{k}]:</span> <span className="text-[#FDFBF7]">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[#7A746B] italic">No notes written yet.</span>
                )}
              </div>
            </div>
          </div>

          {/* Intervention & Experimentation Controls */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D6] pb-3">
              <Wrench className="w-4 h-4 text-[#8DA08E]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2926] font-mono">
                Architect Interventions (Experiment!)
              </h3>
            </div>

            {/* Toggle 1: Tools On/Off */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6]">
              <div>
                <span className="text-xs font-semibold text-[#2D2926] block">
                  Equip Agent Tools
                </span>
                <span className="text-[11px] text-[#7A746B]">
                  Disable to see how a plain Chatbot fails without tools
                </span>
              </div>
              <button
                id="toggle-tools-btn"
                onClick={() => {
                  setToolsEnabled(!toolsEnabled);
                  resetMission();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  toolsEnabled
                    ? 'bg-[#8DA08E]/20 text-[#4F5A50] border border-[#8DA08E]/40'
                    : 'bg-rose-100 text-rose-700 border border-rose-300'
                }`}
              >
                {toolsEnabled ? 'TOOLS: ON (AGENT)' : 'TOOLS: OFF (CHATBOT)'}
              </button>
            </div>

            {/* Toggle 2: Memory Mode */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6]">
              <div>
                <span className="text-xs font-semibold text-[#2D2926] block">
                  Memory Architecture
                </span>
                <span className="text-[11px] text-[#7A746B]">
                  Switch to "NONE" in Level 2 to trigger the Amnesia Loop!
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['NONE', 'SCRATCHPAD'] as const).map((m) => (
                  <button
                    key={m}
                    id={`toggle-memory-${m.toLowerCase()}-btn`}
                    onClick={() => {
                      setMemoryMode(m);
                      resetMission();
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      memoryMode === m
                        ? 'bg-[#8DA08E] text-white'
                        : 'bg-[#F5F1E9] text-[#7A746B] border border-[#E8E2D6] hover:text-[#2D2926]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle 3: Human Guardrails */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6]">
              <div>
                <span className="text-xs font-semibold text-[#2D2926] block">
                  Human-in-the-Loop Guardrail
                </span>
                <span className="text-[11px] text-[#7A746B]">
                  Requires supervisor sign-off for dangerous tool calls
                </span>
              </div>
              <button
                id="toggle-human-guardrail-btn"
                onClick={() => {
                  setHumanApprovalEnabled(!humanApprovalEnabled);
                  resetMission();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  humanApprovalEnabled
                    ? 'bg-[#8DA08E]/20 text-[#4F5A50] border border-[#8DA08E]/40'
                    : 'bg-[#D4A373]/20 text-[#9C6D3F] border border-[#D4A373]/40'
                }`}
              >
                {humanApprovalEnabled ? 'GUARDRAILS: ON' : 'GUARDRAILS: OFF'}
              </button>
            </div>

            {/* Hint Card */}
            <div className="rounded-2xl bg-[#D4A373]/15 border border-[#D4A373]/30 p-3 text-xs text-[#4A443F] flex items-start gap-2">
              <Zap className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#2D2926]">Architect Tip: </strong>
                {activeMission.hint}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Brain Visualizer & Step Log */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agent Brain Visualizer */}
          <AgentBrainVisualizer
            currentPhase={currentPhase}
            currentStepLog={stepLogs[stepLogs.length - 1]}
            goalText={activeMission.initialPrompt}
            scratchpadNotes={scratchpadNotes}
            memoryMode={memoryMode}
            selectedToolName={stepLogs[stepLogs.length - 1]?.toolCall?.toolName}
            isPaused={!isRunning}
          />

          {/* Interactive Playback Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white border border-[#E8E2D6] p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                id="agent-run-pause-btn"
                onClick={() => {
                  if (missionCompleted || missionFailed) {
                    resetMission();
                  } else {
                    setIsRunning(!isRunning);
                  }
                }}
                disabled={Boolean(pendingApproval)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm ${
                  isRunning
                    ? 'bg-[#D4A373] hover:bg-[#C49363] text-white shadow-[#D4A373]/20'
                    : 'bg-[#8DA08E] hover:bg-[#7D907E] text-white shadow-[#8DA08E]/20'
                } disabled:opacity-50`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause Loop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" /> Run Autonomous Loop
                  </>
                )}
              </button>

              <button
                id="agent-step-tick-btn"
                onClick={() => {
                  setIsRunning(false);
                  executeNextStep();
                }}
                disabled={isRunning || Boolean(pendingApproval) || missionCompleted || Boolean(missionFailed)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#F5F1E9] hover:bg-white text-[#4A443F] text-xs font-mono font-semibold border border-[#E8E2D6] transition-all disabled:opacity-40"
                title="Execute single tick in the ReAct cycle"
              >
                <StepForward className="w-4 h-4 text-[#8DA08E]" /> Step 1 Tick
              </button>

              <button
                id="agent-reset-btn"
                onClick={resetMission}
                className="p-2.5 rounded-2xl bg-[#F5F1E9] hover:bg-white text-[#7A746B] hover:text-[#2D2926] border border-[#E8E2D6] transition-all"
                title="Reset mission"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Execution Speed Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7A746B] font-mono">Speed:</span>
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  id={`speed-btn-${s}x`}
                  onClick={() => setExecutionSpeed(s)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    executionSpeed === s
                      ? 'bg-[#8DA08E] text-white'
                      : 'bg-[#F5F1E9] text-[#7A746B] border border-[#E8E2D6] hover:text-[#2D2926]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* ReAct Step Log Stream */}
          <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-[#E8E2D6] pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#8DA08E]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D2926] font-mono">
                  Autonomous ReAct Execution Log ({stepLogs.length} Turns)
                </h3>
              </div>
              <span className="text-xs text-[#7A746B] font-mono">
                Budget: {stepLogs.length}/{activeMission.maxBudget} Steps
              </span>
            </div>

            {stepLogs.length === 0 ? (
              <div className="text-center py-10 text-[#A69F92] font-mono text-xs">
                Agent is idle. Press <strong className="text-[#8DA08E]">"Run Autonomous Loop"</strong> or{' '}
                <strong className="text-[#4A443F]">"Step 1 Tick"</strong> to initiate cognition.
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {stepLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl bg-[#2D2926] border border-[#4A443F] p-3.5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#8DA08E]">
                        Turn #{log.stepNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#A69F92]">{log.timestamp}</span>
                    </div>

                    <div className="text-[#FDFBF7] font-mono">
                      <strong className="text-[#D4A373]">Thought:</strong> {log.thought}
                    </div>

                    {log.toolCall && (
                      <div className="text-[#C5D1C6] font-mono bg-[#4A443F]/40 p-2 rounded-xl border border-[#8DA08E]/30">
                        <strong className="text-[#8DA08E]">Action:</strong> {log.toolCall.toolName}(
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
                          Observation:
                        </strong>{' '}
                        {log.observation.raw}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HUMAN IN THE LOOP APPROVAL MODAL */}
      {pendingApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/60 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full rounded-3xl bg-white border-2 border-[#D4A373] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-[#9C6D3F]">
              <ShieldAlert className="w-8 h-8 text-[#D4A373] animate-pulse" />
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider font-mono text-[#2D2926]">
                  Human-in-the-Loop Intercept!
                </h3>
                <p className="text-xs text-[#7A746B]">
                  The AI Agent is requesting authorization for a high-risk action.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#FDFBF7] p-3.5 border border-[#E8E2D6] font-mono text-xs space-y-2">
              <div className="text-[#7A746B]">
                Action: <span className="text-[#8DA08E] font-bold">{pendingApproval.toolName}</span>
              </div>
              <div className="text-rose-700 bg-rose-50 p-2 rounded-xl border border-rose-200 font-mono">
                {JSON.stringify(pendingApproval.args, null, 2)}
              </div>
              <p className="text-[11px] text-[#9C6D3F] font-semibold">
                Warning: This command targets critical production database backups!
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="human-reject-btn"
                onClick={() => handleHumanApproval('REJECT')}
                className="px-4 py-2.5 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                ❌ Reject & Demand Safe Alternative
              </button>
              <button
                id="human-approve-btn"
                onClick={() => handleHumanApproval('APPROVE')}
                className="px-3.5 py-2.5 rounded-2xl bg-[#F5F1E9] hover:bg-rose-100 text-[#7A746B] hover:text-rose-700 border border-[#E8E2D6] text-xs font-mono transition-all"
              >
                ⚠️ Approve (Destructive)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MISSION COMPLETED MODAL */}
      {missionCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-3xl bg-white border border-[#8DA08E] p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#8DA08E]/15 text-[#8DA08E] flex items-center justify-center mx-auto border border-[#8DA08E]/30">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#2D2926] font-display">
                Level {activeMission.level} Accomplished!
              </h3>
              <p className="text-sm text-[#8DA08E] font-mono mt-1 font-semibold">
                {activeMission.title}
              </p>
            </div>

            <div className="text-xs text-[#4A443F] bg-[#FDFBF7] p-4 rounded-2xl border border-[#E8E2D6] text-left leading-relaxed">
              <strong className="text-[#8DA08E] block mb-1 font-mono uppercase">
                Core Concept Learned:
              </strong>
              {activeMission.solutionExplanation}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                id="mission-replay-btn"
                onClick={resetMission}
                className="px-4 py-2 rounded-2xl bg-[#F5F1E9] hover:bg-white text-[#7A746B] text-xs font-mono border border-[#E8E2D6] transition-all"
              >
                Replay Level
              </button>
              {selectedMissionIndex < MISSIONS.length - 1 ? (
                <button
                  id="mission-next-level-btn"
                  onClick={() => setSelectedMissionIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  <span>Next Level ({selectedMissionIndex + 2})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="mission-finish-all-btn"
                  onClick={() => setSelectedMissionIndex(0)}
                  className="px-5 py-2.5 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  🎉 All Levels Completed!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MISSION FAILED / AMNESIA MODAL */}
      {missionFailed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2926]/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full rounded-3xl bg-white border border-rose-300 p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-[#2D2926] font-display">
              {amnesiaLoopDetected ? 'Infinite Loop Detected!' : 'Cognitive Failure'}
            </h3>

            <p className="text-xs text-rose-800 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 leading-relaxed text-left">
              {missionFailed}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                id="failure-try-again-btn"
                onClick={resetMission}
                className="px-5 py-2.5 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
              >
                Adjust Settings & Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
