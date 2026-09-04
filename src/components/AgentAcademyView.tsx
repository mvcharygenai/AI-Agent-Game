import React, { useState } from 'react';
import { AGENT_QUIZ_QUESTIONS, QuizQuestion } from '../data/concepts';
import {
  GraduationCap,
  Brain,
  Wrench,
  Database,
  RotateCw,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AgentAcademyViewProps {
  onUnlockBadge: (badgeId: string) => void;
}

export const AgentAcademyView: React.FC<AgentAcademyViewProps> = ({ onUnlockBadge }) => {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);
  const [activeCycleStep, setActiveCycleStep] = useState<number>(0);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleGradeQuiz = () => {
    let calculatedScore = 0;
    AGENT_QUIZ_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        calculatedScore += 1;
      }
    });
    setScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore === AGENT_QUIZ_QUESTIONS.length) {
      onUnlockBadge('quiz_ace');
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
  };

  const PILLARS = [
    {
      title: '1. The Foundation Model (The Brain)',
      icon: Brain,
      summary: 'The language model (e.g. Gemini) acts as the cognitive engine.',
      description:
        'A raw LLM is essentially a next-token prediction engine trained on vast knowledge. In an agent architecture, the LLM is not just generating creative text—it is acting as a logical planner, reasoning about what to do next based on inputs and past history.',
      takeaway: 'The model provides reasoning, language understanding, and decision making.',
    },
    {
      title: '2. Tools & Function Calling (The Hands)',
      icon: Wrench,
      summary: 'APIs, calculators, web browsers, and file systems that allow real-world action.',
      description:
        'An LLM cannot read your live email, search today’s weather, or query your production database on its own. By registering Tools with JSON schemas (parameters and descriptions), the model outputs structured JSON to invoke those functions. The host program executes the code and returns the result back to the model as an Observation!',
      takeaway: 'Tools bridge the virtual reasoning of the model with the physical or digital outside world.',
    },
    {
      title: '3. Memory Systems (The Notebook)',
      icon: Database,
      summary: 'Short-term context, working scratchpads, and persistent episodic memory.',
      description:
        'Without memory, every step is isolated, causing infinite loops. Working memory stores intermediate calculations, discovered clues, and checklists. Long-term memory (like vector search / RAG) allows the agent to recall information from days or months ago.',
      takeaway: 'Memory prevents amnesia loops and keeps multi-step plans on track.',
    },
    {
      title: '4. The ReAct Loop (Autonomy & Self-Correction)',
      icon: RotateCw,
      summary: 'Thought ➜ Action ➜ Observation ➜ Reflection.',
      description:
        'Instead of giving an immediate one-shot answer, an agent enters an iterative loop. It THINKS about the current state, picks an ACTION, reads the OBSERVATION, and REFLECTS. If a tool call fails, it doesn’t crash—it adapts and tries an alternative path until the goal is satisfied.',
      takeaway: 'The loop transforms a passive model into an active, resilient problem-solver.',
    },
  ];

  const CYCLE_STEPS = [
    {
      step: '1. Perception (Sensors)',
      headline: 'The agent inspects current environment state',
      promptSnippet: 'System: Current room status is [Door: LOCKED, Desk: Contains envelope].',
      detail: 'The agent never assumes; it relies on fresh sensory telemetry from tools or inputs.',
    },
    {
      step: '2. Recall (Memory Check)',
      headline: 'The agent reviews working notes and prior turns',
      promptSnippet: 'Scratchpad Notes: Step 1 completed. Found key in envelope.',
      detail: 'Working memory ensures sequential progress without duplicating past mistakes.',
    },
    {
      step: '3. Thought (Reasoning)',
      headline: 'The LLM formulates internal chain-of-thought',
      promptSnippet: 'Thought: I have the key. I should now use the key on the door lock.',
      detail: 'Explicit reasoning allows the model to decompose complex problems into digestible steps.',
    },
    {
      step: '4. Action (Tool Call)',
      headline: 'The LLM outputs structured JSON function call',
      promptSnippet: 'Tool Call: unlock_door({ key_id: "brass_key_1" })',
      detail: 'The host runtime intercepts this JSON, executes the real code, and grabs the outcome.',
    },
    {
      step: '5. Observation (Feedback)',
      headline: 'The real world responds with the actual result',
      promptSnippet: 'Observation: Door unlocked with a soft click. Status is now OPEN.',
      detail: 'This observation is fed back to the LLM as the prompt for the next turn!',
    },
    {
      step: '6. Reflection & Goal Check',
      headline: 'Did we accomplish the user’s goal?',
      promptSnippet: 'Thought: Goal achieved. Concluding execution.',
      detail: 'If the goal is not met, the loop repeats from Step 1 with the updated observation.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8DA08E]/15 text-[#4F5A50] border border-[#8DA08E]/30 text-xs font-mono font-bold">
          <GraduationCap className="w-4 h-4 text-[#8DA08E]" />
          <span>Agent Architecture Academy</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-[#2D2926] font-display">
          How AI Agents Work Under the Hood
        </h2>
        <p className="text-sm text-[#7A746B] leading-relaxed">
          Demystifying the 4 pillars of agentic AI, the ReAct loop, and how software systems transform raw language models into autonomous problem-solvers.
        </p>
      </div>

      {/* Section 1: The 4 Pillars of an Agent */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
          <h3 className="text-lg font-bold text-[#2D2926] font-display flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#8DA08E]" /> The 4 Core Pillars of an AI Agent
          </h3>
          <span className="text-xs text-[#7A746B] font-mono">Formula: Agent = Model + Tools + Memory + Loop</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = selectedPillar === idx;
            return (
              <button
                key={idx}
                id={`pillar-card-${idx}`}
                onClick={() => setSelectedPillar(idx)}
                className={`text-left p-4 rounded-3xl border transition-all ${
                  isSelected
                    ? 'bg-[#8DA08E]/10 border-[#8DA08E] shadow-sm'
                    : 'bg-white border-[#E8E2D6] hover:bg-[#FDFBF7]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-[#8DA08E] text-white font-bold' : 'bg-[#F5F1E9] text-[#7A746B] border border-[#E8E2D6]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#2D2926] mb-1">{pillar.title}</h4>
                <p className="text-xs text-[#7A746B] line-clamp-2">{pillar.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Deep Dive Card */}
        <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-[#8DA08E] font-mono text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4" /> Architectural Breakdown: {PILLARS[selectedPillar].title}
          </div>
          <p className="text-sm text-[#4A443F] leading-relaxed font-medium">
            {PILLARS[selectedPillar].description}
          </p>
          <div className="p-3.5 rounded-2xl bg-[#8DA08E]/10 border border-[#8DA08E]/25 text-xs text-[#4F5A50] font-mono">
            <strong>Key Architectural Takeaway:</strong> {PILLARS[selectedPillar].takeaway}
          </div>
        </div>
      </div>

      {/* Section 2: The ReAct Loop Interactive Step-Through */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
          <h3 className="text-lg font-bold text-[#2D2926] font-display flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-[#D4A373]" /> The ReAct Loop: Behind the Scenes
          </h3>
          <span className="text-xs text-[#7A746B] font-mono">Click each step to inspect the prompt</span>
        </div>

        {/* Step Selector Horizontal Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CYCLE_STEPS.map((s, idx) => (
            <button
              key={idx}
              id={`cycle-step-btn-${idx}`}
              onClick={() => setActiveCycleStep(idx)}
              className={`p-3 rounded-2xl text-left border text-xs transition-all ${
                activeCycleStep === idx
                  ? 'bg-[#D4A373] text-white font-bold border-[#D4A373] shadow-sm'
                  : 'bg-[#F5F1E9] text-[#7A746B] border-[#E8E2D6] hover:bg-white hover:text-[#2D2926]'
              }`}
            >
              <span className="font-mono text-[10px] block opacity-80 uppercase tracking-wider">
                Phase {idx + 1}
              </span>
              <span className="font-semibold block truncate">{s.step.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Active Step Visualizer Card */}
        <div className="rounded-3xl bg-white border border-[#E8E2D6] p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#D4A373] uppercase">
              {CYCLE_STEPS[activeCycleStep].step}
            </span>
            <span className="text-xs text-[#7A746B] font-mono">
              Step {activeCycleStep + 1} of {CYCLE_STEPS.length}
            </span>
          </div>

          <h4 className="text-base font-bold text-[#2D2926]">
            {CYCLE_STEPS[activeCycleStep].headline}
          </h4>

          <div className="rounded-2xl bg-[#2D2926] p-4 border border-[#4A443F] font-mono text-xs text-[#D4A373]">
            <span className="text-[#A69F92] block mb-1 uppercase font-bold text-[10px]">
              Raw Internal Prompt / Payload:
            </span>
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {CYCLE_STEPS[activeCycleStep].promptSnippet}
            </pre>
          </div>

          <p className="text-xs text-[#4A443F] font-medium">
            {CYCLE_STEPS[activeCycleStep].detail}
          </p>
        </div>
      </div>

      {/* Section 3: Interactive Agent Knowledge Quiz */}
      <div className="rounded-3xl bg-white border border-[#E8E2D6] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2D6] pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#2D2926] font-display flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D4A373]" /> Test Your Knowledge: Agent Scholar Quiz
            </h3>
            <p className="text-xs text-[#7A746B] mt-1">
              Score 100% (5/5) to unlock the prestigious <strong>Agent Scholar</strong> badge!
            </p>
          </div>

          {quizSubmitted && (
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border ${
                  score === AGENT_QUIZ_QUESTIONS.length
                    ? 'bg-[#8DA08E]/20 text-[#4F5A50] border-[#8DA08E]/40'
                    : 'bg-[#D4A373]/20 text-[#9C6D3F] border-[#D4A373]/40'
                }`}
              >
                Your Score: {score} / {AGENT_QUIZ_QUESTIONS.length}
              </div>
              <button
                id="quiz-retake-btn"
                onClick={handleResetQuiz}
                className="px-3 py-1.5 rounded-xl bg-[#F5F1E9] text-[#7A746B] hover:text-[#2D2926] text-xs font-mono border border-[#E8E2D6] transition-all"
              >
                Retake
              </button>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {AGENT_QUIZ_QUESTIONS.map((q, qIndex) => {
            const answered = userAnswers[q.id] !== undefined;
            const isCorrect = userAnswers[q.id] === q.correctIndex;

            return (
              <div
                key={q.id}
                className="rounded-2xl bg-[#FDFBF7] border border-[#E8E2D6] p-5 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-[#2D2926] text-sm">
                    {qIndex + 1}. {q.question}
                  </span>
                  {quizSubmitted && (
                    <span className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      )}
                    </span>
                  )}
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    let btnStyle = 'bg-white border-[#E8E2D6] text-[#4A443F] hover:bg-[#F5F1E9]';

                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#8DA08E]/15 border-[#8DA08E] text-[#2D2926] font-semibold';
                    }

                    return (
                      <button
                        key={optIdx}
                        id={`quiz-q${qIndex}-opt${optIdx}`}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isSelected && !quizSubmitted && (
                          <span className="w-2 h-2 rounded-full bg-[#8DA08E]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <div className="pt-2 text-[#7A746B] font-mono text-[11px] border-t border-[#E8E2D6] leading-relaxed">
                    <strong className="text-[#8DA08E]">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!quizSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              id="submit-quiz-btn"
              onClick={handleGradeQuiz}
              disabled={Object.keys(userAnswers).length < AGENT_QUIZ_QUESTIONS.length}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#8DA08E] hover:bg-[#7D907E] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              Submit Quiz & Check Badges
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
