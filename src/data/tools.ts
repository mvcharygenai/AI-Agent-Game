import { AgentTool } from '../types';

export const ALL_TOOLS: AgentTool[] = [
  {
    id: 'inspect_entity',
    name: 'inspect_entity',
    label: 'Inspect Entity',
    description: 'Look closely at an object, room, or device to read its state, labels, and clues.',
    category: 'perception',
    icon: 'Search',
    parameters: [
      { name: 'targetId', type: 'string', description: 'ID or name of the entity to inspect' },
    ],
  },
  {
    id: 'search_area',
    name: 'search_area',
    label: 'Search Area',
    description: 'Search drawers, compartments, or under objects to uncover hidden items.',
    category: 'perception',
    icon: 'Scan',
    parameters: [
      { name: 'location', type: 'string', description: 'Specific location to search' },
    ],
  },
  {
    id: 'use_keypad',
    name: 'use_keypad',
    label: 'Enter Keypad Code',
    description: 'Input a numerical PIN or password into an electronic lock.',
    category: 'action',
    icon: 'KeyRound',
    parameters: [
      { name: 'code', type: 'string', description: '4 to 6 digit passcode' },
      { name: 'target', type: 'string', description: 'Keypad identifier' },
    ],
  },
  {
    id: 'toggle_switch',
    name: 'toggle_switch',
    label: 'Toggle Switch / Valve',
    description: 'Flip a breaker switch, valve, or relay.',
    category: 'action',
    icon: 'ToggleRight',
    parameters: [
      { name: 'switchId', type: 'string', description: 'Identifier of the switch or valve' },
      { name: 'state', type: 'enum', description: 'New state', options: ['OPEN', 'CLOSED', 'ON', 'OFF'] },
    ],
  },
  {
    id: 'read_sensor',
    name: 'read_sensor',
    label: 'Read Sensor Telemetry',
    description: 'Query live scientific or environmental sensors.',
    category: 'perception',
    icon: 'Gauge',
    parameters: [
      { name: 'sensorType', type: 'enum', description: 'Type of sensor', options: ['pressure', 'radiation', 'frequency', 'optical'] },
    ],
  },
  {
    id: 'execute_terminal',
    name: 'execute_terminal',
    label: 'Run Terminal Command',
    description: 'Execute a bash command or script on the system.',
    category: 'action',
    isDangerous: true,
    icon: 'Terminal',
    parameters: [
      { name: 'command', type: 'string', description: 'The shell command to run' },
    ],
  },
  {
    id: 'write_scratchpad',
    name: 'write_scratchpad',
    label: 'Write to Memory Scratchpad',
    description: 'Record an important clue, intermediate calculation, or completed step in persistent memory.',
    category: 'computation',
    icon: 'FileSpreadsheet',
    parameters: [
      { name: 'key', type: 'string', description: 'Category or label' },
      { name: 'note', type: 'string', description: 'Content to remember' },
    ],
  },
  {
    id: 'compress_logs',
    name: 'compress_logs',
    label: 'Compress Inactive Logs',
    description: 'Safely archives and compresses log files older than 7 days.',
    category: 'file_system',
    icon: 'Archive',
    parameters: [
      { name: 'targetDirectory', type: 'string', description: 'Directory to clean' },
    ],
  },
  {
    id: 'delegate_subtask',
    name: 'delegate_subtask',
    label: 'Delegate to Sub-Agent',
    description: 'Sends a specialized goal to another agent in the swarm and waits for response.',
    category: 'communication',
    icon: 'Users',
    parameters: [
      { name: 'agentRole', type: 'enum', description: 'Target specialized agent', options: ['Scout', 'Engineer', 'Pilot'] },
      { name: 'instruction', type: 'string', description: 'Specific task instruction' },
    ],
  },
  {
    id: 'verify_goal',
    name: 'verify_goal',
    label: 'Verify Goal Completion',
    description: 'Evaluates if the primary mission condition has been fully satisfied.',
    category: 'computation',
    icon: 'CheckCircle',
    parameters: [
      { name: 'evidence', type: 'string', description: 'Explanation of how the goal was achieved' },
    ],
  },
];
