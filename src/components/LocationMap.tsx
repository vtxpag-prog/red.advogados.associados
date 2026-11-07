import React from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Phone, 
  Mail, 
  Clock, 
  Laptop, 
  Building
} from 'lucide-react';
import { OFFICE_DATA } from '../data/initialData';

export const LocationMap: React.FC = () => {
  return (
    <section id="localizacao" className="py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Endereço & Atendimento Híbrido
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Onde Estamos
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Escritório estrategicamente localizado no bairro Santo Antônio, em Belo Horizonte/MG, com estrutura pronta para receber você presencialmente ou atendê-lo online em todo o território nacional.
          </p>
        </div>

        {/* Location Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Address Card, Modalities & Direct Route Link */}
          <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-6">
              
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Sede em Belo Horizonte / MG
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">
                  {OFFICE_DATA.name}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>{OFFICE_DATA.address.street}, {OFFICE_DATA.address.number} — {OFFICE_DATA.address.room}</strong><br />
                    Bairro {OFFICE_DATA.address.neighborhood}<br />
                    {OFFICE_DATA.address.city}/{OFFICE_DATA.address.state} — CEP {OFFICE_DATA.address.zip}
                  </span>
                </p>
              </div>

              {/* Modalities: Presencial + Online */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Atendimento Presencial</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Ambiente seguro, confortável e reservado para conversas confidenciais com hora marcada.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Laptop className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Atendimento Online em Todo o Brasil</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Videoconferência (Google Meet / WhatsApp), envio digital de documentos e assinatura eletrônica com validade jurídica plena.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Info */}
              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{OFFICE_DATA.openingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{OFFICE_DATA.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>{OFFICE_DATA.email}</span>
                </div>
              </div>

            </div>

            {/* Direct Directions Button */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <a
                href={OFFICE_DATA.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-5 rounded-xl text-sm transition shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                <span>Traçar Rota no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Google Maps Interactive Card */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 min-h-[380px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 group">
              
              {/* Google Maps iFrame */}
              <iframe
                title="Localização RED Advocacia - Av do Contorno 7174 Santo Antonio BH"
                src="https://maps.google.com/maps?q=Avenida+do+Contorno+7174+Santo+Antonio+Belo+Horizonte+MG&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[380px] border-0 filter grayscale contrast-125 opacity-80 group-hover:opacity-100 group-hover:filter-none transition duration-500"
                loading="lazy"
              />

              {/* Clickable Overlay to open Route */}
              <a
                href={OFFICE_DATA.address.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-x-4 bottom-4 p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-amber-500/40 text-white shadow-2xl hover:bg-slate-900 transition flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 font-bold">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-400 block">
                      Google Maps Integrado
                    </span>
                    <strong className="text-sm font-semibold text-white block">
                      Clique no mapa para traçar a rota até nós
                    </strong>
                    <span className="text-[11px] text-slate-400 block">
                      Avenida do Contorno, 7174 — Sala 09, Santo Antônio — BH/MG
                    </span>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-xs text-amber-400 font-semibold shrink-0">
                  <span>Abrir Navegador</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
