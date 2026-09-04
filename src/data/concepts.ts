export interface ComparisonFeature {
  aspect: string;
  chatbot: string;
  agent: string;
  verdict: string;
  icon: string;
}

export const CHATBOT_VS_AGENT_COMPARISON: ComparisonFeature[] = [
  {
    aspect: 'Interaction Model',
    chatbot: 'Single prompt in, single response out (Turn-based conversation).',
    agent: 'Autonomous continuous loop until a multi-step objective is fulfilled.',
    verdict: 'Agents can take 5, 10, or 50 sequential steps without user intervention.',
    icon: 'RefreshCw',
  },
  {
    aspect: 'Access to the Real World',
    chatbot: 'Blind and immobile. Has no access beyond what was in its training data or input text.',
    agent: 'Equipped with Tools (Web search, APIs, file systems, code execution, robotic arms).',
    verdict: 'Tools give the AI "hands" to take real-world actions.',
    icon: 'Wrench',
  },
  {
    aspect: 'Reasoning & Reflection',
    chatbot: 'Generates text token-by-token sequentially without pausing to evaluate.',
    agent: 'Executes the ReAct Loop (Thought -> Tool Call -> Observe Output -> Self-Correct).',
    verdict: 'Agents can detect when an action failed and try an alternative approach.',
    icon: 'Brain',
  },
  {
    aspect: 'State & Memory',
    chatbot: 'Forgets everything outside the current chat window; no durable scratchpad.',
    agent: 'Maintains working memory scratchpads, state variables, and long-term vector stores.',
    verdict: 'Agents keep structured notes of what has already been tried or discovered.',
    icon: 'Database',
  },
  {
    aspect: 'Goal Orientation',
    chatbot: 'Passive. Awaits the user’s next sentence.',
    agent: 'Proactive. Deconstructs a high-level goal into a sequence of executable sub-goals.',
    verdict: 'Agents actively problem-solve until success criteria are verified.',
    icon: 'Target',
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AGENT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary loop an AI Agent executes during problem solving?',
    options: [
      'Copy -> Paste -> Send',
      'Thought (Reason) -> Action (Tool Call) -> Observation (Feedback) -> Reflection',
      'Prompt -> Wait -> Retry',
      'Train -> Validate -> Test',
    ],
    correctIndex: 1,
    explanation:
      'The ReAct (Reason + Act) loop lets the agent think about the situation, call a tool, inspect the real environment response, and adapt its next thought.',
  },
  {
    id: 'q2',
    question: 'Why does an agent need "Working Memory / Scratchpad"?',
    options: [
      'To increase model download speeds',
      'To keep track of completed sub-steps and avoid repeating failed actions in loops',
      'Because LLMs cannot read English without it',
      'It is only used for playing sound effects',
    ],
    correctIndex: 1,
    explanation:
      'Without working memory, an agent lacks state awareness and may repeat the exact same tool call over and over.',
  },
  {
    id: 'q3',
    question: 'How does an LLM "call a tool" if it is just a text-generating model?',
    options: [
      'The model magically grows robotic fingers',
      'The model outputs structured data (like JSON) specifying the function name and arguments, which the runtime executes',
      'The user has to manually type the result for the model every time',
      'Models are not capable of calling tools',
    ],
    correctIndex: 1,
    explanation:
      'Function calling allows the LLM to output a structured JSON payload (e.g. `{ name: "weather", args: { city: "Tokyo" } }`). The host environment executes the function and passes the result back as text!',
  },
  {
    id: 'q4',
    question: 'What is "Human-in-the-Loop" (HITL) in AI Agent architecture?',
    options: [
      'A game mechanic where the human plays as the enemy',
      'A safety guardrail where high-risk or irreversible actions pause for human approval',
      'A way to make the agent run twice as fast',
      'Requiring a human to write the model code from scratch every day',
    ],
    correctIndex: 1,
    explanation:
      'HITL safeguards prevent agents from accidentally executing destructive actions (like deleting databases or transferring funds) without explicit supervisor consent.',
  },
  {
    id: 'q5',
    question: 'What happens when an Agent receives an Error 500 from a tool API call?',
    options: [
      'The computer explodes',
      'The agent reads the error in its Observation, reflects on why it failed, and attempts a fallback tool or modified arguments',
      'The agent immediately claims the mission is finished successfully',
      'It reverts the model weights to 1995',
    ],
    correctIndex: 1,
    explanation:
      'Self-correction is a superpower of agents! Instead of terminating, the agent treats the error string as an observation and reasons its way to a workaround.',
  },
];

export const BADGES_DATA = [
  {
    id: 'first_step',
    title: 'First Thought',
    description: 'Watched an AI agent complete its very first cognitive step in the loop.',
    icon: 'Sparkles',
  },
  {
    id: 'tool_master',
    title: 'Tool Whisperer',
    description: 'Equipped and successfully executed a tool call to alter the environment.',
    icon: 'Wrench',
  },
  {
    id: 'memory_savior',
    title: 'Amnesia Cured',
    description: 'Enabled the Memory Scratchpad to break the agent out of an infinite loop.',
    icon: 'Cpu',
  },
  {
    id: 'guardian',
    title: 'Safety Guardian',
    description: 'Intercepted a dangerous action using Human-in-the-Loop authorization.',
    icon: 'ShieldCheck',
  },
  {
    id: 'resilient',
    title: 'Resilient Thinker',
    description: 'Witnessed the agent encounter an API error and self-correct on its own.',
    icon: 'RefreshCw',
  },
  {
    id: 'swarm_commander',
    title: 'Swarm Commander',
    description: 'Successfully coordinated multiple specialized agents to solve a mission.',
    icon: 'Users',
  },
  {
    id: 'quiz_ace',
    title: 'Agent Scholar',
    description: 'Scored 100% on the Agent Architecture Academy quiz.',
    icon: 'Award',
  },
];
