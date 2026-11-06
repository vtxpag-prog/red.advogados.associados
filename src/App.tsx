import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutUs } from './components/AboutUs';
import { PracticeAreas } from './components/PracticeAreas';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { HowItWorksAndPricing } from './components/HowItWorksAndPricing';
import { LocationMap } from './components/LocationMap';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { LawyerCrm } from './components/crm/LawyerCrm';
import { MessageCircle, Shield } from 'lucide-react';
import { OFFICE_DATA } from './data/initialData';

export default function App() {
  const [currentView, setCurrentView] = useState<'site' | 'crm'>('site');
  const [selectedAreaForContact, setSelectedAreaForContact] = useState<string | undefined>();

  const scrollToContact = (areaTitle?: string) => {
    if (areaTitle) {
      setSelectedAreaForContact(areaTitle);
    }
    const element = document.getElementById('contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If CRM view is requested, render the Lawyer CRM portal
  if (currentView === 'crm') {
    return <LawyerCrm onBackToSite={() => setCurrentView('site')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header */}
      <Header 
        onOpenCrm={() => setCurrentView('crm')} 
        onOpenContact={() => scrollToContact()}
      />

      {/* Main Content: 7 Blocks */}
      <main className="flex-1">
        {/* BLOCO 1 — HERO */}
        <Hero onOpenContact={() => scrollToContact()} />

        {/* BLOCO 2 — QUEM SOMOS & TABELA COMPARATIVA */}
        <AboutUs />

        {/* BLOCO 3 — ÁREAS DE ATUAÇÃO */}
        <PracticeAreas onSelectAreaForContact={(area) => scrollToContact(area)} />

        {/* BLOCO 4 — SIMULADOR DE BOT DO WHATSAPP */}
        <WhatsAppSimulator />

        {/* BLOCO 5 — COMO FUNCIONA E VALORES */}
        <HowItWorksAndPricing />

        {/* BLOCO 6 — LOCALIZAÇÃO COM MAPA */}
        <LocationMap />

        {/* BLOCO 7 — FORMULÁRIO DE CONTATO (SALVA DIRETO NO CRM) */}
        <ContactForm initialArea={selectedAreaForContact} />
      </main>

      {/* RODAPÉ */}
      <Footer onOpenCrm={() => setCurrentView('crm')} />

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Atendimento rápido WhatsApp" className="fixed bottom-6 right-6 z-50">
        <a
          href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1%2C%20Dr.%20Reinaldo%20e%20equipe%20RED.%20Gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica%20para%20o%20meu%20caso.`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 transition transform border-2 border-emerald-300/40"
          title="Fale Conosco no WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-slate-950" />
          <span className="hidden sm:inline text-sm font-bold tracking-tight">
            Falar com Advogado
          </span>
        </a>
      </aside>

    </div>
  );
}
