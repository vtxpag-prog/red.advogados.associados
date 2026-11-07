export type KanbanStatus = 
  | 'novo_lead' 
  | 'em_atendimento' 
  | 'agendado' 
  | 'processo_andamento' 
  | 'concluido' 
  | 'arquivado';

export interface Interaction {
  id: string;
  type: 
    | 'whatsapp' 
    | 'call' 
    | 'meeting' 
    | 'protocol' 
    | 'hearing' 
    | 'document' 
    | 'internal'
    | 'deadline'
    | 'reminder';
  title: string;
  description: string;
  date: string;
  author: string;
  dueDate?: string;
  isCompleted?: boolean;
  priority?: 'high' | 'medium' | 'normal';
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  processNumber?: string;
  practiceArea: string;
  notes?: string;
  status: KanbanStatus;
  createdAt: string;
  updatedAt: string;
  interactions?: Interaction[];
}

export interface UserAccount {
  username: string;
  name: string;
  role: 'master_admin' | 'admin';
  cpfOrOab?: string;
  passwordHash: string;
  isFirstLogin: boolean;
  visibleInList: boolean;
  createdAt: string;
}

export interface WhatsAppScript {
  id: number;
  stage: string;
  title: string;
  sender: 'bot' | 'lawyer' | 'client';
  message: string;
  timing: string;
  iconName: string;
}

export interface PracticeAreaItem {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  commonProblems: string[];
  howWeHelp: string;
}
