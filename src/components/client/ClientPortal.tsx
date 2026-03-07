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
  Home
} from 'lucide-react';

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

export const ClientPortal: React.FC<ClientPortalProps> = ({ token }) => {
  const [screen, setScreen] = useState<'welcome' | 'chat' | 'pay' | 'portal'>('welcome');
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClientData();
  }, [token]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/client/auth/${token}`);
      if (!res.ok) throw new Error('Invalid or expired access token.');
      const data = await res.json();
      setProspect(data.prospect);
      setMessages(data.messages);
      
      // If already paid, show portal
      if (data.prospect.status === 'paid' || data.prospect.status === 'delivered') {
        setScreen('portal');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgContent = newMessage;
    setNewMessage('');
    
    // Optimistic update
    const tempMsg: Message = {
      id: Date.now(),
      sender: 'client',
      content: msgContent,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setIsTyping(true);

    try {
      await fetch('/api/client/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, content: msgContent })
      });
      
      // Poll for response after a delay
      setTimeout(async () => {
        const res = await fetch(`/api/client/auth/${token}`);
        const data = await res.json();
        setMessages(data.messages);
        setIsTyping(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const handlePay = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/client/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Simulate redirect and success
        setTimeout(() => {
          setScreen('portal');
          setLoading(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading && !prospect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">Securing your session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
        <div className="max-w-md w-full glass p-8 text-center space-y-6 border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertCircle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-zinc-900">Access Denied</h2>
            <p className="text-zinc-500">{error}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
          >
            Return Home
          </button>
          <p className="text-xs text-zinc-400">
            Need help? <a href="mailto:support@nexoris.ai" className="text-brand-primary underline">Contact Support</a>
          </p>
        </div>
      </div>
    );
  }

  const painPoints = prospect?.pain_points ? JSON.parse(prospect.pain_points) : [];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#0F1020] text-zinc-100' : 'bg-[#F8FAFC] text-zinc-900'}`}>
      {/* Header */}
      <header className={`h-16 border-b sticky top-0 z-50 backdrop-blur-xl px-6 flex items-center justify-between ${isDarkMode ? 'bg-[#0F1020]/80 border-white/5' : 'bg-white/80 border-zinc-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <span className="font-display font-bold tracking-tighter uppercase italic text-lg">Nexoris</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'}`}
            title="Return Home"
          >
            <Home size={18} />
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-white/5 text-zinc-400 hover:text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {screen !== 'welcome' && (
            <button 
              onClick={() => setScreen('welcome')}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
            >
              Proposal
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 pb-24">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-2">
                <h1 className="text-4xl font-display font-bold tracking-tight">Hello, {prospect?.name} 👋</h1>
                <p className={`text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Here's what we've prepared specifically for your business.</p>
              </div>

              {/* Problem Analysis */}
              <section className="space-y-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <Activity size={20} className="text-brand-primary" />
                  Digital Gap Analysis
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {painPoints.map((point: string, i: number) => (
                    <div key={i} className={`p-6 rounded-3xl border transition-all ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-4">
                        <AlertCircle size={20} />
                      </div>
                      <h3 className="font-bold mb-2">We noticed: {point}</h3>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        This inefficiency could be costing you approximately <span className="text-brand-accent font-bold">15-20%</span> of potential monthly customers.
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mockup Preview */}
              <section className="space-y-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <ExternalLink size={20} className="text-brand-secondary" />
                  Proposed Solution Mockup
                </h2>
                <div className={`aspect-video rounded-3xl border overflow-hidden relative group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200 shadow-xl'}`}>
                  <img 
                    src={`https://picsum.photos/seed/${prospect?.name}/1200/800`} 
                    alt="Mockup" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                      <p className="text-sm font-bold uppercase tracking-widest mb-1">Visual Concept</p>
                      <p className="text-2xl font-display font-bold italic">Modernized Digital Presence</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Services & Pricing */}
              <section className="space-y-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <Zap size={20} className="text-brand-accent" />
                  Service Package
                </h2>
                <div className={`p-8 rounded-3xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-grow space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle2 size={14} />
                        </div>
                        <div>
                          <p className="font-bold">Automated Booking System</p>
                          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Convert visitors into appointments 24/7 without lifting a finger.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle2 size={14} />
                        </div>
                        <div>
                          <p className="font-bold">Performance Optimization</p>
                          <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Ultra-fast mobile experience to reduce bounce rates and improve SEO.</p>
                        </div>
                      </div>
                    </div>
                    <div className={`md:w-64 p-6 rounded-2xl text-center flex flex-col justify-center ${isDarkMode ? 'bg-white/5' : 'bg-zinc-50'}`}>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Investment</p>
                      <p className="text-4xl font-display font-extrabold text-brand-primary tracking-tighter">$1,200</p>
                      <p className="text-[10px] text-zinc-400 mt-2 italic">One-time setup fee</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setScreen('chat')}
                  className="py-4 px-6 rounded-2xl bg-brand-primary text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20"
                >
                  <MessageSquare size={18} />
                  I'm Interested
                </button>
                <button 
                  onClick={() => {
                    setScreen('chat');
                    setNewMessage("I'd like to book a call to discuss the proposal.");
                  }}
                  className={`py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm'}`}
                >
                  <Clock size={18} />
                  Book a Call
                </button>
                <button 
                  onClick={() => setScreen('pay')}
                  className="py-4 px-6 rounded-2xl bg-zinc-900 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl"
                >
                  <CreditCard size={18} />
                  Pay Now
                </button>
              </div>
            </motion.div>
          )}

          {screen === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[70vh] glass rounded-3xl overflow-hidden border-white/10"
            >
              {/* Chat Header */}
              <div className={`p-4 border-b flex items-center gap-3 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                <button onClick={() => setScreen('welcome')} className="p-2 hover:bg-black/5 rounded-lg transition-colors">
                  <ArrowLeft size={18} />
                </button>
                <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-sm">Agent 3</p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Always Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'client' 
                        ? 'bg-brand-primary text-white rounded-tr-none' 
                        : isDarkMode ? 'bg-white/10 text-zinc-100 rounded-tl-none' : 'bg-zinc-100 text-zinc-900 rounded-tl-none'
                    }`}>
                      {msg.content}
                      <p className={`text-[8px] mt-1 opacity-50 ${msg.sender === 'client' ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className={`p-4 rounded-2xl rounded-tl-none flex gap-1 ${isDarkMode ? 'bg-white/10' : 'bg-zinc-100'}`}>
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className={`p-4 border-t ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="relative">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={`w-full py-3 pl-4 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all ${
                      isDarkMode ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-zinc-200 text-zinc-900'
                    }`}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-lg hover:scale-105 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {screen === 'pay' && (
            <motion.div
              key="pay"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold">Complete Your Order</h2>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Secure payment via Stripe</p>
              </div>

              <div className={`p-8 rounded-3xl border space-y-6 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/5">
                    <span className="text-sm font-medium">Digital Transformation Package</span>
                    <span className="font-bold">$1,200.00</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Full Website Audit & Optimization
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Automated Booking Integration
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      30-Day Support Guarantee
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-center gap-4 py-2 px-4 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                    <ShieldCheck size={16} />
                    Secured by Stripe
                  </div>
                  <button 
                    onClick={handlePay}
                    className="w-full py-4 bg-brand-primary text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                  >
                    Pay $1,200.00
                  </button>
                  <button 
                    onClick={() => setScreen('chat')}
                    className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
                  >
                    Schedule a call first
                  </button>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  By paying, you agree to our Terms of Service. All projects are covered by our 30-day satisfaction guarantee. You will receive an onboarding email immediately after payment.
                </p>
              </div>
            </motion.div>
          )}

          {screen === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-display font-bold tracking-tight">Your project is underway 🚀</h1>
                <p className={`text-lg ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>We're working hard to transform your digital presence.</p>
              </div>

              {/* Progress Timeline */}
              <section className="space-y-8">
                <div className="relative pt-12">
                  <div className={`absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 ${isDarkMode ? 'bg-white/5' : 'bg-zinc-100'}`} />
                  <div className="relative flex justify-between">
                    {[
                      { label: 'Paid', status: 'completed' },
                      { label: 'In Progress', status: 'active' },
                      { label: 'Review', status: 'pending' },
                      { label: 'Delivered', status: 'pending' },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                          step.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' :
                          step.status === 'active' ? 'bg-brand-primary border-brand-primary text-white animate-pulse' :
                          isDarkMode ? 'bg-[#0F1020] border-white/10 text-zinc-700' : 'bg-white border-zinc-200 text-zinc-300'
                        }`}>
                          {step.status === 'completed' ? <CheckCircle2 size={20} /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          step.status === 'active' ? 'text-brand-primary' : 'text-zinc-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border flex items-center justify-between ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-zinc-200 shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Estimated Delivery</p>
                      <p className="text-xl font-display font-bold">March 12, 2026</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setScreen('chat')}
                    className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:scale-105 transition-all"
                  >
                    Message Agent 3
                  </button>
                </div>
              </section>

              {/* Project Files */}
              <section className="space-y-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <Download size={20} className="text-brand-primary" />
                  Project Files
                </h2>
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl border flex items-center justify-between group ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-zinc-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-500 flex items-center justify-center">
                        <Download size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Payment Receipt</p>
                        <p className="text-[10px] text-zinc-500">PDF • 124 KB</p>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-brand-primary transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                  <div className={`p-4 rounded-2xl border flex items-center justify-between opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-zinc-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-500 flex items-center justify-center">
                        <Zap size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Final Deliverables</p>
                        <p className="text-[10px] text-zinc-500">Available upon completion</p>
                      </div>
                    </div>
                    <Clock size={18} className="text-zinc-400 mr-2" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Nav Overlay (for Chat) */}
      {screen === 'chat' && (
        <div className="fixed bottom-0 left-0 w-full p-4 md:hidden pointer-events-none">
          {/* Floating elements if needed */}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#27272a' : '#e2e8f0'};
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
