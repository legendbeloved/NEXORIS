import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  MessageSquare, 
  CreditCard, 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Download, 
  Send,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
  ExternalLink,
  Home,
  Calendar,
  Layers,
  FileText,
  FileCheck,
  Bot
} from 'lucide-react';

// --- Interfaces ---
interface Prospect {
  id: number;
  name: string;
  category: string;
  website: string;
  email: string;
  phone: string;
  status: string;
  gap_analysis: string;
  pain_points: string; // JSON string
  token: string;
  mockup_preview?: string;
  project_id?: number;
}

interface Message {
  id: number;
  sender: 'agent' | 'client';
  content: string;
  created_at: string;
}

interface ClientPortalProps {
  token: string;
}

// --- Components ---

const ProjectRoadmap = ({ status }: { status: string }) => {
  const steps = [
    { id: 'initialization', label: 'Initialization', description: 'Setting up project environment and access.' },
    { id: 'strategy', label: 'Strategy & Planning', description: 'Defining roadmap and key milestones.' },
    { id: 'design', label: 'Design & Prototyping', description: 'Creating visual assets and user flows.' },
    { id: 'implementation', label: 'Implementation', description: 'Development and integration phase.' },
    { id: 'review', label: 'Review & QA', description: 'Testing and client feedback loop.' },
    { id: 'delivery', label: 'Final Delivery', description: 'Handover of all assets and documentation.' }
  ];

  // Mock progress based on status - in a real app this would come from the project record
  const currentStepIndex = 
    status === 'delivered' ? 5 : 
    status === 'review' ? 4 :
    status === 'implementation' ? 3 : 
    status === 'design' ? 2 :
    status === 'strategy' ? 1 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-bold text-white italic">Project Roadmap</h3>
        <span className="text-xs font-mono text-brand-secondary font-bold tracking-widest">
          PHASE {currentStepIndex + 1} OF {steps.length}
        </span>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-white/10" />

        <div className="space-y-8">
          {steps.map((step, i) => {
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            const isPending = i > currentStepIndex;

            return (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6"
              >
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 shrink-0 bg-brand-bg ${
                  isCompleted ? 'border-emerald-500 text-emerald-500' :
                  isCurrent ? 'border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(91,76,245,0.4)]' :
                  'border-white/10 text-zinc-600'
                }`}>
                  {isCompleted ? <CheckCircle2 size={20} /> : 
                   isCurrent ? <Activity size={20} className="animate-pulse" /> : 
                   <span className="font-mono text-xs font-bold">{i + 1}</span>}
                </div>
                
                <div className={`pt-2 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                  <h4 className={`text-lg font-bold mb-1 ${
                    isCompleted ? 'text-emerald-500' :
                    isCurrent ? 'text-brand-primary' :
                    'text-zinc-400'
                  }`}>
                    {step.label}
                  </h4>
                  <p className="text-sm text-zinc-500">{step.description}</p>
                  
                  {isCurrent && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-2 text-xs font-mono text-brand-secondary mb-2">
                        <Activity size={12} className="animate-spin" />
                        IN PROGRESS
                      </div>
                      <p className="text-xs text-zinc-300">
                        The team is currently working on this phase. Updates will be posted to your activity feed.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ClientConcierge = ({ messages, onSendMessage, isTyping }: { messages: Message[], onSendMessage: (content: string) => void, isTyping: boolean }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] glass rounded-[40px] border-white/10 overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Concierge AI</h3>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Always Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-emerald-500 font-bold uppercase">Active</span>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-sm">How can I help you with your project today?</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              msg.sender === 'client' 
                ? 'bg-brand-primary text-white rounded-br-sm' 
                : 'bg-white/10 text-zinc-200 rounded-bl-sm border border-white/5'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-[9px] opacity-50 block mt-1 text-right">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-2xl rounded-bl-sm border border-white/5 flex gap-1">
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100" />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about timeline, deliverables, or billing..."
          className="flex-grow bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-colors"
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          className="p-3 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

// --- Main Component ---

export const ClientPortal: React.FC<ClientPortalProps> = ({ token }) => {
  const [screen, setScreen] = useState<'welcome' | 'chat' | 'pay' | 'portal'>('welcome');
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchClientData();
  }, [token]);

  useEffect(() => {
    if (screen !== 'chat') return;
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, screen]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/client/auth/${token}`);
      if (!res.ok) throw new Error('Invalid or expired access token.');
      const data = await res.json();
      setProspect(data.prospect);
      setMessages(data.messages || []);
      
      if (data.prospect.status === 'paid' || data.prospect.status === 'delivered') {
        setScreen('portal');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    const tempMsg: Message = {
      id: Date.now(),
      sender: 'client',
      content: content,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setIsTyping(true);

    try {
      // Simulate AI response for Concierge
      setTimeout(() => {
        let responseText = "I've logged your request and notified the team.";
        
        if (content.toLowerCase().includes('timeline') || content.toLowerCase().includes('when')) {
          responseText = "Based on the current roadmap, we are on track for the 'Strategy' phase. Expect the next milestone review in 2 days.";
        } else if (content.toLowerCase().includes('invoice') || content.toLowerCase().includes('bill')) {
          responseText = "You can download your latest invoice from the 'Active Mission Dashboard' top right corner.";
        } else if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
          responseText = "Hello! I'm your dedicated project concierge. How can I assist you today?";
        }

        const aiMsg: Message = {
          id: Date.now() + 1,
          sender: 'agent',
          content: responseText,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1500);

      // In real app: call API
      /*
      await fetch('/api/client/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, content }),
      });
      */
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const handleChatSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content) return;
    setNewMessage('');
    await handleSendMessage(content);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/client/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, serviceType: 'Digital Transformation Package' }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateContract = () => {
    setGeneratingPdf(true);
    // Simulate PDF generation delay
    setTimeout(() => {
      setGeneratingPdf(false);
      alert("Contract PDF generated and downloaded!");
    }, 2000);
  };

  if (loading && !prospect) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-mono text-sm">SECURELY CONNECTING TO NEXORIS NODE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-red-500 mb-6 opacity-20" />
        <h1 className="text-2xl font-display font-bold text-white mb-2 italic">Access Terminated</h1>
        <p className="text-zinc-500 max-w-md">{error}</p>
        <button onClick={() => window.location.href = '/'} className="mt-8 flex items-center gap-2 text-brand-primary font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Return to Base
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-brand-bg text-zinc-300' : 'bg-zinc-50 text-zinc-800'}`}>
      {/* Header */}
      <header className={`h-20 border-b sticky top-0 z-50 backdrop-blur-xl flex items-center justify-between px-6 md:px-12 ${isDarkMode ? 'border-white/5 bg-brand-bg/80' : 'border-black/5 bg-white/80'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(91,76,245,0.3)]">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold tracking-tighter uppercase italic text-white">Nexoris</h1>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Client Command Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-xl border transition-all ${isDarkMode ? 'border-white/10 text-zinc-400 hover:text-white' : 'border-black/10 text-zinc-500 hover:text-black'}`}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'border-white/10 bg-white/5 text-emerald-500' : 'border-black/10 bg-black/5 text-emerald-600'}`}>
            <ShieldCheck size={14} />
            Secure Session
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0.9 }}

                  animate={{ scale: 1 }}
                  className="inline-block px-4 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4"
                >
                  Project Proposal Prepared
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tighter italic">
                  Hello, {prospect?.name}
                </h2>
                <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
                  Our AI agents have analyzed your digital presence at <span className="text-brand-secondary font-mono">{prospect?.website}</span> and identified critical growth opportunities.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Proposal Section */}
                <div className="glass p-8 rounded-[40px] border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white italic">Strategic Gap Analysis</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-sm leading-relaxed text-zinc-300">
                        {prospect?.gap_analysis}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Primary Pain Points Addressed</h4>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          try {
                            const pains = JSON.parse(prospect?.pain_points || '[]');
                            return pains.map((p: string) => (
                              <span key={p} className="px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold uppercase">
                                {p}
                              </span>
                            ));
                          } catch { return null; }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mockup Preview Section */}
                <div className="glass p-8 rounded-[40px] border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                      <Layers size={24} />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white italic">Custom Mockup Preview</h3>
                  </div>
                  
                  <div className="aspect-video rounded-3xl bg-zinc-900 border border-white/5 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <Zap size={48} className="text-white mb-4 relative z-10" />
                    <p className="text-sm font-bold text-white relative z-10 uppercase tracking-widest mb-2">Prepared Concept</p>
                    <p className="text-xs text-zinc-400 relative z-10 italic">
                      {prospect?.mockup_preview || "A performance-optimized digital transformation concept tailored for your brand."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button onClick={() => setScreen('chat')} className="w-full py-4 rounded-2xl bg-brand-primary text-white font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20">
                      Discuss Details with Agent 3
                      <ChevronRight size={16} />
                    </button>
                    <button onClick={() => setScreen('pay')} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                      Proceed to Secure Checkout
                      <CreditCard size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[70vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setScreen('welcome')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                  <ArrowLeft size={16} /> Back to Proposal
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Agent 3 Online</span>
                </div>
              </div>

              <div className="flex-grow glass rounded-[40px] border-white/10 flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 md:p-6 rounded-3xl ${
                        msg.sender === 'client' 
                          ? 'bg-brand-primary text-white rounded-br-none' 
                          : 'bg-white/5 border border-white/10 text-zinc-300 rounded-bl-none'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <span className="text-[9px] opacity-50 font-mono mt-2 block">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-1">
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-white/5 bg-black/20">
                  <div className="flex items-center gap-4 mb-4">
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-bold uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                      <Calendar size={14} />
                      Book a Strategy Call
                    </button>
                    <button onClick={() => setScreen('pay')} className="px-4 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-[10px] text-brand-primary font-bold uppercase tracking-widest hover:bg-brand-primary/20 transition-all flex items-center gap-2">
                      <CreditCard size={14} />
                      I'm ready to pay
                    </button>
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex gap-4">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message to Agent 3..."
                      className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary/50 text-white"
                    />
                    <button type="submit" className="p-4 bg-brand-primary text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20">
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {screen === 'pay' && (
            <motion.div
              key="pay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-8 py-12"
            >
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard size={40} />
                </div>
                <h2 className="text-3xl font-display font-bold text-white italic">Secure Checkout</h2>
                <p className="text-zinc-500">Review your order details below and complete the payment to start the project.</p>
              </div>

              <div className="glass p-8 rounded-[40px] border-white/10 space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <span className="text-zinc-500 text-sm">Package</span>
                  <span className="text-white font-bold">Digital Transformation</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/5">
                  <span className="text-zinc-500 text-sm">Amount</span>
                  <span className="text-white font-bold">$1,200.00</span>
                </div>
                <div className="flex items-center justify-between py-4">
                  <span className="text-zinc-500 text-sm">Status</span>
                  <span className="px-2 py-1 rounded bg-brand-accent/10 text-brand-accent text-[10px] font-bold uppercase tracking-widest">Awaiting Payment</span>
                </div>

                <button onClick={handlePayment} className="w-full py-4 rounded-2xl bg-brand-primary text-white font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 mt-8">
                  Pay with Stripe
                  <ExternalLink size={16} />
                </button>
                <button onClick={() => setScreen('chat')} className="w-full text-center text-[10px] text-zinc-500 uppercase font-bold tracking-widest hover:text-white transition-colors">
                  Need to negotiate? Talk to Agent 3
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-display font-bold text-white italic tracking-tight">Active Mission Dashboard</h2>
                  <p className="text-zinc-500 mt-1">Project: Digital Transformation for {prospect?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <Download size={14} />
                    Download Invoice
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Dashboard - Left Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Roadmap Section */}
                  <div className="glass p-8 rounded-[40px] border-white/10">
                    <ProjectRoadmap status={prospect?.status || 'strategy'} />
                  </div>

                  {/* Documents & Contracts */}
                  <div className="glass p-8 rounded-[40px] border-white/10 space-y-6">
                    <h3 className="text-xl font-display font-bold text-white italic">Mission Assets</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center">
                            <FileCheck size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Service Agreement</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Signed</p>
                          </div>
                        </div>
                        <button 
                          onClick={generateContract}
                          disabled={generatingPdf}
                          className="w-full py-2 rounded-lg bg-black/20 text-xs font-bold text-zinc-400 group-hover:text-white group-hover:bg-black/40 transition-all flex items-center justify-center gap-2"
                        >
                          {generatingPdf ? <Activity size={12} className="animate-spin" /> : <Download size={12} />}
                          {generatingPdf ? 'Generating...' : 'Download PDF'}
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center">
                            <Layers size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Project Brief</p>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">V1.2 Final</p>
                          </div>
                        </div>
                        <button className="w-full py-2 rounded-lg bg-black/20 text-xs font-bold text-zinc-400 group-hover:text-white group-hover:bg-black/40 transition-all flex items-center justify-center gap-2">
                          <ExternalLink size={12} />
                          View Asset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-8">
                  {/* Concierge Chat */}
                  <ClientConcierge 
                    messages={messages} 
                    onSendMessage={handleSendMessage}
                    isTyping={isTyping}
                  />

                  {/* Quick Actions */}
                  <div className="glass p-6 rounded-[32px] border-white/10 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest ml-2">Quick Actions</h3>
                    <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">Schedule Review</span>
                        <Calendar size={16} className="text-zinc-500 group-hover:text-brand-primary transition-colors" />
                      </div>
                      <p className="text-xs text-zinc-500">Book a slot with the team</p>
                    </button>
                    <button className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">Upload Assets</span>
                        <Download size={16} className="text-zinc-500 group-hover:text-brand-primary transition-colors rotate-180" />
                      </div>
                      <p className="text-xs text-zinc-500">Share files securely</p>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-12 text-center">
        <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck size={14} />
          Encrypted Mission Control Node
        </div>
      </footer>

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-secondary/5 blur-[120px]" />
      </div>
    </div>
  );
};
