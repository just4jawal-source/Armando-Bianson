import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Cpu,
  Brain,
  Trash2,
  Minimize2,
  Maximize2
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelUsed?: string;
}

export type ChatRolePreset = 'creative-producer' | 'ugc-strategist' | 'tech-director';

interface ChatbotProps {
  onClose?: () => void;
}

const PRESETS: Record<
  ChatRolePreset,
  { name: string; icon: React.ReactNode; model: string; systemInstruction: string; hint: string }
> = {
  'creative-producer': {
    name: 'Aura (Creative Producer)',
    icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
    model: 'gemini-3.5-flash',
    hint: 'General inquiries, production timelines, rates & portfolio walkthrough',
    systemInstruction: `You are "Aura", the executive creative producer for Armando Bianson's creative studio.
Armando specializes in high-conversion UGC video ads, TikTok & Instagram Reels creative direction, and cinematic AI-generated visuals.
Answer questions about his services, past projects, turnaround times (3-5 days standard), client onboarding, and collaboration models with brands and agencies.
Be polite, articulate, helpful, and encourage users to reach out through the Contact form for bookings.`,
  },
  'ugc-strategist': {
    name: 'Hook & Ad Strategist',
    icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
    model: 'gemini-3.1-flash-lite',
    hint: 'Ultra-fast viral hook ideas, script angles & conversion tips',
    systemInstruction: `You are a high-speed DTC & TikTok performance marketing strategist working alongside Armando Bianson.
Your focus is instant viral hook generation, 3-second retention tricks, direct-response UGC angles, and split-test strategies.
Provide concise, punchy, actionable hook concepts and test variations rapidly.`,
  },
  'tech-director': {
    name: 'AI Video Director (Deep Tech)',
    icon: <Brain className="w-3.5 h-3.5 text-purple-400" />,
    model: 'gemini-3.1-pro-preview',
    hint: 'Complex prompts, workflow architecture, Veo/Runway camera motion',
    systemInstruction: `You are an elite AI Cinematography and Generative Video Director collaborating with Armando Bianson.
You handle complex visual prompts, camera tracking specs (pan, crane, tilt, zoom), generative rendering pipelines (Veo, Runway Gen-3, Midjourney to video, ElevenLabs audio synthesis), and production-grade color grading pipelines.
Offer deep, technical, step-by-step guidance on complex generative visual tasks.`,
  },
};

export const GeminiChatbot: React.FC<ChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<ChatRolePreset>('creative-producer');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi there! I am Aura, Armando Bianson’s creative studio assistant. How can I help you today? Ask me about UGC video packages, Veo AI direction, commercial rates, or creative strategy.',
      timestamp: new Date(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const activePreset = PRESETS[preset];
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          model: activePreset.model,
          systemInstruction: activePreset.systemInstruction,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get a response.');
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        modelUsed: data.model || activePreset.model,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message || 'Something went wrong. Please check connection or try again.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. Currently chatting with ${PRESETS[preset].name}. How can I assist you?`,
        timestamp: new Date(),
        modelUsed: PRESETS[preset].model,
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-neutral-700/40 dark:border-neutral-200"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-400 dark:text-blue-600 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          </div>
          <span className="text-xs font-semibold tracking-wide">Ask Studio AI</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Gemini Multi-turn Chatbot"
          className={`fixed z-50 flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'bottom-4 right-4 left-4 md:left-auto md:w-[600px] h-[85vh]'
              : 'bottom-6 right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-neutral-50 dark:bg-neutral-850 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/10 dark:bg-blue-400/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Studio AI Chatbot
                  </h3>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Gemini 3
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[220px]">
                  {PRESETS[preset].hint}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear conversation"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore size' : 'Expand window'}
                className="hidden sm:block p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Persona / Role Selector Chips */}
          <div className="px-3 py-2 bg-neutral-100/70 dark:bg-neutral-800/40 border-b border-neutral-200/60 dark:border-neutral-800/60 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {(Object.keys(PRESETS) as ChatRolePreset[]).map((key) => {
              const active = preset === key;
              const p = PRESETS[key];
              return (
                <button
                  key={key}
                  onClick={() => setPreset(key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium shadow-xs'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-700/60'
                  }`}
                >
                  {p.icon}
                  <span>{key === 'creative-producer' ? 'Creative Producer' : key === 'ugc-strategist' ? 'Fast UGC Hooks' : 'Deep AI Video'}</span>
                </button>
              );
            })}
          </div>

          {/* Active Model Indicator Bar */}
          <div className="px-4 py-1.5 bg-neutral-50/50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              Engine: <strong className="font-mono text-neutral-600 dark:text-neutral-300">{PRESETS[preset].model}</strong>
            </span>
            <span>Multi-turn memory enabled</span>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 rounded-tl-none border border-neutral-200/60 dark:border-neutral-700/50 shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    <div
                      className={`mt-1.5 flex items-center justify-between gap-2 text-[9px] ${
                        isUser ? 'text-blue-100' : 'text-neutral-400 dark:text-neutral-500'
                      }`}
                    >
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {msg.modelUsed && !isUser && (
                        <span className="font-mono font-medium">{msg.modelUsed}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing / Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs text-neutral-700 dark:text-neutral-300">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-neutral-400 ml-1.5 font-mono">
                    Generating with {PRESETS[preset].model}...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              'What UGC packages do you offer?',
              '3 TikTok hook ideas for beauty DTC',
              'What AI video tools do you use?',
            ].map((promptText, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputValue(promptText);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="text-[10px] px-2.5 py-1 rounded-full bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white whitespace-nowrap cursor-pointer transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-neutral-850 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask ${PRESETS[preset].name.split(' ')[0]}...`}
              disabled={isLoading}
              className="flex-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-neutral-400 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>
      )}
    </>
  );
};
