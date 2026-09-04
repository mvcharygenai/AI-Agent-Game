import React, { useState } from 'react';
import { CHATBOT_VS_AGENT_COMPARISON } from '../data/concepts';
import { Bot, Brain, ArrowRight, Check, X, Sparkles, RefreshCw, Wrench, Shield, Database, Target } from 'lucide-react';

interface ShowdownScenario {
  id: string;
  title: string;
  prompt: string;
  chatbotResult: {
    text: string;
    verdict: string;
    flaws: string[];
  };
  agentResult: {
    steps: {
      thought: string;
      action: string;
      observation: string;
    }[];
    finalOutput: string;
    verdict: string;
    strengths: string[];
  };
}

const SHOWDOWN_SCENARIOS: ShowdownScenario[] = [
  {
    id: 'flights',
    title: 'Flight Booking & Calendar Sync',
    prompt: 'Find the cheapest flight from Tokyo to San Francisco leaving next Tuesday with under 2h layover, and add it to my Google Calendar.',
    chatbotResult: {
      text: 'Certainly! I recommend Flight JL002 departing Narita at 17:05 for approximately $850. It arrives at SFO at 10:30 AM. You can book this on airline websites and then manually create an event on your calendar.',
      verdict: 'Passive Text Generation (Cannot Verify or Act)',
      flaws: [
        'Guessed a flight from memory; could not check live prices or seat availability.',
        'Did not verify if the flight actually exists next Tuesday.',
        'Completely unable to add anything to Google Calendar because it has no API tools.',
      ],
    },
    agentResult: {
      steps: [
        {
          thought: 'I need to query live flight availability for next Tuesday with layover < 2h.',
          action: 'flight_search_api(origin="TYO", dest="SFO", max_layover=120)',
          observation: 'Found 3 live flights. Flight NH008 is nonstop, $790, 8 seats remaining.',
        },
        {
          thought: 'NH008 satisfies all criteria. Now calling the Calendar API tool to schedule the flight.',
          action: 'create_calendar_event(title="Flight NH008: TYO -> SFO", time="2026-09-08T17:00:00Z")',
          observation: 'Event created successfully: EventID #ev_98412.',
        },
      ],
      finalOutput: 'Verified live flight NH008 ($790 nonstop). Added directly to your Google Calendar for Tuesday at 17:00.',
      verdict: 'Active Problem Solver (Perceived, Verified, and Executed)',
      strengths: [
        'Used real-time Search API to verify true prices and availability.',
        'Executed real-world action using Calendar API.',
        'Autonomous multi-step execution without asking user to do manual work.',
      ],
    },
  },
  {
    id: 'iot_home',
    title: 'Smart Home Energy Automator',
    prompt: 'Are my kitchen lights or air conditioner on right now? If no one is home, turn them off to save power.',
    chatbotResult: {
      text: 'To check if your kitchen lights or AC are on, you should open your smart home app like Google Home or Apple HomeKit. If they are running, you can tap the toggle switch to turn them off.',
      verdict: 'Advisory Only (Blind to Physical World)',
      flaws: [
        'Has zero sensory perception: cannot check device status.',
        'Cannot execute home automation commands.',
        'Passes the entire burden back onto the human user.',
      ],
    },
    agentResult: {
      steps: [
        {
          thought: 'Checking occupancy sensor to see if anyone is in the house.',
          action: 'query_home_sensor(device="motion_hallway")',
          observation: 'Motion sensor: Inactive for 2 hours. House status: AWAY.',
        },
        {
          thought: 'House is unoccupied. Querying kitchen lights and AC power state.',
          action: 'get_device_status(devices=["kitchen_light", "living_room_ac"])',
          observation: 'Kitchen Light: ON (100%), AC: ON (68°F, drawing 1400W).',
        },
        {
          thought: 'Both devices are wasting power. Invoking home actuator tools to power down.',
          action: 'set_device_state(devices=["kitchen_light", "living_room_ac"], state="OFF")',
          observation: 'Devices powered down. Energy draw reduced by 1460W.',
        },
      ],
      finalOutput: 'House was empty. Kitchen lights and living room AC were running; both have been turned OFF. Saving ~1.4 kWh.',
      verdict: 'Sensed Real Environment & Took Physical Action',
      strengths: [
        'Perceived environment state via motion and IoT sensors.',
        'Evaluated condition ("if no one is home").',
        'Called actuators to alter physical world state.',
      ],
    },
  },
  {
    id: 'server_debug',
    title: 'Production Server Incident',
    prompt: 'Our web server is returning Error 502 Bad Gateway. Figure out what is wrong and fix it.',
    chatbotResult: {
      text: 'Error 502 Bad Gateway usually indicates that the proxy server received an invalid response from an inbound server. Common causes include: 1) Server overloaded, 2) PHP/Node process crashed, 3) Firewall blocking ports. Check your nginx logs using tail -f /var/log/nginx/error.log.',
      verdict: 'Generic Textbook Advice',
      flaws: [
        'Does not know what is actually happening on your specific machine.',
        'Cannot read actual log files or inspect process memory.',
        'Requires developer to do all the investigative work manually.',
      ],
    },
    agentResult: {
      steps: [
        {
          thought: 'Inspecting live error log file to find exact crash traceback.',
          action: 'read_log_file(path="/var/log/app/error.log", lines=50)',
          observation: 'Found: "FATAL: OutOfMemoryError in process worker_3. Heap limit exceeded."',
        },
        {
          thought: 'Memory leak crashed worker_3. Checking system available RAM.',
          action: 'run_system_command("free -m")',
          observation: 'Total: 16GB, Free: 12GB (Plenty of system RAM, worker hung).',
        },
        {
          thought: 'Worker hung on orphaned socket. Restarting the worker process cleanly.',
          action: 'run_system_command("systemctl restart web-worker@3")',
          observation: 'Worker restarted. Health check 200 OK.',
        },
      ],
      finalOutput: 'Diagnosed OutOfMemoryError on worker_3. System had ample RAM. Restarted worker cleanly; 502 resolved. Web traffic 100% normal.',
      verdict: 'Autonomous Diagnostic & Remediation Loop',
      strengths: [
        'Inspected real logs rather than guessing general causes.',
        'Verified system metrics before taking corrective action.',
        'Executed safe restart and confirmed health check.',
      ],
    },
  },
];

export const AgentVsChatbotView: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = SHOWDOWN_SCENARIOS[selectedScenarioIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-8">
      {/* View Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8DA08E]/15 text-[#4F5A50] border border-[#8DA08E]/30 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#8DA08E]" />
          <span>Interactive Head-to-Head Comparison</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#2D2926] font-display">
          Chatbot vs. AI Agent: What's the Difference?
        </h2>
        <p className="text-sm text-[#7A746B] leading-relaxed">
          Why can't a simple chatbot just "do your work"? A chatbot is like an isolated brain with no tools, no internet, and no actuators. An AI agent is that same brain equipped with tools, perception, and autonomy.
        </p>
      </div>

      {/* Scenario Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SHOWDOWN_SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            id={`showdown-scenario-btn-${idx}`}
            onClick={() => setSelectedScenarioIndex(idx)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold font-mono tracking-wide transition-all ${
              selectedScenarioIndex === idx
                ? 'bg-[#8DA08E] text-white font-bold shadow-sm'
                : 'bg-[#F5F1E9] text-[#7A746B] border border-[#E8E2D6] hover:bg-white hover:text-[#2D2926]'
            }`}
          >
            Scenario {idx + 1}: {s.title}
          </button>
        ))}
      </div>

      {/* The Prompt Card */}
      <div className="rounded-3xl bg-white border border-[#E8E2D6] p-4 sm:p-5 shadow-sm max-w-3xl mx-auto">
        <div className="text-xs font-mono font-bold text-[#D4A373] mb-1 flex items-center gap-1.5">
          <Target className="w-4 h-4" /> USER REQUEST GIVEN TO BOTH SYSTEMS:
        </div>
        <p className="text-sm sm:text-base font-semibold text-[#2D2926] italic">
          "{activeScenario.prompt}"
        </p>
      </div>

      {/* Split Comparison Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Traditional Chatbot */}
        <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#F5F1E9] text-[#7A746B] text-[10px] font-mono px-3 py-1 rounded-bl-2xl font-bold uppercase tracking-wider border-l border-b border-[#E8E2D6]">
            Single-Turn LLM
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F5F1E9] text-[#7A746B] flex items-center justify-center border border-[#E8E2D6]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2D2926]">Standard Chatbot</h3>
                <span className="text-xs text-rose-600 font-mono font-semibold">
                  {activeScenario.chatbotResult.verdict}
                </span>
              </div>
            </div>

            {/* Chatbot Output */}
            <div className="rounded-2xl bg-[#FDFBF7] p-4 border border-[#E8E2D6] text-xs text-[#4A443F] leading-relaxed space-y-2">
              <div className="text-[11px] font-mono text-[#A69F92] font-bold uppercase">
                Chatbot Response:
              </div>
              <p className="italic">"{activeScenario.chatbotResult.text}"</p>
            </div>

            {/* Inherent Flaws */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold font-mono text-rose-600 uppercase tracking-wider block">
                Why It Failed the Actual Goal:
              </span>
              <ul className="space-y-1.5">
                {activeScenario.chatbotResult.flaws.map((flaw, i) => (
                  <li key={i} className="text-xs text-[#7A746B] flex items-start gap-2">
                    <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{flaw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F5F1E9] border border-[#E8E2D6] text-[11px] text-[#7A746B] font-mono">
            <strong>Architecture:</strong> Prompt ➜ LLM Pretrained Weights ➜ Text Output (Zero Tools, Zero Autonomy)
          </div>
        </div>

        {/* Right Side: Autonomous AI Agent */}
        <div className="rounded-3xl bg-white border-2 border-[#8DA08E] p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#8DA08E] text-white text-[10px] font-mono px-3 py-1 rounded-bl-2xl font-bold uppercase tracking-wider shadow-xs">
            ReAct Autonomous Loop
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8DA08E] text-white flex items-center justify-center shadow-sm">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2D2926]">AI Agent</h3>
                <span className="text-xs text-[#8DA08E] font-mono font-semibold">
                  {activeScenario.agentResult.verdict}
                </span>
              </div>
            </div>

            {/* Agent ReAct Step Execution */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {activeScenario.agentResult.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#2D2926] border border-[#4A443F] p-3 text-xs space-y-1 font-mono"
                >
                  <div className="text-[#D4A373]">
                    <strong>Step {idx + 1} Thought:</strong> {step.thought}
                  </div>
                  <div className="text-[#8DA08E] bg-[#4A443F]/40 px-2 py-1 rounded-xl border border-[#8DA08E]/20">
                    <strong>Action:</strong> {step.action}
                  </div>
                  <div className="text-[#E8E2D6]">
                    <strong>Observation:</strong> {step.observation}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Outcome */}
            <div className="rounded-2xl bg-[#8DA08E]/10 p-3.5 border border-[#8DA08E]/30 text-xs text-[#2D2926] font-medium">
              <span className="font-bold text-[#4F5A50] font-mono block mb-1">
                ✅ Final Outcome Delivered:
              </span>
              {activeScenario.agentResult.finalOutput}
            </div>

            {/* Strengths */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold font-mono text-[#8DA08E] uppercase tracking-wider block">
                Why the Agent Succeeded:
              </span>
              <ul className="space-y-1.5">
                {activeScenario.agentResult.strengths.map((str, i) => (
                  <li key={i} className="text-xs text-[#4A443F] flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#8DA08E] shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#8DA08E]/10 border border-[#8DA08E]/20 text-[11px] text-[#4F5A50] font-mono">
            <strong>Architecture:</strong> Goal ➜ Perception ➜ Thought ➜ Tool Call ➜ Environment Feedback ➜ Repeat
          </div>
        </div>
      </div>

      {/* Interactive Architecture Matrix Table */}
      <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-[#2D2926] font-display">
          Key Dimensions: Chatbots vs. AI Agents
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D6] text-[#7A746B] font-mono uppercase text-[11px]">
                <th className="py-3 px-4">Core Capability</th>
                <th className="py-3 px-4">Standard Chatbot</th>
                <th className="py-3 px-4">Autonomous AI Agent</th>
                <th className="py-3 px-4">Why It Matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D6]">
              {CHATBOT_VS_AGENT_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#2D2926]">{row.aspect}</td>
                  <td className="py-3 px-4 text-[#7A746B]">{row.chatbot}</td>
                  <td className="py-3 px-4 text-[#8DA08E] font-medium">{row.agent}</td>
                  <td className="py-3 px-4 text-[#D4A373] font-mono font-semibold">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
