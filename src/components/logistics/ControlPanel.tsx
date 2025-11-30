"use client";

import { useState } from "react";
import { Loader2, Zap, RotateCcw, BrainCircuit } from "lucide-react"; 

export default function ControlPanel() {
  const [loading, setLoading] = useState(false);

  const handleAction = async (endpoint: string) => {
    setLoading(true);
    try {
      await fetch(endpoint, { method: 'POST' });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur border border-slate-200 shadow-lg rounded-xl p-4 w-full">
       <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">AI Dispatcher</h3>
            <p className="text-[10px] text-slate-500">Google Gemini 2.0 Flash</p>
          </div>
       </div>

       <div className="space-y-2">
          <button
              onClick={() => handleAction('/api/logistics/assign')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-70"
          >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} className="text-yellow-400" />}
              Auto-Assign Routes
          </button>

          <button
              onClick={() => handleAction('/api/logistics/reset')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
          >
              <RotateCcw size={14} />
              Reset Simulation
          </button>
       </div>
    </div>
  );
}