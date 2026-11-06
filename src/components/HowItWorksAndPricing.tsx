import React from 'react';
import { 
  FileCheck2, 
  Search, 
  HandCoins, 
  CreditCard, 
  Check, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { OFFICE_DATA } from '../data/initialData';

const STEPS = [
  {
    number: '01',
    title: '1º Contato Acolhedor',
    desc: 'Você nos liga ou envia mensagem explicando brevemente sua situação. Sem formulários burocráticos ou robôs que travam.',
  },
  {
    number: '02',
    title: 'Primeira Conversa de Diagnóstico',
    desc: 'Ouvimos com atenção redobrada. Entendemos não apenas os artigos da lei, mas a sua realidade e o que tira o seu sono.',
  },
  {
    number: '03',
    title: 'Análise Técnica & Estratégica',
    desc: 'Estudamos o caso a fundo e apresentamos os caminhos reais, as chances, os riscos sinceros e o investimento exato.',
  },
  {
    number: '04',
    title: 'Acordo Transparente & Contrato',
    desc: 'Se você concordar com a estratégia, formalizamos o contrato com escopo claro e honorários combinados previamente.',
  },
  {
    number: '05',
    title: 'Atuação & Acompanhamento Próximo',
    desc: 'Protocolamos as ações necessárias e mantemos você avisado de cada movimentação em primeira mão.',
  },
  {
    number: '06',
    title: 'Resolução & Devolução da Paz',
    desc: 'Concluímos o procedimento com clareza, orientações de pós-resolução e a dignidade restabelecida.',
  },
];

export const HowItWorksAndPricing: React.FC = () => {
  return (
    <section id="como-funciona" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            Método de Atuação & Transparência
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Como Funciona e <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Valores Transparentes</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            O medo de não saber quanto vai custar ou o que vai acontecer paralisa muita gente. Na RED Advogados, você sabe tudo antes de tomar qualquer decisão.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {STEPS.map((step) => (
            <div 
              key={step.number} 
              className="bg-slate-900/70 rounded-2xl p-6 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-3xl font-extrabold text-amber-400/30 group-hover:text-amber-400 transition">
                    {step.number}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition">
                  {step.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing & Honorários Policy Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 rounded-2xl border border-amber-500/30 p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HandCoins className="w-4 h-4" />
                <span>Nossa Política de Investimento e Honorários</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Sem custos ocultos. Compatível com a sua realidade.
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Cada caso é único. Por isso, definimos os honorários com base na complexidade e no tempo demandado — seja valor fixo pelo serviço, valor por etapas estratégicas ou com percentual de êxito quando cabível.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pagamentos facilitados via <strong>PIX</strong> e <strong>Cartão</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Possibilidade de <strong>parcelamento</strong> planejado</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Contrato formal antes de qualquer desembolso</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Custas de terceiros discriminadas à parte com clareza</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-4">
              <span className="text-xs text-amber-400 uppercase font-semibold tracking-wider">
                Primeiro Passo
              </span>
              <h4 className="font-serif text-xl font-bold text-white">
                Diagnóstico Preliminar
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converse conosco sem compromisso para entender a viabilidade do seu caso. Se julgar que não somos o caminho ideal, segue em paz.
              </p>
              <a
                href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20as%20condi%C3%A7%C3%B5es%20e%20honor%C3%A1rios%20para%20o%20meu%20caso.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition"
              >
                <span>Consultar Condições</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
