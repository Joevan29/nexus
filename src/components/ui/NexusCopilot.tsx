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
    { role: 'ai', content: 'Halo Commander. Ada yang bisa saya bantu pantau hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "Saya sedang menganalisis data logistik...";
      
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('stok') || lowerMsg.includes('stock')) {
        response = "Berdasarkan data gudang, ada 3 item dengan status 'Low Stock'. Disarankan untuk restock SKU K-001 segera.";
      } else if (lowerMsg.includes('driver') || lowerMsg.includes('supir')) {
        response = "Saat ini ada 12 driver aktif. Budi Santoso baru saja menyelesaikan pengiriman di Jakarta Pusat.";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('halo')) {
        response = "Siap bertugas, Commander. Sistem berjalan optimal.";
      } else if (lowerMsg.includes('pending')) {
        response = "Ada 3 pesanan pending yang perlu di-assign. Apakah Anda ingin saya jalankan auto-assign sekarang?";
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1500);
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
            initial={{ opacity: 0, y: 20, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-8 z-[49] w-96 h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-sans origin-bottom-right"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center gap-4 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>
              
              <div className="p-2.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md shadow-inner relative z-10">
                <Bot size={24} className="text-blue-300" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-base tracking-tight">Nexus Copilot</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">AI Online</span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/80 scrollbar-hide" ref={scrollRef}>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.content}
                    <div className={`absolute bottom-0 w-3 h-3 ${
                       msg.role === 'user' 
                       ? '-right-1.5 bg-blue-600 [clip-path:polygon(0_0,0%_100%,100%_100%)]' 
                       : '-left-1.5 bg-white border-l border-b border-slate-200 [clip-path:polygon(100%_0,0%_100%,100%_100%)]'
                    }`}></div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1.5 shadow-sm items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanya status armada..."
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all placeholder:text-slate-400 font-medium"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-md"
                >
                  {isTyping ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}