import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, MessageCircle, FileText, ChevronDown, ChevronRight, Video, Zap } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left group"
      >
        <span className="font-bold text-zinc-300 group-hover:text-white transition-colors">{question}</span>
        <div className={`p-1 rounded-full bg-white/5 text-zinc-500 transition-all ${isOpen ? 'rotate-180 bg-brand-primary/20 text-brand-primary' : ''}`}>
          <ChevronDown size={16} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-zinc-500 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HelpPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display font-bold text-white italic">How can we help?</h2>
        <div className="relative max-w-xl mx-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-brand-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search documentation, guides, and FAQs..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all shadow-lg shadow-black/20"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/10 hover:border-brand-primary/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Documentation</h3>
          <p className="text-sm text-zinc-500 mb-4">Detailed guides on configuring agents, setting up campaigns, and API references.</p>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            Read Docs <ChevronRight size={12} />
          </span>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/10 hover:border-brand-secondary/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Video size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Video Tutorials</h3>
          <p className="text-sm text-zinc-500 mb-4">Watch step-by-step walkthroughs of key platform features and workflows.</p>
          <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            Watch Now <ChevronRight size={12} />
          </span>
        </div>

        <div className="glass p-8 rounded-[32px] border-white/10 hover:border-emerald-500/30 transition-colors group cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Live Support</h3>
          <p className="text-sm text-zinc-500 mb-4">Chat with our support team for urgent issues or account assistance.</p>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
            Start Chat <ChevronRight size={12} />
          </span>
        </div>
      </div>

      <div className="glass p-8 md:p-12 rounded-[40px] border-white/10">
        <h3 className="text-2xl font-display font-bold text-white italic mb-8">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          <div className="space-y-2">
            <FAQItem question="How do I add a new agent?" answer="Go to the Agents page and click 'Deploy New Agent'. Select a template (Discovery, Outreach, etc.) and configure its parameters." />
            <FAQItem question="What is the daily email limit?" answer="This depends on your subscription tier. Starter plans include 500 emails/day, while Pro plans allow up to 2,500." />
            <FAQItem question="Can I export prospect data?" answer="Yes, you can export all prospect lists as CSV or JSON from the Prospects page." />
          </div>
          <div className="space-y-2">
            <FAQItem question="How does billing work?" answer="We bill monthly based on your active subscription. You can upgrade or downgrade at any time from the Subscription page." />
            <FAQItem question="Is my data secure?" answer="Absolutely. We use enterprise-grade encryption for all data at rest and in transit. Check our Security page for details." />
            <FAQItem question="Do you offer API access?" answer="API access is available on the Enterprise plan. Documentation can be found in the Developer Portal." />
          </div>
        </div>
      </div>
    </div>
  );
};
