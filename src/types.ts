export type GameMode = 'MISSIONS' | 'SANDBOX' | 'SHOWDOWN' | 'ACADEMY';

export type AgentCognitivePhase = 
  | 'IDLE'
  | 'PERCEIVING'
  | 'REMEMBERING'
  | 'THINKING'
  | 'SELECTING_TOOL'
  | 'WAITING_APPROVAL'
  | 'EXECUTING_TOOL'
  | 'OBSERVING'
  | 'REFLECTING'
  | 'SUCCESS'
  | 'FAILED';

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  description: string;
  options?: string[];
  default?: any;
}

export interface AgentTool {
  id: string;
  name: string;
  label: string;
  description: string;
  category: 'perception' | 'action' | 'computation' | 'communication' | 'file_system';
  icon: string;
  isDangerous?: boolean;
  parameters: ToolParameter[];
}

export interface AgentStepLog {
  id: string;
  stepNumber: number;
  phase: AgentCognitivePhase;
  thought: string;
  toolCall?: {
    toolId: string;
    toolName: string;
    args: Record<string, any>;
  };
  observation?: {
    raw: string;
    structured?: any;
    isError?: boolean;
  };
  reflection?: string;
  timestamp: string;
  memoryUpdate?: string;
}

export interface AgentBrainConfig {
  name: string;
  systemPersona: string;
  planningStrategy: 'ReAct' | 'Plan-and-Solve' | 'Direct-Execution';
  memoryCapacity: 'NONE' | 'SCRATCHPAD' | 'EPISODIC';
  maxSteps: number;
  humanInTheLoop: boolean;
  dangerousActionApproval: boolean;
}

export interface EnvironmentEntity {
  id: string;
  name: string;
  type: 'object' | 'door' | 'terminal' | 'person' | 'chest' | 'sensor' | 'drone' | 'storage' | 'database' | 'pipeline' | 'cluster' | 'vault';
  statusText: string;
  isLocked?: boolean;
  secretData?: string;
  properties: Record<string, any>;
}

export interface MissionPuzzle {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  conceptTaught: string;
  conceptExplanation: string;
  objective: string;
  initialPrompt: string;
  scenarioBackground: string;
  initialEntities: EnvironmentEntity[];
  allowedTools: AgentTool[];
  requiredMemorySetup?: 'NONE' | 'SCRATCHPAD' | 'EPISODIC';
  requiresHumanApproval?: boolean;
  maxBudget: number;
  hint: string;
  solutionExplanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AcademyLesson {
  id: string;
  title: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  interactiveDemoType?: 'react-loop' | 'memory-loss' | 'tool-dispatch' | 'multi-agent';
  deepDive: string;
}
