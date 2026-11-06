import React from 'react';
import { 
  ShieldCheck, 
  MessageCircle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Award
} from 'lucide-react';
import { OFFICE_DATA, LAWYERS } from '../data/initialData';

interface HeroProps {
  onOpenContact: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenContact }) => {
  const drReinaldo = LAWYERS[0];

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Trust Signals, Golden Principle, CTAs */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* OAB Credentials Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-medium w-fit">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Dr. Reinaldo (OAB/MG 111.989) • Dra. Paula (OAB/MG 196.128)</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Você não precisa enfrentar <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">isso sozinho.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
                Mais de 18 anos transformando conhecimento jurídico em <strong className="text-white font-semibold">proteção real, amparo humano e tranquilidade</strong>. Fale diretamente com quem vai cuidar da sua causa do começo ao fim.
              </p>
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Atendimento 100% direto com os sócios</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+18 anos de experiência prática</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Presencial em BH e Online no Brasil</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1%2C%20Dr.%20Reinaldo%20e%20equipe%20RED.%20Gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica%20para%20o%20meu%20caso.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold px-6 py-4 rounded-xl shadow-lg shadow-emerald-950/40 hover:scale-[1.02] transition transform text-base sm:text-lg text-center"
              >
                <MessageCircle className="w-6 h-6 fill-white text-white" />
                <span>Falar no WhatsApp Agora</span>
              </a>

              <button
                onClick={onOpenContact}
                className="flex items-center justify-center gap-2 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-6 py-4 rounded-xl transition text-base text-center"
              >
                <span>Análise de Caso (Formulário)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Reassurance text */}
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Atendimento seguro e sigiloso. Primeira conversa acolhedora e sem termos difíceis.
            </p>
          </div>

          {/* Right Column: Hero Visual with Real Lawyer Photo */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              
              {/* Outer decorative glowing ring */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-amber-500 via-amber-700 to-slate-800 rounded-3xl blur-md opacity-40"></div>
              
              {/* Card Container */}
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border border-amber-500/30 overflow-hidden shadow-2xl">
                
                {/* Official Lawyer Photo */}
                <div className="relative h-[430px] sm:h-[480px] w-full overflow-hidden bg-slate-950">
                  <img
                    src={drReinaldo.photoUrl}
                    alt={drReinaldo.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/aistudio/foto_perfil_reinaldo_site-essa_870179fe.jpg';
                    }}
                  />
                  {/* Subtle fade at the very bottom edge of photo */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent"></div>
                </div>

                {/* Dr. Reinaldo's Quote in the main card */}
                <div className="p-5 sm:p-6 bg-slate-950 border-t border-amber-500/20">
                  <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
                    "A verdade, sempre. Mesmo que doa, prefiro a sinceridade a criar falsas ilusões."
                  </p>
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-xs sm:text-sm font-bold text-amber-400">Dr. Reinaldo Eustáquio Dias</span>
                    <span className="text-xs text-slate-400">OAB/MG nº 111.989</span>
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
