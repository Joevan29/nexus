'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function NexusCopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Halo Commander. Saya terhubung dengan data gudang & armada. Ada yang bisa dibantu?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg }),
      });
      
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Gagal terhubung ke Neural Network." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-[50] p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white/20 backdrop-blur-md ${
          isOpen 
            ? 'bg-slate-800 text-white rotate-90 shadow-slate-900/50' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-600/40'
        }`}
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-8 z-[49] w-96 h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-sans origin-bottom-right"
          >
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/20 blur-xl"></div>
              <div className="relative z-10 p-2.5 bg-white/10 rounded-xl border border-white/10">
                <Bot size={24} className="text-blue-300" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-base">Nexus AI</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase">System Online</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya stok atau status armada..."
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {isTyping ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}