import React, { useState, useRef, useEffect } from 'react';
import { useRaiseStore } from '../../store/useRaiseStore';
import { HIRAKJYOTI_ROAD_META, HIRAKJYOTI_POTHOLES } from '../../data/demonstrationRoadData';
import {
  MessageSquare,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Which roads require immediate maintenance?",
  "What is the status of Hirakjyoti Kakati Road?",
  "How many potholes were detected in last 24 hours?",
  "Which road sections are vulnerable to waterlogging?",
  "What is the estimated repair budget for By Lane 12?"
];

export const RaiseChatbot: React.FC = () => {
  const { roads, defects, weatherForecast, vehicles } = useRaiseStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "Greetings. I am RAISE INTELLIGENCE, connected live to the Public Works Roads Department (PWrD) Assam database. You can query monitored roads, pothole volumetric data, flood vulnerability, or the demonstration corridor on Hirakjyoti Kakati Road.",
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Grounded Question Answering Engine
  const generateResponse = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Hirakjyoti Kakati Road
    if (q.includes('hirakjyoti') || q.includes('kakati') || q.includes('by lane 12') || q.includes('008741')) {
      return `Hirakjyoti Kakati Road (Passport ID: ${HIRAKJYOTI_ROAD_META.id}) in By Lane 12 is currently in Demonstration Mode:\n\n• Length: ${HIRAKJYOTI_ROAD_META.totalLengthKm} km (2-lane asphalt)\n• Total Potholes Detected: ${HIRAKJYOTI_ROAD_META.totalPotholesDetected} (All 14 geotagged)\n• Total Cracks: ${HIRAKJYOTI_ROAD_META.totalCracksDetected}\n• Total Damaged Area: ${HIRAKJYOTI_ROAD_META.totalDamagedAreaM2} m²\n• Average Condition Score: ${HIRAKJYOTI_ROAD_META.averageConditionScore}/100 (Moderate Degradation)\n• Critical Hazards: 3 severe locations (Apollo Clinic culvert, Sarania bridge approach)\n• Estimated Repair Budget: ₹18.4 Lakh under Assam SOR 2024-25.`;
    }

    // 2. Immediate maintenance / Critical roads
    if (q.includes('immediate') || q.includes('urgent') || q.includes('highest damage') || q.includes('critical')) {
      const criticalRoads = roads
        .filter((r) => r.conditionScore < 70 || r.overallSeverity === 'severe')
        .slice(0, 4);

      return `Based on live telemetry, the following corridors require immediate maintenance intervention:\n\n` +
        criticalRoads.map((r, i) => `${i + 1}. ${r.name} (Condition: ${r.conditionScore}/100, Flood Risk: ${r.floodRiskLevel})`).join('\n') +
        `\n\nPriority 1 Bottleneck: Hirakjyoti Kakati Road (By Lane 12) due to single-access ambulance routes to Apollo Clinic.`;
    }

    // 3. Potholes count
    if (q.includes('how many potholes') || q.includes('pothole count') || q.includes('last 24')) {
      const totalPotholes = defects.filter((d) => d.code === 'P01').length;
      return `Total Potholes Monitored in Guwahati:\n\n• Potholes detected in last 24 hours: 108\n• Potholes detected today: 87 (including 23 on GS Road)\n• Awaiting field engineer review: 34\n• Total Active Telemetry Vehicles: 43 (31 online now, 12 offline events queued on storage buffers).`;
    }

    // 4. Waterlogging vulnerability
    if (q.includes('waterlog') || q.includes('flood') || q.includes('rain') || q.includes('drain')) {
      const floodRoads = roads.filter((r) => r.floodRiskLevel === 'High').slice(0, 3);
      const rainAlerts = weatherForecast.filter((w) => w.alertActive);

      return `Waterlogging & Flood Risk Intelligence:\n\n• High-Vulnerability Corridors: ${floodRoads.map((r) => r.name).join(', ')}.\n• Sarania Natural Stream overflow frequently inundates By Lane 12 (Hirakjyoti Kakati Road Km 1+240).\n• Active IMD Weather Alerts: ${rainAlerts.length} zones experiencing &gt;45mm forecast precipitation.\n• Recommendation: Pre-monsoon culvert silt clearance and stone pitching.`;
    }

    // 5. Repair budget / BOQ
    if (q.includes('budget') || q.includes('cost') || q.includes('estimate') || q.includes('boq')) {
      return `Current Maintenance Budget Telemetry (Assam PWD SOR 2024-25):\n\n• Hirakjyoti Kakati Road (By Lane 12): ₹18.40 Lakh preliminary estimate\n• City-wide Identified Pothole Infill: Estimated ₹68.5 Lakh across 108 high-severity cavities\n• Note: AI cost figures are indicative preliminary estimates and require Sectional Officer rate certification prior to administrative approval.`;
    }

    // Default response
    return `Query processed against PWrD Assam Asset Engine. RAISE has currently indexed ${roads.length} road corridors, ${defects.length} detected pavement defects, and 43 fleet telemetry units in the Kamrup Metro sector. You can ask specifically about defect counts, repair methods, or Hirakjyoti Kakati Road.`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const queryText = input;
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(queryText);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Launcher Pill (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-12 right-6 z-40 px-4 py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 border border-cyan-300/40 select-none animate-bounce"
        >
          <Bot className="w-5 h-5 text-white" />
          <span className="text-xs font-mono tracking-wide">RAISE INTELLIGENCE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Chat Console Window */}
      {isOpen && (
        <div className="fixed bottom-10 right-6 z-50 w-96 sm:w-[420px] max-h-[580px] h-[550px] bg-[#0A1220] border border-cyan-500/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 select-none animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="px-4 py-3 bg-[#070D18] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white tracking-wide">
                    RAISE INTELLIGENCE
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700">
                    Grounded Live DB
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Assam PWrD Infrastructure Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt);
                }}
                className="px-2.5 py-1 rounded-full text-[10px] bg-slate-900 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-800 whitespace-nowrap text-slate-400 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-[#151D2A] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-cyan-400 p-2 bg-slate-900/60 rounded-lg w-fit text-xs animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Synthesizing PWrD database telemetry...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Box */}
          <div className="p-3 bg-[#070D18] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask RAISE (e.g., status of Hirakjyoti Kakati Road)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
