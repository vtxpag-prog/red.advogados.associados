import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Phone, 
  Users, 
  FileText, 
  Scale, 
  FileCheck, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Plus, 
  Send, 
  ExternalLink, 
  User, 
  ShieldCheck,
  Building,
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Lead, Interaction, KanbanStatus } from '../../types';
import { OFFICE_DATA, LAWYERS } from '../../data/initialData';

interface LeadDetailModalProps {
  lead: Lead;
  currentUserName: string;
  onClose: () => void;
  onUpdateLead: (updated: Lead) => void;
}

const KANBAN_OPTIONS: { id: KanbanStatus; label: string }[] = [
  { id: 'novo_lead', label: '🔵 Novo Lead' },
  { id: 'em_atendimento', label: '🟡 Em Atendimento' },
  { id: 'agendado', label: '🟢 Agendado' },
  { id: 'processo_andamento', label: '🟣 Processo em Andamento' },
  { id: 'concluido', label: '🟠 Concluído' },
  { id: 'arquivado', label: '⚫ Arquivado' },
];

const INTERACTION_TYPES = [
  { id: 'whatsapp', label: 'Mensagem de WhatsApp', icon: MessageSquare, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { id: 'call', label: 'Ligação Telefônica', icon: Phone, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { id: 'meeting', label: 'Reunião Presencial / Online', icon: Users, color: 'text-amber-800 bg-amber-50 border-amber-200' },
  { id: 'protocol', label: 'Protocolo Judicial / Publicação', icon: Scale, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { id: 'hearing', label: 'Audiência / Despacho com Juiz', icon: Building, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  { id: 'document', label: 'Envio / Análise de Documentos', icon: FileCheck, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { id: 'internal', label: 'Anotação Interna da Equipe', icon: FileText, color: 'text-slate-700 bg-slate-100 border-slate-300' },
];

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  currentUserName,
  onClose,
  onUpdateLead,
}) => {
  // New interaction form state
  const [interactionType, setInteractionType] = useState<Interaction['type']>('whatsapp');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(currentUserName || 'Dr. Reinaldo Eustáquio Dias');
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<KanbanStatus>(lead.status);

  const interactions = lead.interactions || [];

  const handleStatusChange = (newStatus: KanbanStatus) => {
    setStatus(newStatus);
    const updatedLead: Lead = {
      ...lead,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      interactions: [
        {
          id: `int-status-${Date.now()}`,
          type: 'internal',
          title: 'Etapa do Kanban Atualizada',
          description: `O status do cliente foi alterado para: ${
            KANBAN_OPTIONS.find((k) => k.id === newStatus)?.label || newStatus
          }.`,
          date: new Date().toISOString(),
          author: currentUserName || 'Advogado Responsável',
        },
        ...interactions,
      ],
    };
    onUpdateLead(updatedLead);
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newInt: Interaction = {
      id: `int-${Date.now()}`,
      type: interactionType,
      title: title.trim() || INTERACTION_TYPES.find((t) => t.id === interactionType)?.label || 'Interação Registrada',
      description: description.trim(),
      date: new Date().toISOString(),
      author: author.trim() || currentUserName || 'Advogado',
    };

    const updatedLead: Lead = {
      ...lead,
      updatedAt: new Date().toISOString(),
      interactions: [newInt, ...interactions],
    };

    onUpdateLead(updatedLead);
    setTitle('');
    setDescription('');
  };

  // Generate formatted text content for download / sharing
  const generateReportText = () => {
    const formattedDate = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let text = `========================================================\n`;
    text += `   RELATÓRIO DE HISTÓRICO E ACOMPANHAMENTO PROCESSUAL   \n`;
    text += `             RED ADVOCACIA                   \n`;
    text += `      Reinaldo Dias Sociedade Individual de Advocacia    \n`;
    text += `========================================================\n\n`;
    text += `EMISSÃO DO RELATÓRIO: ${formattedDate}\n`;
    text += `RESPONSÁVEIS TÉCNICOS: Dr. Reinaldo Eustáquio Dias (OAB/MG 111.989)\n`;
    text += `                       Dra. Paula da Silva Mattos (OAB/MG 196.128)\n`;
    text += `ENDEREÇO DA SEDE: Av. do Contorno, 7174 — Sala 09, Santo Antônio, Belo Horizonte/MG\n`;
    text += `CONTATO: ${OFFICE_DATA.phone} | ${OFFICE_DATA.email}\n\n`;
    text += `--------------------------------------------------------\n`;
    text += `DADOS DO CLIENTE / PROCESSO\n`;
    text += `--------------------------------------------------------\n`;
    text += `NOME DO CLIENTE: ${lead.name}\n`;
    text += `CPF: ${lead.cpf}\n`;
    text += `TELEFONE/WHATSAPP: ${lead.phone}\n`;
    text += `E-MAIL: ${lead.email}\n`;
    text += `ÁREA DE ATUAÇÃO: ${lead.practiceArea}\n`;
    text += `Nº DO PROCESSO / PAD: ${lead.processNumber || 'Não informado / Fase preliminar'}\n`;
    text += `ETAPA ATUAL NO SISTEMA: ${KANBAN_OPTIONS.find((k) => k.id === lead.status)?.label || lead.status}\n`;
    text += `DATA DE CADASTRO: ${new Date(lead.createdAt).toLocaleDateString('pt-BR')}\n`;
    if (lead.notes) {
      text += `ANOTAÇÃO INICIAL: ${lead.notes}\n`;
    }
    text += `\n--------------------------------------------------------\n`;
    text += `LINHA DO TEMPO DA VIDA DO CLIENTE NO PROCESSO\n`;
    text += `--------------------------------------------------------\n\n`;

    if (interactions.length === 0) {
      text += `Nenhuma interação registrada até o momento.\n\n`;
    } else {
      interactions.forEach((int, index) => {
        const intDate = new Date(int.date).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        const typeLabel = INTERACTION_TYPES.find((t) => t.id === int.type)?.label || int.type;
        text += `[${index + 1}] DATA/HORA: ${intDate}\n`;
        text += `    TIPO: ${typeLabel}\n`;
        text += `    TÍTULO: ${int.title}\n`;
        text += `    RESPONSÁVEL: ${int.author}\n`;
        text += `    DETALHES / ANOTAÇÃO:\n`;
        text += `    ${int.description.replace(/\n/g, '\n    ')}\n`;
        text += `--------------------------------------------------------\n`;
      });
    }

    text += `\nEste documento contém informações estritamente confidenciais e protegidas pelo sigilo profissional advocatício (Lei nº 8.906/94 - Estatuto da Advocacia e da OAB).\n`;
    return text;
  };

  // Download File (.txt / .md)
  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeClientName = lead.name.replace(/[^a-zA-Z0-9]/g, '_');
    link.href = url;
    link.download = `Historico_Acompanhamento_${safeClientName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopyReport = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Print Report
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Acompanhamento - ${lead.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; font-size: 13px; }
            .header { border-bottom: 2px solid #b45309; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 20px; font-weight: bold; color: #0f172a; margin: 0; font-family: Georgia, serif; }
            .sub { font-size: 11px; color: #64748b; margin-top: 4px; }
            .section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; }
            .item strong { color: #0f172a; }
            .timeline-item { border-left: 2px solid #d97706; padding-left: 15px; margin-bottom: 20px; position: relative; }
            .timeline-item::before { content: ""; width: 8px; height: 8px; background: #b45309; border-radius: 50%; position: absolute; left: -5px; top: 4px; }
            .timeline-date { font-size: 11px; font-weight: bold; color: #b45309; }
            .timeline-title { font-size: 14px; font-weight: bold; color: #0f172a; margin: 2px 0 6px 0; }
            .timeline-desc { font-size: 12px; color: #334155; white-space: pre-line; }
            .timeline-author { font-size: 11px; color: #64748b; margin-top: 4px; }
            .footer { border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 15px; font-size: 10px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">RED ADVOCACIA</h1>
              <div class="sub">Reinaldo Dias Sociedade Individual de Advocacia • OAB/MG nº 111.989 • OAB/MG nº 196.128</div>
              <div class="sub">Av. do Contorno, 7174 — Sala 09, Santo Antônio, Belo Horizonte/MG • Tel: (31) 98334-7116</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #64748b;">
              Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
            </div>
          </div>

          <div class="section">
            <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 13px; color: #b45309; text-transform: uppercase;">Dados Cadastrais do Cliente e do Processo</h3>
            <div class="grid">
              <div class="item"><strong>Cliente:</strong> ${lead.name}</div>
              <div class="item"><strong>CPF:</strong> ${lead.cpf}</div>
              <div class="item"><strong>WhatsApp:</strong> ${lead.phone}</div>
              <div class="item"><strong>E-mail:</strong> ${lead.email}</div>
              <div class="item"><strong>Área de Atuação:</strong> ${lead.practiceArea}</div>
              <div class="item"><strong>Nº do Processo / PAD:</strong> ${lead.processNumber || 'Em fase preliminar'}</div>
              <div class="item"><strong>Etapa Atual:</strong> ${KANBAN_OPTIONS.find((k) => k.id === lead.status)?.label || lead.status}</div>
              <div class="item"><strong>Data de Cadastro:</strong> ${new Date(lead.createdAt).toLocaleDateString('pt-BR')}</div>
            </div>
          </div>

          <h3 style="font-size: 14px; color: #0f172a; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            Linha do Tempo e Histórico de Interações (${interactions.length} registros)
          </h3>

          ${
            interactions.length === 0
              ? '<p style="color: #64748b; font-size: 12px;">Nenhuma interação registrada no momento.</p>'
              : interactions
                  .map(
                    (int) => `
                <div class="timeline-item">
                  <div class="timeline-date">${new Date(int.date).toLocaleDateString('pt-BR')} às ${new Date(int.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • ${INTERACTION_TYPES.find((t) => t.id === int.type)?.label || int.type}</div>
                  <div class="timeline-title">${int.title}</div>
                  <div class="timeline-desc">${int.description}</div>
                  <div class="timeline-author">Registrado por: <strong>${int.author}</strong></div>
                </div>
              `
                  )
                  .join('')
          }

          <div class="footer">
            Documento de acompanhamento processual de caráter sigiloso (Art. 7º, II da Lei 8.906/94). Gerado eletronicamente pelo CRM da RED Advocacia.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-200">
        
        {/* Modal Top Header (Light Clean Theme) */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 font-serif font-bold text-lg shadow-xs">
              {lead.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {lead.name}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="text-amber-700 font-semibold">{lead.practiceArea}</span>
                {lead.processNumber && (
                  <>
                    <span>•</span>
                    <span className="text-slate-700 font-mono bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
                      Proc: {lead.processNumber}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>Cadastrado em {new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Close Button */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            
            {/* Download Report Button */}
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg transition shadow-xs cursor-pointer"
              title="Baixar arquivo TXT com todo o histórico do cliente para envio"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Histórico</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-2 rounded-lg border border-slate-300 transition shadow-xs"
              title="Imprimir ou Salvar em PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-2 rounded-lg border border-slate-300 transition shadow-xs"
              title="Copiar texto para colar em WhatsApp ou e-mail"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition ml-2"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client Contact & Kanban Stage Bar */}
        <div className="bg-slate-100/70 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Contact Direct Links */}
          <div className="flex flex-wrap items-center gap-4 text-slate-700">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <a
                href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)}%2C%20aqui%20%C3%A9%20da%20RED%20Advocacia.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-700 font-medium flex items-center gap-1 font-mono"
              >
                <span>{lead.phone}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{lead.email}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>CPF: <strong className="font-mono text-slate-900">{lead.cpf}</strong></span>
            </div>
          </div>

          {/* Change Kanban Stage Directly */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Etapa no Kanban:</span>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value as KanbanStatus)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 shadow-xs"
            >
              {KANBAN_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white text-slate-800">
          
          {/* Lead Original Notes */}
          {lead.notes && (
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs text-slate-800 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 block mb-0.5">Demanda Inicial Registrada:</span>
                <span>{lead.notes}</span>
              </div>
            </div>
          )}

          {/* Form to Register New Interaction in the Client's Life History */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5">
            <h4 className="font-serif text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 text-amber-800">
              <Plus className="w-4 h-4 text-amber-600" />
              Registrar Nova Interação / Evento na Agenda do Processo
            </h4>

            <form onSubmit={handleAddInteraction} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Tipo de Interação */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tipo de Interação *
                  </label>
                  <select
                    value={interactionType}
                    onChange={(e) => setInteractionType(e.target.value as Interaction['type'])}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  >
                    {INTERACTION_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Título / Assunto */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Título / Assunto
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Reunião sobre prazos, Despacho, etc."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Advogado Responsável
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nome do advogado"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 shadow-xs"
                  />
                </div>

              </div>

              {/* Descrição Detalhada */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Resumo da Interação / Anotação da Vida do Cliente *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que foi tratado, decisões tomadas, documentos recebidos ou próximos prazos combinados..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 resize-none shadow-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  Data e hora de criação registradas automaticamente no padrão oficial.
                </span>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gravar no Histórico</span>
                </button>
              </div>
            </form>
          </div>

          {/* Timeline of Recorded Interactions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                Histórico de Acompanhamento do Cliente ({interactions.length} registros)
              </h4>
              <span className="text-[11px] text-slate-500">
                Ordem cronológica decrescente
              </span>
            </div>

            {interactions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl">
                Nenhuma interação registrada ainda. Utilize o formulário acima para anotar telefonemas, reuniões ou protocolos.
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {interactions.map((int) => {
                  const typeDef = INTERACTION_TYPES.find((t) => t.id === int.type) || INTERACTION_TYPES[0];
                  const Icon = typeDef.icon;
                  const intDate = new Date(int.date);

                  return (
                    <div key={int.id} className="relative group">
                      {/* Timeline Dot with Icon */}
                      <div className="absolute -left-6 top-2 w-4 h-4 rounded-full bg-white border-2 border-amber-600 flex items-center justify-center shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                      </div>

                      {/* Content Card */}
                      <div className="bg-white rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition shadow-xs space-y-2">
                        
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${typeDef.color}`}>
                              <Icon className="w-3 h-3" />
                              {typeDef.label}
                            </span>
                            <span className="font-bold text-xs text-slate-900">
                              {int.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {intDate.toLocaleDateString('pt-BR')} às {intDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                          {int.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Registrado por: <strong className="text-slate-800">{int.author}</strong></span>
                          <span className="text-slate-400">ID: {int.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dados protegidos pelo sigilo profissional advocatício (OAB/MG).</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadReport}
              className="text-amber-700 hover:text-amber-800 font-semibold underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Histórico Completo (.TXT)</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
