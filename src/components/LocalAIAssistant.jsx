import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Loader2, Cpu, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateLocalAiResponse } from '../utils/localAiEngine';
import { soundFX } from '../utils/sound';

export function LocalAIAssistant({ profile = {}, categories = [], totalHours = 0 }) {
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null); // { progress: 0..100, file: string, status: string }
  const [isDownloading, setIsDownloading] = useState(false);
  const [engineError, setEngineError] = useState(null);
  const [engineReady, setEngineReady] = useState(false);
  const chatBottomRef = useRef(null);

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('sudarshan_local_ai_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading local AI chat history:', e);
    }
    return [
      {
        id: 'msg-init',
        sender: 'AI',
        text: 'Greetings, Scholar! I am your Sudarshan Local Neural AI Engine running 100% in your browser. No external servers or API keys required. How can I assist your study session today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const saveChatMessages = (msgs) => {
    setChatMessages(msgs);
    try {
      localStorage.setItem('sudarshan_local_ai_history', JSON.stringify(msgs));
    } catch (e) {
      console.error('Error saving local AI chat history:', e);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating, downloadProgress]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    setChatInput('');
    soundFX.playClick();

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'USER',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...chatMessages, userMsg];
    saveChatMessages(updatedMsgs);
    setIsGenerating(true);
    setEngineError(null);

    try {
      const aiResponse = await generateLocalAiResponse(userText, (progressData) => {
        if (progressData.status === 'progress' || progressData.status === 'download') {
          setIsDownloading(true);
          const pct = Math.round(progressData.progress || 0);
          setDownloadProgress({
            file: progressData.file || 'Neural Weights',
            progress: pct,
            status: progressData.status
          });
        } else if (progressData.status === 'ready' || progressData.status === 'done') {
          setIsDownloading(false);
          setDownloadProgress(null);
          setEngineReady(true);
        }
      });

      setIsDownloading(false);
      setDownloadProgress(null);
      setEngineReady(true);
      soundFX.playSuccess();

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'AI',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatMessages([...updatedMsgs, aiMsg]);
    } catch (err) {
      console.error('Local Neural Engine Error:', err);
      setIsDownloading(false);
      setDownloadProgress(null);
      setEngineError('LOCAL NEURAL ENGINE UNSUPPORTED ON THIS BROWSER — Proceeding in standard HUD mode.');
      soundFX.playClick();

      // Standard fallback response
      const fallbackMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'AI',
        text: `[FALLBACK TELEMETRY RESPONSE]\nRegarding "${userText}": Local AI model execution failed on this device or memory threshold was reached. Your active subjects (${categories.join(', ') || 'General'}) and logged study hours (${totalHours.toFixed(1)} hrs) remain fully synced locally.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveChatMessages([...updatedMsgs, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="hud-glass p-6 rounded-xl border border-cyan-500/30 font-mono-tech flex flex-col justify-between hud-bracket relative overflow-hidden">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-500/20 pb-3 mb-4 text-xs gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="font-orbitron font-bold text-slate-100 text-sm tracking-wider">
              SUDARSHAN CYBER-TUTOR // LOCAL NEURAL ENGINE
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              [100% IN-BROWSER / NO API KEY]
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Transformers.js (WASM)
            </span>
          </div>
        </div>

        {/* Engine Fallback Unsupported Alert */}
        {engineError && (
          <div className="mb-4 bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-lg text-center backdrop-blur-md flex flex-col sm:flex-row items-center justify-center gap-2 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="font-orbitron font-bold text-xs tracking-wide">
              {engineError}
            </span>
          </div>
        )}

        {/* Downloading Model Progress Bar HUD */}
        {isDownloading && downloadProgress && (
          <div className="mb-4 bg-slate-950/90 border border-cyan-500/50 p-4 rounded-xl shadow-[0_0_25px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between text-xs font-orbitron font-bold text-cyan-300 mb-2">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                INITIALIZING LOCAL NEURAL ENGINE... (Downloading Model to Browser Cache)
              </span>
              <span>{downloadProgress.progress}%</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-cyan-500/30 mb-2">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="truncate max-w-[250px]">File: {downloadProgress.file}</span>
              <span className="text-emerald-400 font-bold">100% Client-Side Neural Weights</span>
            </div>
          </div>
        )}

        {/* Model Ready Notification */}
        {engineReady && !isDownloading && (
          <div className="mb-3 px-3 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>LOCAL AI MODEL CACHED &amp; OPERATIONAL — Instant Offline Synthesis Active</span>
            </div>
            <span className="font-bold text-[10px] text-emerald-400">0ms API Latency</span>
          </div>
        )}

        {/* Scrollable Chat Window */}
        <div className="bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 h-72 overflow-y-auto space-y-3.5 text-xs text-slate-200">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'AI' && (
                <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3 border ${
                  msg.sender === 'USER'
                    ? 'bg-purple-950/40 border-purple-500/40 text-purple-100 rounded-tr-none'
                    : 'bg-slate-900/90 border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-slate-400 border-b border-slate-800/60 pb-1">
                  <span>{msg.sender === 'USER' ? (profile.userName || 'SCHOLAR') : 'SUDARSHAN LOCAL AI ENGINE'}</span>
                  <span className="text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed text-xs">{msg.text}</p>
              </div>

              {msg.sender === 'USER' && (
                <div className="w-7 h-7 rounded bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isGenerating && !isDownloading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono-tech p-2 bg-slate-900/40 rounded border border-cyan-500/20">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>RUNNING IN-BROWSER LOCAL NEURAL SYNTHESIS...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask any study doubt or question (Processed 100% locally in browser)..."
          className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-3.5 py-2.5 rounded-lg text-xs placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono-tech"
        />
        <button
          type="submit"
          disabled={isGenerating || !chatInput.trim()}
          className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 border border-cyan-400"
        >
          <span>GENERATE LOCAL AI</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
