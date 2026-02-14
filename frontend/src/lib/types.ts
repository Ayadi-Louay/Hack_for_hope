// Types pour l'application SafeGuard

export enum UserRole {
  DECLARANT = 'DECLARANT',
  PSYCHOLOGUE = 'PSYCHOLOGUE',
  RESPONSABLE_SOCIAL = 'RESPONSABLE_SOCIAL',
  DIRECTEUR_VILLAGE = 'DIRECTEUR_VILLAGE',
  DIRECTEUR_NATIONAL = 'DIRECTEUR_NATIONAL'
}

export enum IncidentType {
  VIOLENCE_PHYSIQUE = 'VIOLENCE_PHYSIQUE',
  ABUS_SEXUEL = 'ABUS_SEXUEL',
  NEGLIGENCE = 'NEGLIGENCE',
  VIOLENCE_PSYCHOLOGIQUE = 'VIOLENCE_PSYCHOLOGIQUE',
  EXPLOITATION = 'EXPLOITATION',
  AUTRE = 'AUTRE'
}

export enum UrgenceLevel {
  BAS = 'BAS',
  MOYEN = 'MOYEN',
  CRITIQUE = 'CRITIQUE'
}

export enum ClassificationStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  FAUX = 'FAUX',
  PRISE_EN_CHARGE = 'PRISE_EN_CHARGE',
  SAUVEGARDE = 'SAUVEGARDE'
}

export enum ProcessStatus {
  NOUVEAU = 'NOUVEAU',
  EN_COURS = 'EN_COURS',
  CLOTURE = 'CLOTURE'
}

export interface User {
  id: string;
  email: string;
  nom: string;
  role: UserRole;
  village?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Incident {
  id: number;
  type: IncidentType;
  urgence: UrgenceLevel;
  village: string;
  nomEnfant?: string;
  nomAbuseur?: string;
  description: string;
  isAnonymous: boolean;
  classification?: ClassificationStatus;
  status: ProcessStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  aiScore?: number;
  aiSentiment?: string;
  aiTags?: string[];
  aiSummary?: string;
  user?: User;
}

export interface CreateIncidentDto {
  type: IncidentType;
  urgence: UrgenceLevel;
  village: string;
  nomEnfant?: string;
  nomAbuseur?: string;
  description: string;
  isAnonymous: boolean;
}

export interface UpdateIncidentDto {
  classification?: ClassificationStatus;
  status?: ProcessStatus;
}

export interface ChecklistStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  fileUrl?: string;
  completedAt?: string;
  completedBy?: string;
}
