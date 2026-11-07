import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Lock, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { OFFICE_DATA, LAWYERS } from '../data/initialData';

interface FooterProps {
  onOpenCrm: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCrm }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/emblema_RED_advocacia_v2.png"
                alt="Emblema RED Advocacia"
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-md shrink-0"
              />
              <div>
                <span className="font-serif text-xl font-bold text-white block">
                  {OFFICE_DATA.name}
                </span>
                <span className="text-xs text-amber-400 block font-medium">
                  {OFFICE_DATA.corporateName}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              "Você não precisa enfrentar isso sozinho." Advocacia artesanal e estratégica, com atendimento direto pelos titulares e compromisso inegociável com a verdade.
            </p>

            <div className="space-y-1 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span><strong>{LAWYERS[0].name}</strong> — {LAWYERS[0].oab}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span><strong>{LAWYERS[1].name}</strong> — {LAWYERS[1].oab}</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#quem-somos" className="hover:text-amber-400 transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Quem Somos & Quadro Societário
                </a>
              </li>
              <li>
                <a href="#areas" className="hover:text-amber-400 transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Áreas de Atuação
                </a>
              </li>
              <li>
                <a href="#simulador" className="hover:text-amber-400 transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Simulador de Atendimento (WhatsApp)
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-amber-400 transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Como Funciona & Honorários
                </a>
              </li>
              <li>
                <a href="#localizacao" className="hover:text-amber-400 transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Localização em Belo Horizonte
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-amber-400 transition flex items-center gap-1">
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Iniciar Atendimento
                </a>
              </li>
            </ul>
          </div>

          {/* Location & Contact Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sede & Contato
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {OFFICE_DATA.address.fullFormatted}
                </span>
              </p>

              <p className="pt-1">
                <a
                  href={OFFICE_DATA.address.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Abrir Rota no Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>

              <p className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {OFFICE_DATA.phone}</span>
              </p>

              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{OFFICE_DATA.email}</span>
              </p>

              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{OFFICE_DATA.openingHours}</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Copyright and Restricted Access Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {OFFICE_DATA.name}. Todos os direitos reservados.
          </div>

          {/* Restricted Area Link */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenCrm}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Área do Advogado (CRM)</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
