"use client";

import { useState, useRef } from "react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Search, Terminal, TrendingUp, AlertCircle, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { BrazilFlag } from "@/components/BrazilFlag"; 

interface PriceData {
  exchange: string;
  price?: number;
  symbol: string;
  error?: string;
}

export default function Dashboard() {
  const { getToken } = useAuth();
  const [symbol, setSymbol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agentLog, setAgentLog] = useState(""); 
  const [prices, setPrices] = useState<PriceData[]>([]); 
  
  // رفرنس برای اسکرول خودکار به نتایج
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setIsLoading(true);
    setAgentLog("");
    setPrices([]);
    
    let accumulatedText = "";

    try {
      const token = await getToken();
      if (!token) {
        setAgentLog("❌ Authentication Error: Please log in.");
        setIsLoading(false);
        return;
      }

      await fetchEventSource("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          question: `What is the price of ${symbol.toUpperCase()}?`, 
          thread_id: "dashboard-session" 
        }),
        async onmessage(ev) {
          if (ev.data === "[DONE]") {
            setIsLoading(false);
            extractAndSetPrices(accumulatedText);
            return;
          }
          try {
            const parsed = JSON.parse(ev.data);
            accumulatedText += parsed.text;
            
            // نمایش لاگ‌ها تا قبل از رسیدن به بخش JSON
            if (!accumulatedText.includes("```json")) {
               setAgentLog(accumulatedText);
            }
          } catch (e) {
            console.error("Error parsing stream chunk", e);
          }
        },
        onerror(err) {
          console.error("SSE Error:", err);
          setIsLoading(false);
          throw err; 
        }
      });
    } catch (error) {
      setAgentLog("❌ Connection lost. Please check if the backend server is running.");
      setIsLoading(false);
    }
  };

  const extractAndSetPrices = (fullText: string) => {
    const jsonMatch = fullText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const extractedData = JSON.parse(jsonMatch[1]);
        setPrices(extractedData);
        
        // 🚀 اسکرول نرم به سمت نتایج بلافاصله بعد از رندر شدن
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
      } catch (e) {
        console.error("Failed to parse extracted JSON", e);
      }
    }
  };

  const minPrice = prices.length > 0 
    ? Math.min(...prices.filter(p => p.price !== undefined).map(p => p.price as number))
    : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative">
      
      {/* 🇧🇷 پرچم برزیل شناور در کنار صفحه */}
      <div className="fixed right-0 top-1/4 bg-white shadow-xl border border-slate-200 p-3 rounded-l-2xl z-50 flex flex-col items-center gap-3 transition-all hover:pr-5 group cursor-default">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter" style={{ writingMode: 'vertical-rl' }}>BRAZIL</span>
          <div className="h-8 w-[2px] bg-gradient-to-b from-blue-600 to-transparent mb-1"></div>
        </div>
        <BrazilFlag />
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
               <TrendingUp className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">ArbitrageBR</h1>
              <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Agentic Terminal</span>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <div className="hidden md:flex items-center bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-bold">
               <ShieldCheck size={14} className="mr-1.5" /> SECURE NODE 01
            </div>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "border-2 border-white shadow-md" } }} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        
        {/* Search Bar Section */}
        <section className="relative">
          <div className="absolute -top-6 left-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Market Scanner</div>
          <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-xl shadow-slate-200/50">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Enter Crypto Symbol (e.g. BTC, SOL)..."
                  className="block w-full pl-16 pr-4 py-5 bg-transparent rounded-2xl text-slate-900 font-bold text-lg focus:outline-none uppercase placeholder:normal-case placeholder:text-slate-300 placeholder:font-medium transition-all"
                  disabled={isLoading}
                   suppressHydrationWarning={true}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !symbol.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black transition-all disabled:opacity-50 flex items-center justify-center shadow-lg shadow-blue-600/30 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center"><Zap className="animate-pulse mr-2 h-5 w-5 fill-white" /> SCANNING...</span>
                ) : "RUN ANALYSIS"}
              </button>
            </form>
          </div>
        </section>

        {/* Agent Terminal (Status Feed) */}
        {(agentLog || isLoading) && (
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center mb-6 text-blue-600 border-b border-slate-50 pb-4">
              <Terminal size={18} className="mr-3" />
              <span className="font-black tracking-widest uppercase text-[11px]">Neural Engine Logs</span>
              {isLoading && <div className="ml-auto flex space-x-1.5">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-300"></div>
              </div>}
            </div>
            <div className="text-slate-500 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {agentLog || "Awaiting instructions..."}
            </div>
          </section>
        )}

        {/* 🎯 Price Cards Section (Auto-Scroll Target) */}
        {prices.length > 0 && (
          <section ref={resultsRef} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 pt-6">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center">
                  <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Market Intelligence</h2>
               </div>
               <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-md uppercase tracking-widest">Live Feed</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {prices.map((item, idx) => {
                const isBestDeal = item.price === minPrice && item.price !== undefined;
                return (
                  <div 
                    key={idx} 
                    className={`relative bg-white rounded-3xl p-7 border-2 transition-all duration-500 group ${
                      isBestDeal 
                        ? "border-blue-600 shadow-2xl shadow-blue-600/10 scale-105 z-10" 
                        : "border-transparent shadow-md hover:border-slate-200"
                    }`}
                  >
                    {isBestDeal && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-2 px-5 rounded-full flex items-center shadow-xl ring-4 ring-[#F8FAFC]">
                        <CheckCircle2 size={14} className="mr-2" /> Best Opportunity
                      </div>
                    )}
                    
                    <div className="text-[10px] font-black text-slate-400 mb-4 uppercase tracking-[0.15em]">{item.exchange}</div>
                    
                    {item.error ? (
                      <div className="mt-2 text-rose-500 text-xs font-bold flex items-center bg-rose-50 p-3 rounded-xl border border-rose-100">
                        <AlertCircle size={14} className="mr-2 shrink-0" /> {item.error}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-bold mb-1">Price BRL</span>
                        <div className="flex items-baseline">
                          <span className={`text-3xl font-black tracking-tighter ${isBestDeal ? "text-blue-600" : "text-slate-900"}`}>
                            {item.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      
      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em]">Kiarash T.N • AI Systems Engineer</p>
      </footer>
    </div>
  );
}