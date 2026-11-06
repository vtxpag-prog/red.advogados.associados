import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  Key, 
  ShieldCheck, 
  LogOut, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar, 
  Phone, 
  Mail, 
  FileText,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldAlert,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Lead, UserAccount, KanbanStatus } from '../../types';
import { INITIAL_LEADS, INITIAL_USERS, OFFICE_DATA, PRACTICE_AREAS } from '../../data/initialData';
import { LeadDetailModal } from './LeadDetailModal';

interface LawyerCrmProps {
  onBackToSite: () => void;
}

const KANBAN_COLUMNS: { id: KanbanStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'novo_lead', label: '🔵 Novo Lead', color: 'border-blue-500', badgeBg: 'bg-blue-500/20 text-blue-300' },
  { id: 'em_atendimento', label: '🟡 Em Atendimento', color: 'border-amber-500', badgeBg: 'bg-amber-500/20 text-amber-300' },
  { id: 'agendado', label: '🟢 Agendado', color: 'border-emerald-500', badgeBg: 'bg-emerald-500/20 text-emerald-300' },
  { id: 'processo_andamento', label: '🟣 Processo em Andamento', color: 'border-purple-500', badgeBg: 'bg-purple-500/20 text-purple-300' },
  { id: 'concluido', label: '🟠 Concluído', color: 'border-orange-500', badgeBg: 'bg-orange-500/20 text-orange-300' },
  { id: 'arquivado', label: '⚫ Arquivado', color: 'border-slate-600', badgeBg: 'bg-slate-700 text-slate-300' },
];

const COLORS_CHART = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#64748b'];

export const LawyerCrm: React.FC<LawyerCrmProps> = ({ onBackToSite }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem('red_adv_users');
      if (stored) {
        const parsed: UserAccount[] = JSON.parse(stored);
        return parsed.map((u) => {
          if (u.username === 'master_admin') {
            return { ...u, passwordHash: 'admin3256' };
          }
          return u;
        });
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('adv01');
  const [loginPassword, setLoginPassword] = useState('mudar1234');
  const [loginError, setLoginError] = useState('');

  // First Login Reset States (adv01 or newly created pending user)
  const [isFirstLoginPrompt, setIsFirstLoginPrompt] = useState(false);
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [securityValidation, setSecurityValidation] = useState(''); // CPF or OAB
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstLoginError, setFirstLoginError] = useState('');

  // CRM Data States
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem('red_adv_leads');
      return stored ? JSON.parse(stored) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [activeTab, setActiveTab] = useState<'kanban' | 'dashboard' | 'users' | 'new_lead'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('todas');
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<KanbanStatus | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New Lead Form in CRM
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadCpf, setNewLeadCpf] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadArea, setNewLeadArea] = useState(PRACTICE_AREAS[0].title);
  const [newLeadProcess, setNewLeadProcess] = useState('');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // New User Form in CRM
  const [newUsername, setNewUsername] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserCpfOab, setNewUserCpfOab] = useState('');
  const [newUserTempPass, setNewUserTempPass] = useState('mudar1234');
  const [userCreatedSuccess, setUserCreatedSuccess] = useState('');

  // Persist leads
  useEffect(() => {
    localStorage.setItem('red_adv_leads', JSON.stringify(leads));
  }, [leads]);

  // Persist users
  useEffect(() => {
    localStorage.setItem('red_adv_users', JSON.stringify(users));
  }, [users]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const found = users.find(
      (u) => u.username.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (!found) {
      setLoginError('Usuário não encontrado.');
      return;
    }

    if (found.passwordHash !== loginPassword) {
      setLoginError('Senha incorreta.');
      return;
    }

    // Check if first login required
    if (found.isFirstLogin) {
      setPendingUser(found);
      setIsFirstLoginPrompt(true);
      return;
    }

    // Regular Login
    setCurrentUser(found);
  };

  // Handle First Login Password Update & Verification
  const handleFirstLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFirstLoginError('');

    if (!pendingUser) return;

    if (!securityValidation.trim()) {
      setFirstLoginError('Informe seu CPF ou OAB para validação de segurança.');
      return;
    }

    if (newPassword.length < 6) {
      setFirstLoginError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFirstLoginError('A confirmação da senha não confere.');
      return;
    }

    // Update user record:
    // Regra OBRIGATÓRIA: Após salvar, usuário desaparece da lista de usuários visíveis
    const updatedUsers = users.map((u) => {
      if (u.username === pendingUser.username) {
        return {
          ...u,
          passwordHash: newPassword,
          isFirstLogin: false,
          visibleInList: false, // Regra: desaparece da lista após 1º acesso e troca
          cpfOrOab: securityValidation.trim(),
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    const activeUpdatedUser = updatedUsers.find((u) => u.username === pendingUser.username)!;
    setCurrentUser(activeUpdatedUser);
    setIsFirstLoginPrompt(false);
    setPendingUser(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsFirstLoginPrompt(false);
    setPendingUser(null);
    setLoginPassword('');
  };

  // Enhanced Drag and Drop Kanban with Automatic Timeline Recording
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverColumn !== columnId) {
      setDraggedOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverColumn(null);
  };

  const handleDrop = (targetStatus: KanbanStatus) => {
    if (!draggedLeadId) return;
    const leadToMove = leads.find((l) => l.id === draggedLeadId);
    if (!leadToMove) {
      setDraggedLeadId(null);
      setDraggedOverColumn(null);
      return;
    }

    if (leadToMove.status === targetStatus) {
      setDraggedLeadId(null);
      setDraggedOverColumn(null);
      return;
    }

    const prevLabel = KANBAN_COLUMNS.find((c) => c.id === leadToMove.status)?.label || leadToMove.status;
    const newLabel = KANBAN_COLUMNS.find((c) => c.id === targetStatus)?.label || targetStatus;

    const moveEvent = {
      id: `int-move-${Date.now()}`,
      type: 'internal' as const,
      title: 'Etapa Alterada no Kanban',
      description: `Cartão arrastado de "${prevLabel}" para "${newLabel}".`,
      date: new Date().toISOString(),
      author: currentUser?.name || 'Advogado Responsável',
    };

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === draggedLeadId) {
          const updated = {
            ...lead,
            status: targetStatus,
            updatedAt: new Date().toISOString(),
            interactions: [moveEvent, ...(lead.interactions || [])],
          };
          if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
    setDraggedLeadId(null);
    setDraggedOverColumn(null);
  };

  const handleMoveLeadDirectly = (leadId: string, targetStatus: KanbanStatus) => {
    const leadToMove = leads.find((l) => l.id === leadId);
    if (!leadToMove || leadToMove.status === targetStatus) return;

    const prevLabel = KANBAN_COLUMNS.find((c) => c.id === leadToMove.status)?.label || leadToMove.status;
    const newLabel = KANBAN_COLUMNS.find((c) => c.id === targetStatus)?.label || targetStatus;

    const moveEvent = {
      id: `int-move-${Date.now()}`,
      type: 'internal' as const,
      title: 'Etapa Alterada no Kanban',
      description: `Etapa alterada manualmente de "${prevLabel}" para "${newLabel}".`,
      date: new Date().toISOString(),
      author: currentUser?.name || 'Advogado Responsável',
    };

    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updated = {
            ...lead,
            status: targetStatus,
            updatedAt: new Date().toISOString(),
            interactions: [moveEvent, ...(lead.interactions || [])],
          };
          if (selectedLead && selectedLead.id === lead.id) {
            setSelectedLead(updated);
          }
          return updated;
        }
        return lead;
      })
    );
  };

  // Create new user inside CRM
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newUserName) return;

    const exists = users.some((u) => u.username.toLowerCase() === newUsername.trim().toLowerCase());
    if (exists) {
      setUserCreatedSuccess('Este nome de usuário já existe.');
      return;
    }

    const created: UserAccount = {
      username: newUsername.trim().toLowerCase(),
      name: newUserName.trim(),
      role: 'admin',
      cpfOrOab: newUserCpfOab.trim() || undefined,
      passwordHash: newUserTempPass || 'mudar1234',
      isFirstLogin: true, // Visível apenas até 1º acesso
      visibleInList: true, // Aparece até o primeiro acesso
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, created]);
    setUserCreatedSuccess(`Usuário ${created.username} criado com sucesso! Aparecerá na lista até seu primeiro acesso.`);
    setNewUsername('');
    setNewUserName('');
    setNewUserCpfOab('');
    setNewUserTempPass('mudar1234');
    setTimeout(() => setUserCreatedSuccess(''), 5000);
  };

  // Create lead manually
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;

    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadName.trim(),
      email: newLeadEmail.trim() || 'cliente@contato.com',
      cpf: newLeadCpf.trim() || 'Não informado',
      phone: newLeadPhone.trim(),
      practiceArea: newLeadArea,
      processNumber: newLeadProcess.trim() || undefined,
      notes: newLeadNotes.trim() || undefined,
      status: 'novo_lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLeads((prev) => [lead, ...prev]);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadCpf('');
    setNewLeadPhone('');
    setNewLeadProcess('');
    setNewLeadNotes('');
    setActiveTab('kanban');
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.processNumber && lead.processNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = filterArea === 'todas' || lead.practiceArea === filterArea;
    return matchesSearch && matchesArea;
  });

  // Calculate Dashboard Metrics
  const totalLeads = leads.length;
  const areaCounts = PRACTICE_AREAS.map((area) => ({
    name: area.title.split('&')[0].trim(),
    fullName: area.title,
    count: leads.filter((l) => l.practiceArea === area.title).length,
  }));

  const statusCounts = KANBAN_COLUMNS.map((col) => ({
    name: col.label.replace(/^[^\s]+\s/, ''),
    count: leads.filter((l) => l.status === col.id).length,
  }));

  // Regra de Usuários:
  // master_admin NUNCA aparece em nenhuma lista
  // Usuários com visibleInList === true aparecem (ex: adv01 antes do 1º acesso)
  const visibleUsersList = users.filter((u) => u.role !== 'master_admin' && u.visibleInList);

  // If NOT logged in, show Login or First-Access security screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          
          {/* Back button */}
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Site Público
          </button>

          {/* Login Box */}
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center font-serif text-xl font-bold text-slate-950 mx-auto shadow-md">
                RED
              </div>
              <h2 className="font-serif text-2xl font-bold text-white mt-3">
                Área do Advogado (CRM)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Acesso restrito para gestão de processos, leads e segurança
              </p>
            </div>

            {/* FIRST LOGIN SECURITY VALIDATION MODAL */}
            {isFirstLoginPrompt && pendingUser ? (
              <form onSubmit={handleFirstLoginSubmit} className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  <span className="font-bold block mb-1">⚠️ Primeiro Acesso Detectado ({pendingUser.username})</span>
                  Por segurança institucional, valide sua titularidade (CPF ou OAB) e cadastre sua nova senha definitiva.
                </div>

                {firstLoginError && (
                  <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                    {firstLoginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Validação Adicional: Seu CPF ou OAB *
                  </label>
                  <input
                    type="text"
                    required
                    value={securityValidation}
                    onChange={(e) => setSecurityValidation(e.target.value)}
                    placeholder="Ex: OAB/MG 111.989 ou CPF"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nova Senha Definitiva *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha segura"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm"
                >
                  Confirmar e Concluir Primeiro Acesso
                </button>
              </form>
            ) : (
              /* REGULAR LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Usuário
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Ex: adv01 ou master_admin"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl transition shadow-lg text-sm"
                >
                  Entrar no Sistema
                </button>

                {/* Helper info for testing credentials */}
                <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-semibold text-amber-400">Credenciais Iniciais Configuradas:</div>
                  <div>• <strong>Administrador:</strong> <code>adv01</code> | Senha: <code>mudar1234</code></div>
                  <div>• <strong>Master Admin:</strong> <code>master_admin</code> | Senha: <code>admin3256</code></div>
                </div>
              </form>
            )}

          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD / CRM
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Site</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs">
              RED
            </div>
            <div>
              <span className="font-bold text-sm text-white block">CRM RED Advogados</span>
              <span className="text-[10px] text-slate-400">
                Logado como: <strong>{currentUser.name}</strong> ({currentUser.role === 'master_admin' ? 'Master Admin' : 'Administrador'})
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls & Logout */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                activeTab === 'kanban' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kanban de Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dashboard ({totalLeads})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                activeTab === 'users' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Usuários & Acessos</span>
            </button>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 px-3 py-2 rounded-lg transition"
            title="Sair do Sistema"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        
        {/* ================= TAB 1: KANBAN DE LEADS ================= */}
        {activeTab === 'kanban' && (
          <div className="space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar lead por nome, telefone ou processo..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs rounded-lg py-2 px-3 text-slate-300 focus:outline-none"
                  >
                    <option value="todas">Todas as Áreas</option>
                    {PRACTICE_AREAS.map((a) => (
                      <option key={a.id} value={a.title}>{a.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('new_lead')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Lead</span>
              </button>
            </div>

            {/* Kanban Columns with Visual Drag and Drop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
              {KANBAN_COLUMNS.map((column) => {
                const columnLeads = filteredLeads.filter((l) => l.status === column.id);
                const isDragOverThis = draggedOverColumn === column.id;

                return (
                  <div
                    key={column.id}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(column.id);
                    }}
                    className={`rounded-xl border-t-4 ${column.color} border p-3 flex flex-col min-h-[540px] transition-all duration-200 shadow-lg ${
                      isDragOverThis
                        ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/50 scale-[1.01]'
                        : 'bg-slate-900/90 border-slate-800'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                      <span className="font-semibold text-xs text-white">{column.label}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${column.badgeBg}`}>
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Leads Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnLeads.length === 0 ? (
                        <div className={`text-center py-12 text-[11px] border border-dashed rounded-xl transition ${
                          isDragOverThis 
                            ? 'border-amber-400 text-amber-300 bg-amber-500/10' 
                            : 'border-slate-800 text-slate-500'
                        }`}>
                          {isDragOverThis ? 'Solte o lead aqui' : 'Arraste um lead para cá'}
                        </div>
                      ) : (
                        columnLeads.map((lead) => {
                          const interactionCount = lead.interactions?.length || 0;
                          const isBeingDragged = draggedLeadId === lead.id;

                          return (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead.id)}
                              onClick={() => setSelectedLead(lead)}
                              className={`bg-slate-950 p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing shadow-md group hover:border-amber-500/60 hover:shadow-amber-950/30 ${
                                isBeingDragged
                                  ? 'opacity-40 border-dashed border-amber-400 scale-95'
                                  : 'border-slate-800'
                              }`}
                            >
                              {/* Header: Name and Quick View Icon */}
                              <div className="flex items-start justify-between gap-1 mb-1.5">
                                <span className="font-bold text-xs text-slate-100 group-hover:text-amber-400 transition leading-snug">
                                  {lead.name}
                                </span>
                                <span className="text-[10px] text-slate-500 group-hover:text-amber-400 transition shrink-0 ml-1">
                                  Ver ➔
                                </span>
                              </div>

                              <div className="text-[11px] text-amber-400/90 font-medium truncate mb-2">
                                {lead.practiceArea}
                              </div>

                              <div className="space-y-1.5 text-[11px] text-slate-400">
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <a
                                    href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-emerald-400 font-mono"
                                  >
                                    {lead.phone}
                                  </a>
                                </div>

                                {lead.processNumber && (
                                  <div className="flex items-center gap-1.5 text-slate-300">
                                    <FileText className="w-3 h-3 text-amber-400 shrink-0" />
                                    <span className="truncate font-mono">{lead.processNumber}</span>
                                  </div>
                                )}
                              </div>

                              {/* Interactions Badge & Agenda Preview */}
                              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>{interactionCount} {interactionCount === 1 ? 'registro' : 'registros'} na agenda</span>
                                  </span>
                                </div>

                                {/* Quick stage changer & drag hint */}
                                <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500 pt-1">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-500">Mover:</span>
                                  <select
                                    value={lead.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleMoveLeadDirectly(lead.id, e.target.value as KanbanStatus);
                                    }}
                                    className="bg-slate-900 border border-slate-700/80 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:border-amber-400"
                                  >
                                    {KANBAN_COLUMNS.map((col) => (
                                      <option key={col.id} value={col.id}>
                                        {col.label.slice(0, 15)}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================= TAB 2: DASHBOARD DO ADMINISTRADOR ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 max-w-6xl mx-auto">
            
            {/* Top Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Total de Leads Recebidos
                  </span>
                  <div className="text-4xl font-serif font-bold text-amber-400 mt-2">
                    {totalLeads}
                  </div>
                  <span className="text-xs text-emerald-400 mt-1 block">
                    Atualizado em tempo real
                  </span>
                </div>
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <TrendingUp className="w-7 h-7" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Em Atendimento Ativo
                  </span>
                  <div className="text-4xl font-serif font-bold text-white mt-2">
                    {leads.filter((l) => l.status === 'em_atendimento' || l.status === 'agendado' || l.status === 'processo_andamento').length}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 block">
                    Casos em condução
                  </span>
                </div>
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Briefcase className="w-7 h-7" />
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Concluídos com Sucesso
                  </span>
                  <div className="text-4xl font-serif font-bold text-emerald-400 mt-2">
                    {leads.filter((l) => l.status === 'concluido').length}
                  </div>
                  <span className="text-xs text-emerald-400 mt-1 block">
                    {totalLeads > 0 ? Math.round((leads.filter((l) => l.status === 'concluido').length / totalLeads) * 100) : 0}% de conversão final
                  </span>
                </div>
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              </div>

            </div>

            {/* Recharts Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Volume de Leads por Etapa do Kanban */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  Volume de Leads por Etapa do Kanban
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusCounts}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Taxa de Conversão e Procura por Área de Atuação */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Distribuição por Área de Atuação
                </h3>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={areaCounts}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="count"
                      >
                        {areaCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_CHART[index % COLORS_CHART.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-[11px] text-slate-300">
                  {areaCounts.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS_CHART[i % COLORS_CHART.length] }}></span>
                      <span className="truncate">{a.name} ({a.count})</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB 3: GERENCIAMENTO DE USUÁRIOS ================= */}
        {activeTab === 'users' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* Rules Info Banner */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>Regras de Segurança e Privacidade de Usuários</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                <li><strong>master_admin:</strong> Nunca aparece em nenhuma lista ou relatório de usuários.</li>
                <li><strong>adv01 e Novos Usuários:</strong> Aparecem apenas como pendentes até o 1º acesso e alteração de senha.</li>
                <li><strong>Após alteração de senha:</strong> O usuário conclui seu ciclo e desaparece da lista de pendências.</li>
              </ul>
            </div>

            {/* Create New User */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Cadastrar Novo Usuário Administrador
              </h3>

              {userCreatedSuccess && (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 mb-4">
                  {userCreatedSuccess}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome Completo do Advogado/Operador
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ex: Dra. Juliana Fernandes"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome de Usuário (Login)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Ex: adv02"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CPF ou OAB (Para validação no 1º acesso)
                  </label>
                  <input
                    type="text"
                    value={newUserCpfOab}
                    onChange={(e) => setNewUserCpfOab(e.target.value)}
                    placeholder="Ex: OAB/MG 222.333"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Senha Provisória
                  </label>
                  <input
                    type="text"
                    value={newUserTempPass}
                    onChange={(e) => setNewUserTempPass(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition"
                  >
                    Salvar e Gerar Acesso Temporário
                  </button>
                </div>
              </form>
            </div>

            {/* List of Visible Users (Pending first login) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="font-serif text-lg font-bold text-white mb-4">
                Usuários Pendentes de 1º Acesso ({visibleUsersList.length})
              </h3>

              {visibleUsersList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                  Nenhum usuário provisório pendente. Todos os administradores ativos já realizaram o 1º acesso com troca de senha e encontram-se protegidos fora desta listagem conforme a regra de segurança.
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {visibleUsersList.map((u) => (
                    <div key={u.username} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-white block">{u.name}</span>
                        <span className="text-xs text-slate-400">
                          Usuário: <code>{u.username}</code> • Status: <span className="text-amber-400 font-medium">Aguardando troca de senha</span>
                        </span>
                      </div>
                      <span className="text-xs bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                        Provisório
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 4: MANUAL NEW LEAD MODAL ================= */}
        {activeTab === 'new_lead' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-white mb-2">
              Cadastrar Novo Lead Manualmente
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Insira as informações de atendimento telefônico ou presencial. O lead entrará diretamente na coluna "Novo Lead".
            </p>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="(31) 90000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="email@cliente.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={newLeadCpf}
                    onChange={(e) => setNewLeadCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nº do Processo (se houver)
                  </label>
                  <input
                    type="text"
                    value={newLeadProcess}
                    onChange={(e) => setNewLeadProcess(e.target.value)}
                    placeholder="Número ou PAD"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Área de Atuação
                </label>
                <select
                  value={newLeadArea}
                  onChange={(e) => setNewLeadArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {PRACTICE_AREAS.map((a) => (
                    <option key={a.id} value={a.title}>{a.title}</option>
                  ))}
                  <option value="Outro Assunto">Outro Assunto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Anotações / Resumo da Situação
                </label>
                <textarea
                  rows={3}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Detalhes anotados durante o atendimento..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-xs transition"
                >
                  Salvar Lead
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('kanban')}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Client Life History & Agenda Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          currentUserName={currentUser.name}
          onClose={() => setSelectedLead(null)}
          onUpdateLead={(updated) => {
            setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
            setSelectedLead(updated);
          }}
        />
      )}
    </div>
  );
};
