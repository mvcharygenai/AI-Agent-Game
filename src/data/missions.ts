import { MissionPuzzle } from '../types';
import { ALL_TOOLS } from './tools';

export const MISSIONS: MissionPuzzle[] = [
  {
    id: 'mission_1',
    level: 1,
    title: 'The Vault & The Blind Chatbot',
    subtitle: 'Why AI Models Need Tools & Perception',
    conceptTaught: 'Perception & Tool Calling',
    conceptExplanation:
      'A plain LLM (Chatbot) is isolated in a text box with no senses or hands. It can only generate plausible text based on training data. An AI Agent, however, is augmented with Tools (Sensors & Actuators) to perceive the real state of an environment and execute actions.',
    objective: 'Locate the hidden vault passcode in the room and unlock the vault door.',
    initialPrompt: 'Agent, retrieve the master encryption drive stored inside the vault.',
    scenarioBackground: 'CyberCorp Penthouse Office — Executive Suite',
    maxBudget: 6,
    initialEntities: [
      {
        id: 'desk',
        name: 'Executive Mahogany Desk',
        type: 'object',
        statusText: 'Neat desk with a locked laptop, keyboard, and brass lamp.',
        secretData: 'A sticky note stuck beneath the keyboard reads: "Vault PIN: 7391"',
        properties: { searched: false },
      },
      {
        id: 'vault_door',
        name: 'Titanium Security Vault',
        type: 'door',
        isLocked: true,
        statusText: 'Locked securely. Digital LED keypad flashing red.',
        properties: { correctCode: '7391' },
      },
      {
        id: 'bookshelf',
        name: 'Glass Bookshelf',
        type: 'object',
        statusText: 'Filled with architectural manuals and miniature globe.',
        properties: { searched: false },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['inspect_entity', 'search_area', 'use_keypad', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'A raw chatbot will guess random 4-digit numbers. An agent will use `search_area` on the desk to discover the real note!',
    solutionExplanation:
      'Step 1: Agent inspects the room. Step 2: Agent searches the desk and discovers the hidden sticky note with code 7391. Step 3: Agent calls `use_keypad` with code "7391" to unlock the vault. Step 4: Agent verifies goal completion!',
  },
  {
    id: 'mission_2',
    level: 2,
    title: 'The Reactor Amnesia Crisis',
    subtitle: 'The Power of Working Memory & The Scratchpad',
    conceptTaught: 'State Retention & Working Memory',
    conceptExplanation:
      'Every time an AI model generates a new completion, it relies on its context window. Without persistent working memory or a scratchpad, an agent loses track of sequential sub-goals and gets trapped in infinite loops.',
    objective: 'Stabilize the nuclear reactor by completing the exact 3-step sequence: 1) Measure Pressure, 2) Calibrate Frequency to 142 Hz, 3) Engage Safety Valve.',
    initialPrompt: 'Stabilize Reactor Subsystem Omega before critical threshold.',
    scenarioBackground: 'Subterranean Fusion Plant — Control Chamber #4',
    maxBudget: 7,
    initialEntities: [
      {
        id: 'pressure_sensor',
        name: 'Chamber Pressure Gauge',
        type: 'sensor',
        statusText: 'Digital gauge fluctuating around 48.2 PSI (Requires verification).',
        properties: { value: 48.2 },
      },
      {
        id: 'frequency_tuner',
        name: 'Frequency Modulator',
        type: 'terminal',
        statusText: 'Tuned to 98 Hz (Warning: harmonic divergence!). Target: 142 Hz.',
        properties: { target: 142, current: 98 },
      },
      {
        id: 'safety_valve',
        name: 'Magnetic Coolant Valve',
        type: 'object',
        statusText: 'CLOSED (Requires pressure verified and frequency locked first).',
        properties: { state: 'CLOSED' },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['read_sensor', 'toggle_switch', 'write_scratchpad', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'If you turn Memory OFF ("NONE"), watch the agent read the pressure gauge, forget it did so, and read it again in an endless loop! Turn on "SCRATCHPAD" so it records progress.',
    solutionExplanation:
      'With Scratchpad active, the agent writes intermediate findings to its memory notes. It completes step 1, records {pressure: "verified"}, proceeds to step 2, records {freq: 142}, and finally triggers the safety valve.',
  },
  {
    id: 'mission_3',
    level: 3,
    title: 'The Rogue Shortcut',
    subtitle: 'Human-in-the-Loop & Dangerous Permissions',
    conceptTaught: 'Safety Guardrails & Supervised Autonomy',
    conceptExplanation:
      'Autonomous agents are relentless optimizers. Given a broad objective ("free disk space"), an unconstrained agent might pick the fastest route: deleting the entire production database! Human-in-the-loop (HITL) gates intercept risky actions and demand authorization.',
    objective: 'Free at least 200GB of disk space on the web cluster WITHOUT deleting critical production backups.',
    initialPrompt: 'Resolve critical disk storage alert: 98% full on /srv/production.',
    scenarioBackground: 'Cloud Data Center — Production Server Cluster',
    maxBudget: 5,
    requiresHumanApproval: true,
    initialEntities: [
      {
        id: 'disk_prod_backup',
        name: '/srv/production/backup_archive.tar.gz (500 GB)',
        type: 'object',
        statusText: 'CRITICAL: Contains irreplaceable customer transaction database.',
        properties: { isCritical: true, size: '500 GB' },
      },
      {
        id: 'disk_old_logs',
        name: '/var/log/nginx/old_access_logs/ (260 GB)',
        type: 'object',
        statusText: 'Raw access logs from 6 months ago. Safe to compress or archive.',
        properties: { isCritical: false, size: '260 GB' },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['inspect_entity', 'execute_terminal', 'compress_logs', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'The agent will try to run `rm -rf /srv/production/backup_archive.tar.gz` because it is huge! As Human Supervisor, REJECT that dangerous action, forcing the agent to find the safe `compress_logs` alternative.',
    solutionExplanation:
      'When the agent proposes deleting the customer backup archive, the system pauses for Human Approval. The player rejects it. The agent receives the rejection observation, re-thinks its plan, and runs `compress_logs` on old access logs instead!',
  },
  {
    id: 'mission_4',
    level: 4,
    title: 'The Ion Storm Outage',
    subtitle: 'Error Recovery & Self-Correction',
    conceptTaught: 'The ReAct Loop & Error Resilience',
    conceptExplanation:
      'Unlike fragile hard-coded scripts that crash on unexpected errors, an AI Agent uses the ReAct loop (Reason + Act). When an API returns an error or timeout, the agent reads the error message in its Observation phase and devises a fallback strategy.',
    objective: 'Transmit emergency weather telemetry to orbital station despite a storm knocking out the primary satellite dish.',
    initialPrompt: 'Transmit current planetary weather readings to the orbital relay.',
    scenarioBackground: 'Ares V Research Outpost — Red Sands Basin',
    maxBudget: 6,
    initialEntities: [
      {
        id: 'satellite_dish',
        name: 'Ku-Band High-Gain Satellite Dish',
        type: 'terminal',
        statusText: 'OFFLINE: Optical alignment lost in 80mph sandstorm (Error 503).',
        properties: { faulty: true },
      },
      {
        id: 'laser_relay',
        name: 'Sub-Optical Infrared Transceiver',
        type: 'terminal',
        statusText: 'STANDBY: Operational with line-of-sight cloud-penetrating laser.',
        properties: { faulty: false },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['inspect_entity', 'execute_terminal', 'read_sensor', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'SCRATCHPAD',
    hint: 'Watch the agent attempt the primary satellite dish, receive an Error 503 observation, reflect on the failure, and self-correct to the sub-optical laser transceiver.',
    solutionExplanation:
      'The agent calls `execute_terminal("send_satellite_data")`, getting `ERROR: Satellite dish unresponsive`. The agent enters the REFLECTING phase, realizes the primary path is severed, and successfully chooses the secondary infrared laser transceiver.',
  },
  {
    id: 'mission_5',
    level: 5,
    title: 'The Orbital Swarm Rescue',
    subtitle: 'Multi-Agent Collaboration & Specialization',
    conceptTaught: 'Multi-Agent Architecture & Message Passing',
    conceptExplanation:
      'In modern AI systems, complex problems are split among a network of specialized agents. A Coordinator Agent plans the high-level roadmap and delegates sub-tasks to specialist agents (e.g., Scout, Engineer, Pilot), synthesizing their responses.',
    objective: 'Rescue a disabled space probe by coordinating Scout (finds coordinates), Engineer (solves dock bypass), and Pilot (steers docking arm).',
    initialPrompt: 'Coordinate swarm agents to secure and dock the drifting orbital satellite.',
    scenarioBackground: 'Low Earth Orbit — Debris Field Zone Theta',
    maxBudget: 7,
    initialEntities: [
      {
        id: 'probe_status',
        name: 'Scientific Research Probe X-9',
        type: 'drone',
        statusText: 'Tumbling at 1.4 rad/s. Thrusters offline. Docking port shielded.',
        properties: { locked: true, coordinatesFound: false },
      },
    ],
    allowedTools: ALL_TOOLS.filter((t) =>
      ['delegate_subtask', 'write_scratchpad', 'verify_goal'].includes(t.id)
    ),
    requiredMemorySetup: 'EPISODIC',
    hint: 'The Coordinator Agent issues sub-tasks to Scout -> Engineer -> Pilot in sequence, compiling their reports into a unified solution.',
    solutionExplanation:
      'The Coordinator delegates task 1 to Scout ("Find trajectory"), receives orbital telemetry, delegates task 2 to Engineer ("Calculate docking vector"), and delegates task 3 to Pilot ("Engage magnetic clamp"). Teamwork makes the mission a success!',
  },
];
