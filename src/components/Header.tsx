import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Lock, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import { OFFICE_DATA } from '../data/initialData';

interface HeaderProps {
  onOpenCrm: () => void;
  onOpenContact: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCrm, onOpenContact }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-900/20 text-white shadow-xl">
      {/* Top Bar with Credentials and Quick Contact */}
      <div className="bg-slate-950/80 border-b border-slate-800 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-slate-300">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left justify-center md:justify-start">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              OAB/MG nº 111.989 • OAB/MG nº 196.128
            </span>
            <span className="hidden lg:inline-block text-slate-500">•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Av. do Contorno, 7174 — Sala 09, Santo Antônio — BH/MG
            </span>
            <span className="hidden xl:inline-block text-slate-500">•</span>
            <span className="hidden xl:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Seg a Sex, 09h às 17h
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20RED%20Advogados%20e%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
              (31) 98334-7116
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={onOpenCrm}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs transition"
              title="Acesso Restrito para Advogados e Gestão"
            >
              <Lock className="w-3 h-3" />
              Área do Advogado
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="/assets/aistudio/emblema_RED_advocacia_v2.png"
            alt="Emblema RED Advocacia"
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-md group-hover:scale-105 transition transform shrink-0"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-amber-300 transition">
              RED Advocacia
            </span>
            <span className="text-[11px] uppercase tracking-widest text-amber-400/90 font-medium">
              Advocacia & Assessoria Estratégica
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-200">
          <a href="#quem-somos" className="hover:text-amber-400 transition">Quem Somos</a>
          <a href="#areas" className="hover:text-amber-400 transition">Áreas de Atuação</a>
          <a href="#simulador" className="hover:text-amber-400 transition flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Como Atendemos
          </a>
          <a href="#como-funciona" className="hover:text-amber-400 transition">Valores & Honorários</a>
          <a href="#localizacao" className="hover:text-amber-400 transition">Onde Estamos</a>
          <button
            onClick={onOpenContact}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg shadow-md hover:shadow-amber-500/20 transition flex items-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            Fale Conosco
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-6 py-5 flex flex-col gap-4 text-slate-200">
          <a 
            href="#quem-somos" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-800/60 hover:text-amber-400"
          >
            Quem Somos
          </a>
          <a 
            href="#areas" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-800/60 hover:text-amber-400"
          >
            Áreas de Atuação
          </a>
          <a 
            href="#simulador" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-800/60 hover:text-amber-400 flex items-center justify-between"
          >
            <span>Simulador de Atendimento</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">WhatsApp</span>
          </a>
          <a 
            href="#como-funciona" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-800/60 hover:text-amber-400"
          >
            Valores & Como Funciona
          </a>
          <a 
            href="#localizacao" 
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 border-b border-slate-800/60 hover:text-amber-400"
          >
            Onde Estamos (BH / Online)
          </a>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-lg text-center"
            >
              Iniciar Atendimento Agora
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCrm();
              }}
              className="w-full border border-slate-700 text-slate-400 hover:text-amber-400 py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              Área do Advogado (CRM)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
