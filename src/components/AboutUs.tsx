import React from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle, 
  XCircle, 
  HeartHandshake, 
  ShieldCheck, 
  BookOpen, 
  Sparkles,
  Quote
} from 'lucide-react';
import { LAWYERS, COMPARISON_TABLE } from '../data/initialData';

export const AboutUs: React.FC = () => {
  return (
    <section id="quem-somos" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5" />
            Quem Somos & Nossa Essência
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Pessoas reais cuidando de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">pessoas reais</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Não acreditamos em advocacia fria e engessada. Entendemos que quando você procura um advogado, precisa de alguém que ouça sua história com calma, explique a verdade de frente e lute com você até o final.
          </p>
        </div>

        {/* Lawyer Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-stretch">
          
          {/* Dr. Reinaldo Dias */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-2xl border border-amber-500/30 overflow-hidden shadow-xl flex flex-col sm:flex-row">
            <div className="sm:w-5/12 relative h-72 sm:h-auto min-h-[300px] overflow-hidden bg-slate-900 shrink-0">
              <img
                src={LAWYERS[0].photoUrl}
                alt={LAWYERS[0].name}
                className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded shadow">
                +18 Anos de Advocacia
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {LAWYERS[0].name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{LAWYERS[0].oab}</span>
                  <span className="text-slate-600">•</span>
                  <span>{LAWYERS[0].role}</span>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {LAWYERS[0].bio}
                </p>

                {/* Academic Background */}
                <div className="space-y-2 mb-4 pt-2 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                    Formação Acadêmica Diferenciada:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {LAWYERS[0].education.map((edu, idx) => (
                      <li key={idx} className="leading-snug">{edu}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs text-amber-300/90 italic flex items-start gap-2">
                <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{LAWYERS[0].quote}</span>
              </div>
            </div>
          </div>

          {/* Dra. Paula Mattos */}
          <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-amber-500/40 shrink-0 bg-slate-900 shadow-md">
                  <img
                    src={LAWYERS[1].photoUrl}
                    alt={LAWYERS[1].name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {LAWYERS[1].name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mt-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{LAWYERS[1].oab}</span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{LAWYERS[1].role}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                {LAWYERS[1].bio}
              </p>

              <div className="space-y-2 mb-5 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Especialidades de Destaque:
                </span>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>{LAWYERS[1].mainAreas}</li>
                  {LAWYERS[1].education.map((edu, idx) => (
                    <li key={idx} className="leading-snug">{edu}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 text-xs text-amber-300/90 italic flex items-start gap-2">
              <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{LAWYERS[1].quote}</span>
            </div>
          </div>

        </div>

        {/* Golden Comparison Table: Escritório Grande × Nosso Escritório */}
        <div className="mt-8">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Por que a <span className="text-amber-400">RED Advogados</span> é a escolha mais segura?
            </h3>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              A diferença entre ser apenas mais um número em uma grande banca e ter profissionais seniores dedicados ao seu lado.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-2xl bg-slate-950">
            <table className="w-full text-left text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-xs uppercase tracking-wider">
                  <th className="py-4 px-6 text-slate-400 w-1/4">Aspecto do Atendimento</th>
                  <th className="py-4 px-6 text-rose-300/90 bg-rose-950/20 w-3/8">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      Grandes Escritórios Tradicionais
                    </div>
                  </th>
                  <th className="py-4 px-6 text-emerald-300 bg-emerald-950/30 w-3/8 border-l border-emerald-900/40">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Nosso Escritório (RED Advogados)
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {COMPARISON_TABLE.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-900/40 transition">
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      {item.aspect}
                    </td>
                    <td className="py-4 px-6 text-slate-400 bg-rose-950/10 text-xs sm:text-sm leading-relaxed">
                      {item.bigFirms}
                    </td>
                    <td className="py-4 px-6 text-emerald-100 bg-emerald-950/20 font-medium border-l border-emerald-900/30 text-xs sm:text-sm leading-relaxed">
                      {item.ourFirm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
