import React, { useState } from 'react';
import { 
  Scale, 
  Handshake, 
  FileText, 
  Building2, 
  Palette, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { PRACTICE_AREAS, OFFICE_DATA } from '../data/initialData';

interface PracticeAreasProps {
  onSelectAreaForContact: (areaTitle: string) => void;
}

export const PracticeAreas: React.FC<PracticeAreasProps> = ({ onSelectAreaForContact }) => {
  const [activeAreaId, setActiveAreaId] = useState<string>(PRACTICE_AREAS[0].id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-6 h-6" />;
      case 'Handshake':
        return <Handshake className="w-6 h-6" />;
      case 'FileText':
        return <FileText className="w-6 h-6" />;
      case 'Building2':
        return <Building2 className="w-6 h-6" />;
      case 'Palette':
        return <Palette className="w-6 h-6" />;
      default:
        return <Scale className="w-6 h-6" />;
    }
  };

  const selectedArea = PRACTICE_AREAS.find((a) => a.id === activeAreaId) || PRACTICE_AREAS[0];

  return (
    <section id="areas" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            Especialidades Jurídicas
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Soluções jurídicas para os seus <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">momentos decisivos</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Conhecimento aprofundado aplicado com simplicidade. Não aceitamos causas que não dominamos — quando atuamos, nos dedicamos integralmente.
          </p>
        </div>

        {/* Areas Navigation Pills */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {PRACTICE_AREAS.map((area) => {
            const isActive = area.id === activeAreaId;
            return (
              <button
                key={area.id}
                onClick={() => setActiveAreaId(area.id)}
                className={`flex flex-col items-center text-center p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/30'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-lg mb-2.5 ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-amber-400'}`}>
                  {getIcon(area.icon)}
                </div>
                <span className="font-semibold text-xs sm:text-sm line-clamp-2">
                  {area.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Focus Card for the Selected Area */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Area Information */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  {getIcon(selectedArea.icon)}
                </div>
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {selectedArea.title}
                  </h3>
                  <p className="text-amber-400/90 text-sm font-medium">
                    {selectedArea.tagline}
                  </p>
                </div>
              </div>

              <p className="text-slate-300 text-base leading-relaxed">
                {selectedArea.description}
              </p>

              {/* How We Act */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block mb-1">
                  Como a RED Advogados Atua:
                </span>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {selectedArea.howWeHelp}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => onSelectAreaForContact(selectedArea.title)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition text-sm flex items-center gap-2"
                >
                  <span>Solicitar Orientação Nesta Área</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20espec%C3%ADfica%20sobre%20${encodeURIComponent(selectedArea.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white px-5 py-3 rounded-xl transition text-sm"
                >
                  Tirar Dúvida no WhatsApp
                </a>
              </div>
            </div>

            {/* Right Col: Common Scenarios We Solve */}
            <div className="lg:col-span-5 bg-slate-950/90 p-6 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4 text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Situações Frequentes que Resolvemos:
              </h4>

              <ul className="space-y-3">
                {selectedArea.commonProblems.map((prob, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{prob}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Seu caso tem particularidades? Nós analisamos caso a caso sem jargões.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
