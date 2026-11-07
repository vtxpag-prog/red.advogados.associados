import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Download,
  Bell,
  Check,
  X,
  AlertTriangle
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
  { id: 'novo_lead', label: '🔵 Novo Lead', color: 'border-blue-500', badgeBg: 'bg-blue-100 text-blue-800 border border-blue-200' },
  { id: 'em_atendimento', label: '🟡 Em Atendimento', color: 'border-amber-500', badgeBg: 'bg-amber-100 text-amber-800 border border-amber-200' },
  { id: 'agendado', label: '🟢 Agendado', color: 'border-emerald-500', badgeBg: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  { id: 'processo_andamento', label: '🟣 Processo em Andamento', color: 'border-purple-500', badgeBg: 'bg-purple-100 text-purple-800 border border-purple-200' },
  { id: 'concluido', label: '🟠 Concluído', color: 'border-orange-500', badgeBg: 'bg-orange-100 text-orange-800 border border-orange-200' },
  { id: 'arquivado', label: '⚫ Arquivado', color: 'border-slate-400', badgeBg: 'bg-slate-200 text-slate-700 border border-slate-300' },
];

const COLORS_CHART = ['#d97706', '#2563eb', '#059669', '#7c3aed', '#db2777', '#475569'];

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

  // Notification Indicator States (Deadlines & Reminders)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'pending' | 'all'>('pending');
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Aggregate all upcoming deadlines, meetings and reminders across all leads
  const allNotifications = useMemo(() => {
    interface NotifItem {
      lead: Lead;
      interaction: NonNullable<Lead['interactions']>[number];
      dueDate?: string;
      isOverdue: boolean;
      dueLabel: string;
    }

    const list: NotifItem[] = [];
    const now = new Date();

    leads.forEach((l) => {
      (l.interactions || []).forEach((int) => {
        if (int.dueDate || int.type === 'deadline' || int.type === 'reminder') {
          let isOverdue = false;
          let dueLabel = 'Sem data limite';

          if (int.dueDate) {
            const due = new Date(int.dueDate);
            const diffMs = due.getTime() - now.getTime();
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            const dateStr = due.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const timeStr = due.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            if (diffMs < 0) {
              isOverdue = true;
              dueLabel = `Vencido (${dateStr} às ${timeStr})`;
            } else if (diffDays <= 0) {
              dueLabel = `Hoje às ${timeStr}`;
            } else if (diffDays === 1) {
              dueLabel = `Amanhã às ${timeStr}`;
            } else if (diffDays <= 7) {
              dueLabel = `Em ${diffDays} dias (${dateStr})`;
            } else {
              dueLabel = `${dateStr} às ${timeStr}`;
            }
          }

          list.push({
            lead: l,
            interaction: int,
            dueDate: int.dueDate,
            isOverdue,
            dueLabel,
          });
        }
      });
    });

    // Sort: pending first, then overdue, then closest due date
    return list.sort((a, b) => {
      if (!!a.interaction.isCompleted !== !!b.interaction.isCompleted) {
        return a.interaction.isCompleted ? 1 : -1;
      }
      if (a.isOverdue !== b.isOverdue) {
        return a.isOverdue ? -1 : 1;
      }
      const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999;
      const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999;
      return timeA - timeB;
    });
  }, [leads]);

  const pendingNotifications = useMemo(() => {
    return allNotifications.filter((n) => !n.interaction.isCompleted);
  }, [allNotifications]);

  const overdueCount = useMemo(() => {
    return pendingNotifications.filter((n) => n.isOverdue).length;
  }, [pendingNotifications]);

  // Toggle completion of deadline or reminder from notification list
  const handleToggleNotificationCompleted = (leadId: string, interactionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== leadId) return l;
        const updatedInts = (l.interactions || []).map((int) =>
          int.id === interactionId ? { ...int, isCompleted: !int.isCompleted } : int
        );
        return {
          ...l,
          updatedAt: new Date().toISOString(),
          interactions: updatedInts,
        };
      })
    );
  };

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

  // If NOT logged in, show Login or First-Access security screen (Light Executive Design)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          
          {/* Back button */}
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs text-slate-600 hover:text-amber-700 mb-6 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Site Público
          </button>

          {/* Login Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
            <div className="text-center mb-6">
              <img
                src="/assets/aistudio/emblema_RED_advocacia_v2.png"
                alt="Emblema RED Advocacia"
                className="w-16 h-16 object-contain mx-auto drop-shadow-md"
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-3">
                Área do Advogado (CRM)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Acesso restrito para gestão de processos, leads e segurança
              </p>
            </div>

            {/* FIRST LOGIN SECURITY VALIDATION MODAL */}
            {isFirstLoginPrompt && pendingUser ? (
              <form onSubmit={handleFirstLoginSubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <span className="font-bold block mb-1">⚠️ Primeiro Acesso Detectado ({pendingUser.username})</span>
                  Por segurança institucional, valide sua titularidade (CPF ou OAB) e cadastre sua nova senha definitiva.
                </div>

                {firstLoginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    {firstLoginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Validação Adicional: Seu CPF ou OAB *
                  </label>
                  <input
                    type="text"
                    required
                    value={securityValidation}
                    onChange={(e) => setSecurityValidation(e.target.value)}
                    placeholder="Ex: OAB/MG 111.989 ou CPF"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nova Senha Definitiva *
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nova senha segura"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirmar Nova Senha *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition text-sm shadow-md"
                >
                  Confirmar e Concluir Primeiro Acesso
                </button>
              </form>
            ) : (
              /* REGULAR LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Usuário
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Ex: adv01 ou master_admin"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Senha
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Sua senha"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl transition shadow-md text-sm"
                >
                  Entrar no Sistema
                </button>

                {/* Helper info for testing credentials */}
                <div className="mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-amber-700">Credenciais Iniciais Configuradas:</div>
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

  // LOGGED IN DASHBOARD / CRM (Clean Light Theme)
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 text-xs text-slate-700 hover:text-amber-800 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-300 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Voltar ao Site</span>
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/emblema_RED_advocacia_v2.png"
              alt="Emblema RED Advocacia"
              className="w-9 h-9 object-contain drop-shadow-xs shrink-0"
            />
            <div>
              <span className="font-bold text-sm text-slate-900 block leading-tight">CRM RED Advocacia</span>
              <span className="text-[11px] text-slate-500">
                Logado como: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role === 'master_admin' ? 'Master Admin' : 'Administrador'})
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls & Logout */}
        <div className="flex items-center gap-3">
          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                activeTab === 'kanban' 
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Kanban de Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                activeTab === 'dashboard' 
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Dashboard ({totalLeads})</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition ${
                activeTab === 'users' 
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Usuários & Acessos</span>
            </button>
          </nav>

          {/* Notification Indicator (Upcoming Deadlines & Reminders) */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showNotifications
                  ? 'bg-amber-100 text-amber-950 border-amber-300 shadow-xs'
                  : overdueCount > 0
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-300'
                    : pendingNotifications.length > 0
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Prazos processuais e lembretes cadastrados no histórico dos clientes"
            >
              <div className="relative flex items-center justify-center">
                <Bell className={`w-4 h-4 ${
                  overdueCount > 0 ? 'text-rose-600' : pendingNotifications.length > 0 ? 'text-amber-700' : 'text-slate-500'
                }`} />
                {pendingNotifications.length > 0 && (
                  <span className={`absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-xs ${
                    overdueCount > 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600'
                  }`}>
                    {pendingNotifications.length}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">
                {overdueCount > 0 
                  ? `${overdueCount} Prazo${overdueCount > 1 ? 's' : ''} Crítico${overdueCount > 1 ? 's' : ''}`
                  : `Lembretes (${pendingNotifications.length})`
                }
              </span>
            </button>

            {/* Notification Dropdown Popover */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Popover Header */}
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        Prazos & Lembretes da Equipe
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {pendingNotifications.length} pendente(s) • {allNotifications.length} no total
                      </span>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setNotificationFilter('pending')}
                      className={`px-2 py-0.5 rounded-md font-medium transition ${
                        notificationFilter === 'pending'
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Pendentes ({pendingNotifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotificationFilter('all')}
                      className={`px-2 py-0.5 rounded-md font-medium transition ${
                        notificationFilter === 'all'
                          ? 'bg-white text-slate-900 font-bold shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Todos ({allNotifications.length})
                    </button>
                  </div>
                </div>

                {/* Popover Items List */}
                <div className="p-2 overflow-y-auto divide-y divide-slate-100 max-h-[60vh]">
                  {(notificationFilter === 'pending' ? pendingNotifications : allNotifications).length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-bold text-slate-800">Nenhum prazo ou lembrete pendente!</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Todos os prazos e contatos agendados estão em dia.
                      </p>
                    </div>
                  ) : (
                    (notificationFilter === 'pending' ? pendingNotifications : allNotifications).map((item) => {
                      const isDeadline = item.interaction.type === 'deadline';

                      return (
                        <div
                          key={`${item.lead.id}-${item.interaction.id}`}
                          onClick={() => {
                            setSelectedLead(item.lead);
                            setShowNotifications(false);
                          }}
                          className={`p-3 rounded-xl hover:bg-slate-50 transition cursor-pointer group flex items-start gap-2.5 my-1 ${
                            item.interaction.isCompleted 
                              ? 'opacity-60 bg-slate-50/50' 
                              : item.isOverdue 
                                ? 'bg-rose-50/60 border border-rose-200' 
                                : 'bg-white'
                          }`}
                        >
                          {/* Toggle Done Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleNotificationCompleted(item.lead.id, item.interaction.id, e)}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                              item.interaction.isCompleted
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 hover:border-amber-600 bg-white'
                            }`}
                            title={item.interaction.isCompleted ? 'Reabrir prazo/lembrete' : 'Marcar como cumprido'}
                          >
                            {item.interaction.isCompleted && <Check className="w-3.5 h-3.5" />}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 truncate">
                                {item.lead.name}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                item.interaction.isCompleted
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.isOverdue
                                    ? 'bg-rose-100 text-rose-800 font-bold'
                                    : isDeadline
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-100 text-amber-800'
                              }`}>
                                {item.interaction.isCompleted ? '✓ Cumprido' : item.dueLabel}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-slate-900 group-hover:text-amber-800 transition line-clamp-1">
                              {item.interaction.title}
                            </p>

                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                              {item.interaction.description}
                            </p>

                            <div className="flex items-center justify-between pt-1.5 text-[10px] text-slate-400">
                              <span>Resp: <strong className="text-slate-600">{item.interaction.author}</strong></span>
                              <span className="text-amber-700 font-medium group-hover:underline flex items-center gap-0.5">
                                Ver ficha ➔
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Popover Footer */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 block">
                    Clique em qualquer item para abrir a ficha completa do cliente.
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-lg transition font-medium"
            title="Sair do Sistema"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
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
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar lead por nome, telefone ou processo..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="bg-slate-50 border border-slate-300 text-xs rounded-lg py-2 px-3 text-slate-800 focus:outline-none focus:border-amber-600"
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
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
                    className={`rounded-xl border-t-4 ${column.color} border p-3 flex flex-col min-h-[540px] transition-all duration-200 shadow-xs ${
                      isDragOverThis
                        ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 scale-[1.01]'
                        : 'bg-slate-200/60 border-slate-300/80'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-300/70 mb-3">
                      <span className="font-bold text-xs text-slate-900">{column.label}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${column.badgeBg}`}>
                        {columnLeads.length}
                      </span>
                    </div>

                    {/* Leads Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnLeads.length === 0 ? (
                        <div className={`text-center py-12 text-[11px] border border-dashed rounded-xl transition ${
                          isDragOverThis 
                            ? 'border-amber-500 text-amber-800 bg-amber-50 font-medium' 
                            : 'border-slate-300 text-slate-500'
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
                              className={`bg-white p-3.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing shadow-xs group hover:border-amber-400 hover:shadow-md ${
                                isBeingDragged
                                  ? 'opacity-40 border-dashed border-amber-500 scale-95'
                                  : 'border-slate-200'
                              }`}
                            >
                              {/* Header: Name and Quick View Icon */}
                              <div className="flex items-start justify-between gap-1 mb-1.5">
                                <span className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition leading-snug">
                                  {lead.name}
                                </span>
                                <span className="text-[10px] text-slate-400 group-hover:text-amber-700 transition shrink-0 ml-1 font-semibold">
                                  Ver ➔
                                </span>
                              </div>

                              <div className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 truncate mb-2 inline-block max-w-full">
                                {lead.practiceArea}
                              </div>

                              <div className="space-y-1.5 text-[11px] text-slate-600">
                                <div className="flex items-center gap-1.5">
                                  <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <a
                                    href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="hover:text-emerald-700 font-mono"
                                  >
                                    {lead.phone}
                                  </a>
                                </div>

                                {lead.processNumber && (
                                  <div className="flex items-center gap-1.5 text-slate-700">
                                    <FileText className="w-3 h-3 text-amber-600 shrink-0" />
                                    <span className="truncate font-mono bg-slate-100 px-1 rounded border border-slate-200">{lead.processNumber}</span>
                                  </div>
                                )}
                              </div>

                              {/* Interactions Badge & Agenda Preview */}
                              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>{interactionCount} {interactionCount === 1 ? 'registro' : 'registros'} na agenda</span>
                                  </span>
                                </div>

                                {/* Quick stage changer & drag hint */}
                                <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500 pt-1">
                                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Mover:</span>
                                  <select
                                    value={lead.status}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleMoveLeadDirectly(lead.id, e.target.value as KanbanStatus);
                                    }}
                                    className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-[10px] text-slate-700 focus:outline-none focus:border-amber-500"
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
              
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Total de Leads Recebidos
                  </span>
                  <div className="text-4xl font-serif font-bold text-amber-700 mt-2">
                    {totalLeads}
                  </div>
                  <span className="text-xs text-emerald-600 font-medium mt-1 block">
                    Atualizado em tempo real
                  </span>
                </div>
                <div className="w-14 h-14 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center text-amber-700">
                  <TrendingUp className="w-7 h-7" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Em Atendimento Ativo
                  </span>
                  <div className="text-4xl font-serif font-bold text-slate-900 mt-2">
                    {leads.filter((l) => l.status === 'em_atendimento' || l.status === 'agendado' || l.status === 'processo_andamento').length}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Casos em condução
                  </span>
                </div>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-center text-blue-600">
                  <Briefcase className="w-7 h-7" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Concluídos com Sucesso
                  </span>
                  <div className="text-4xl font-serif font-bold text-emerald-700 mt-2">
                    {leads.filter((l) => l.status === 'concluido').length}
                  </div>
                  <span className="text-xs text-emerald-600 font-medium mt-1 block">
                    {totalLeads > 0 ? Math.round((leads.filter((l) => l.status === 'concluido').length / totalLeads) * 100) : 0}% de conversão final
                  </span>
                </div>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              </div>

            </div>

            {/* Recharts Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Chart 1: Volume de Leads por Etapa do Kanban */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  Volume de Leads por Etapa do Kanban
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusCounts}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="#d97706" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Taxa de Conversão e Procura por Área de Atuação */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
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
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-[11px] text-slate-600">
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
            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <span>Regras de Segurança e Privacidade de Usuários</span>
              </div>
              <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                <li><strong>master_admin:</strong> Nunca aparece em nenhuma lista ou relatório de usuários.</li>
                <li><strong>adv01 e Novos Usuários:</strong> Aparecem apenas como pendentes até o 1º acesso e alteração de senha.</li>
                <li><strong>Após alteração de senha:</strong> O usuário conclui seu ciclo e desaparece da lista de pendências.</li>
              </ul>
            </div>

            {/* Create New User */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                Cadastrar Novo Usuário Administrador
              </h3>

              {userCreatedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 mb-4 font-medium">
                  {userCreatedSuccess}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo do Advogado/Operador
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ex: Dra. Juliana Fernandes"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome de Usuário (Login)
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Ex: adv02"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CPF ou OAB (Para validação no 1º acesso)
                  </label>
                  <input
                    type="text"
                    value={newUserCpfOab}
                    onChange={(e) => setNewUserCpfOab(e.target.value)}
                    placeholder="Ex: OAB/MG 222.333"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Senha Provisória
                  </label>
                  <input
                    type="text"
                    value={newUserTempPass}
                    onChange={(e) => setNewUserTempPass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition shadow-xs cursor-pointer"
                  >
                    Salvar e Gerar Acesso Temporário
                  </button>
                </div>
              </form>
            </div>

            {/* List of Visible Users (Pending first login) */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-4">
                Usuários Pendentes de 1º Acesso ({visibleUsersList.length})
              </h3>

              {visibleUsersList.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-300 rounded-xl">
                  Nenhum usuário provisório pendente. Todos os administradores ativos já realizaram o 1º acesso com troca de senha e encontram-se protegidos fora desta listagem conforme a regra de segurança.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {visibleUsersList.map((u) => (
                    <div key={u.username} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{u.name}</span>
                        <span className="text-xs text-slate-500">
                          Usuário: <code>{u.username}</code> • Status: <span className="text-amber-700 font-medium">Aguardando troca de senha</span>
                        </span>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200 font-medium">
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
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 p-8 rounded-2xl shadow-xs">
            <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
              Cadastrar Novo Lead Manualmente
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Insira as informações de atendimento telefônico ou presencial. O lead entrará diretamente na coluna "Novo Lead".
            </p>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    placeholder="(31) 90000-0000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    placeholder="email@cliente.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    value={newLeadCpf}
                    onChange={(e) => setNewLeadCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nº do Processo (se houver)
                  </label>
                  <input
                    type="text"
                    value={newLeadProcess}
                    onChange={(e) => setNewLeadProcess(e.target.value)}
                    placeholder="Número ou PAD"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Área de Atuação
                </label>
                <select
                  value={newLeadArea}
                  onChange={(e) => setNewLeadArea(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                >
                  {PRACTICE_AREAS.map((a) => (
                    <option key={a.id} value={a.title}>{a.title}</option>
                  ))}
                  <option value="Outro Assunto">Outro Assunto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Anotações / Resumo da Situação
                </label>
                <textarea
                  rows={3}
                  value={newLeadNotes}
                  onChange={(e) => setNewLeadNotes(e.target.value)}
                  placeholder="Detalhes anotados durante o atendimento..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-lg text-xs transition shadow-xs cursor-pointer"
                >
                  Salvar Lead
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('kanban')}
                  className="text-xs text-slate-500 hover:text-slate-800"
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
