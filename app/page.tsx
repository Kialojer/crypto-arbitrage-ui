"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { BrazilFlag } from "@/components/BrazilFlag";
import { Code2, Globe, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  const agentCode = `
# LangGraph Crypto Arbitrage Engine
builder = StateGraph(AgentState)
builder.add_node("Guardrail", guardrail_node)
builder.add_node("Agent", reasoning_agent_node)
builder.add_node("tools", tool_node)

builder.add_edge(START, "Guardrail")
builder.add_conditional_edges("Guardrail", route_after_guardrail)
builder.add_conditional_edges("Agent", route_after_agent)
builder.add_edge("tools", "Agent")
  `;

  return (
    <div className="min-h-screen bg-[#1c1d1f] text-white selection:bg-[#a435f0] selection:text-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center border-b border-[#3e4143]/50">
        <div className="flex items-center space-x-3">
          <BrazilFlag />
          <span className="text-xl font-bold tracking-tight ml-2">ArbitrageBR</span>
        </div>
        <div className="flex items-center space-x-6">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[#d1d7dc] hover:text-white font-medium transition-colors mr-4">
                Log In
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="bg-[#a435f0] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#8710d8] transition-all shadow-lg shadow-[#a435f0]/20">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="bg-[#a435f0] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#8710d8] transition-all shadow-lg shadow-[#a435f0]/20">
              Launch Terminal
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text */}
        <div className="space-y-8">
          <div className="inline-flex items-center space-x-2 bg-[#2d2f31] border border-[#3e4143] text-[#a435f0] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Zap size={14} className="fill-[#a435f0]" />
            <span>AI Powered Arbitrage</span>
          </div>
          <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tight">
            Master the Market with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a435f0] to-[#e589ff]">
              Machine Precision.
            </span>
          </h1>
          <p className="text-lg text-[#d1d7dc] max-w-lg leading-relaxed">
           An intelligent engine based on LangGraph that monitors reputable Brazilian exchanges in real time and identifies the best buying opportunities with complete security.
          </p>
          <div className="flex space-x-6 pt-4">
            <div className="flex items-center space-x-2 text-sm text-[#d1d7dc]">
              <ShieldCheck className="text-[#a435f0]" size={22} />
              <span className="font-medium">Guardrail Protected</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[#d1d7dc]">
              <Globe className="text-[#a435f0]" size={22} />
              <span className="font-medium">5 Brazil Exchanges</span>
            </div>
          </div>
        </div>

        {/* Right Side: Glass Terminal */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#a435f0] to-[#5b21b6] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-[#2d2f31] rounded-xl shadow-2xl overflow-hidden border border-[#3e4143]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1c1d1f] border-b border-[#3e4143]">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-[11px] text-[#d1d7dc] font-mono uppercase tracking-widest flex items-center">
                <Code2 size={12} className="mr-2 text-[#a435f0]" /> agent.py
              </div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              <pre className="text-[#e589ff]">
                <code>{agentCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}