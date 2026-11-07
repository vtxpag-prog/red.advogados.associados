import React, { useState } from 'react';
import { 
  MessageCircle, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  CheckCheck, 
  Calendar, 
  Bell, 
  Send, 
  User, 
  Shield, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { WHATSAPP_SCRIPTS, OFFICE_DATA } from '../data/initialData';

export const WhatsAppSimulator: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentScript = WHATSAPP_SCRIPTS[activeStepIndex];

  // Auto-play timer effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => (prev + 1) % WHATSAPP_SCRIPTS.length);
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section id="simulador" className="py-20 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            Transparência & Acompanhamento
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Como Funciona Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">Atendimento</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Acompanhe a simulação real de como mantemos você informado em cada etapa do seu processo — do primeiro 'olá' até a entrega do resultado, sem você precisar implorar por notícias.
          </p>
        </div>

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive 8 Steps Stepper */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Selecione a etapa para visualizar o script:
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPlaying ? 'Pausar Simulação' : 'Reproduzir Fluxo'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WHATSAPP_SCRIPTS.map((script, idx) => {
                const isCurrent = idx === activeStepIndex;
                return (
                  <button
                    key={script.id}
                    onClick={() => {
                      setActiveStepIndex(idx);
                      setIsPlaying(false);
                    }}
                    className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md shadow-emerald-950/50 scale-[1.02]'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {script.id}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-200 truncate">
                        {script.title}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {script.timing}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step Controls & Direct Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : WHATSAPP_SCRIPTS.length - 1));
                    setIsPlaying(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Etapa Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  Etapa {activeStepIndex + 1} de {WHATSAPP_SCRIPTS.length}
                </span>
                <button
                  onClick={() => {
                    setActiveStepIndex((prev) => (prev + 1) % WHATSAPP_SCRIPTS.length);
                    setIsPlaying(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  title="Próxima Etapa"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Real WhatsApp Test Button */}
              <a
                href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1!%20Testei%20o%20simulador%20no%20site%20da%20RED%20Advogados%20e%20gostaria%20de%20iniciar%20um%20atendimento%20real.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold px-5 py-3 rounded-xl shadow-lg transition text-sm text-center"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Testar Agora no WhatsApp Real</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Realistic Phone Mockup Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md bg-slate-950 rounded-[2.5rem] p-3.5 border-4 border-slate-700/80 shadow-2xl relative">
              
              {/* Phone Speaker Notch */}
              <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="w-10 h-1 rounded-full bg-slate-700"></span>
              </div>

              {/* Inside Phone Screen (WhatsApp Theme) */}
              <div className="rounded-[1.8rem] bg-[#0b141a] overflow-hidden border border-slate-800 flex flex-col h-[480px]">
                
                {/* WhatsApp Chat Top Header */}
                <div className="bg-[#202c33] text-white px-4 py-3 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-600 border border-amber-400/50 shrink-0">
                      <img
                        src="/assets/aistudio/foto_perfil_reinaldo_site-essa_870179fe.jpg"
                        alt="RED Advocacia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm leading-tight flex items-center gap-1.5">
                        <span>RED Advocacia</span>
                        <Shield className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                      </div>
                      <div className="text-[11px] text-emerald-400 font-light flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        online agora • Dr. Reinaldo & Dra. Paula
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Container with WhatsApp Background Pattern */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-opacity-5 relative flex flex-col justify-end">
                  
                  {/* Encryption Notice */}
                  <div className="bg-[#182229] border border-amber-500/20 text-amber-200/80 text-[10px] text-center p-2 rounded-lg leading-tight mx-auto max-w-xs shadow">
                    🔒 Atendimento seguro com sigilo profissional advocatício garantido pelo Código de Ética da OAB.
                  </div>

                  {/* Stage pill tag */}
                  <div className="text-center">
                    <span className="bg-[#1f2c34] text-slate-300 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-slate-700">
                      {currentScript.stage} — {currentScript.title}
                    </span>
                  </div>

                  {/* The Active Message Bubble */}
                  <div className="flex flex-col items-start max-w-[90%]">
                    <div className="bg-[#202c33] text-slate-100 p-3.5 rounded-2xl rounded-tl-none shadow-lg border border-slate-700/50 space-y-2 text-xs sm:text-sm leading-relaxed">
                      
                      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-700/60 text-[11px] text-amber-400 font-medium">
                        <span>
                          {currentScript.sender === 'bot' ? '🤖 Canal Oficial RED' : '⚖️ Dr. Reinaldo / Dra. Paula'}
                        </span>
                        <span className="text-[10px] text-slate-400">{currentScript.timing}</span>
                      </div>

                      <p className="text-slate-100 whitespace-pre-line">
                        {currentScript.message}
                      </p>

                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                        <span>10:42</span>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* WhatsApp Chat Input Bar Mock */}
                <div className="bg-[#202c33] p-2.5 flex items-center gap-2 border-t border-slate-800">
                  <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-xs text-slate-400">
                    Mensagem segura...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                    <Send className="w-4 h-4" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
