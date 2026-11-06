import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  FileText, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Lead } from '../types';
import { PRACTICE_AREAS, OFFICE_DATA } from '../data/initialData';

interface ContactFormProps {
  initialArea?: string;
  onLeadAdded?: (newLead: Lead) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialArea, onLeadAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [processNumber, setProcessNumber] = useState('');
  const [practiceArea, setPracticeArea] = useState(initialArea || PRACTICE_AREAS[0].title);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mask CPF: 000.000.000-00
  const handleCpfChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 9) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
    } else if (raw.length > 6) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}`;
    } else if (raw.length > 3) {
      formatted = `${raw.slice(0, 3)}.${raw.slice(3, 6)}`;
    }
    setCpf(formatted);
  };

  // Mask Phone: (00) 00000-0000
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    } else if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !cpf || !phone) return;

    setIsSubmitting(true);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      cpf: cpf.trim(),
      phone: phone.trim(),
      processNumber: processNumber.trim() || undefined,
      practiceArea: practiceArea,
      notes: notes.trim() || undefined,
      status: 'novo_lead', // Envia direto para a coluna 'Novo Lead' do CRM
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save directly into localStorage for persistent CRM access
    try {
      const stored = localStorage.getItem('red_adv_leads');
      const leadsList: Lead[] = stored ? JSON.parse(stored) : [];
      leadsList.unshift(newLead);
      localStorage.setItem('red_adv_leads', JSON.stringify(leadsList));
    } catch (err) {
      console.error('Error saving lead to storage', err);
    }

    if (onLeadAdded) {
      onLeadAdded(newLead);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setCpf('');
    setPhone('');
    setProcessNumber('');
    setNotes('');
    setSubmitted(false);
  };

  return (
    <section id="contato" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Mail className="w-3.5 h-3.5" />
            Atendimento Inicial
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Inicie Seu Atendimento
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Preencha os campos abaixo. Seus dados são confidenciais e serão encaminhados diretamente para análise técnica do Dr. Reinaldo e da Dra. Paula.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-10 shadow-2xl relative">
          
          {submitted ? (
            <div className="text-center py-10 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Mensagem Recebida com Sucesso!
              </h3>
              <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                Olá, <strong>{name}</strong>. Seus dados foram salvos no nosso sistema CRM e encaminhados diretamente para a equipe jurídica da RED Advogados Associados. Entraremos em contato com você pelo WhatsApp em instantes.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={`https://wa.me/${OFFICE_DATA.phoneRaw}?text=Ol%C3%A1%2C%20acabei%20de%20enviar%20o%20formul%C3%A1rio%20no%20site%20(Nome%3A%20${encodeURIComponent(name)}%2C%20CPF%3A%20${encodeURIComponent(cpf)})%20e%20gostaria%20de%20antecipar%20meu%20atendimento.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition text-sm flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-slate-950" />
                  <span>Falar Agora no WhatsApp</span>
                </a>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Mandatory Fields Notice */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Sigilo profissional garantido (Código de Ética OAB)
                </span>
                <span>* Campos obrigatórios</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Nome Completo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    E-mail *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* CPF */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={(e) => handleCpfChange(e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 px-4 text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono"
                  />
                </div>

                {/* Telefone / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="(31) 90000-0000"
                      maxLength={15}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition font-mono"
                    />
                  </div>
                </div>

                {/* Área de Interesse */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Área Principal de Interesse
                  </label>
                  <select
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 px-4 text-sm text-white focus:outline-none transition"
                  >
                    {PRACTICE_AREAS.map((a) => (
                      <option key={a.id} value={a.title}>
                        {a.title}
                      </option>
                    ))}
                    <option value="Outro Assunto">Outro Assunto / Não Tenho Certeza</option>
                  </select>
                </div>

                {/* Campo Opcional: Número do Processo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Número do Processo <span className="text-slate-500 font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={processNumber}
                      onChange={(e) => setProcessNumber(e.target.value)}
                      placeholder="Ex: 5001234-55.2024.8.13.0024 ou PAD nº"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                    />
                  </div>
                </div>

              </div>

              {/* Mensagem / Breve Descrição */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Breve relato da sua situação <span className="text-slate-500 font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Conte em poucas palavras o que está acontecendo e como podemos te apoiar..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-4 px-6 rounded-xl transition shadow-xl flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-70"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Salvando no CRM...' : 'Enviar e Salvar no CRM'}</span>
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-2.5">
                  Ao enviar, sua solicitação é registrada imediatamente na coluna "Novo Lead" da nossa gestão.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
