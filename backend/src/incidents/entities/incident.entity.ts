import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum IncidentType {
  MALTRAITANCE = 'MALTRAITANCE',
  SANTE = 'SANTE',
  COMPORTEMENT = 'COMPORTEMENT',
  CONFLIT = 'CONFLIT',
  AUTRE = 'AUTRE',
}

export enum UrgencyLevel {
  FAIBLE = 'FAIBLE',
  MOYEN = 'MOYEN',
  ELEVE = 'ELEVE',
  CRITIQUE = 'CRITIQUE',
}

export enum IncidentStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  FAUX = 'FAUX',
  PRISE_EN_CHARGE = 'PRISE_EN_CHARGE',
  SAUVEGARDE = 'SAUVEGARDE',
  EN_PROCEDURE = 'EN_PROCEDURE',
  CLOTURE = 'CLOTURE',
}

export enum ClassificationType {
  NON_CLASSIFIE = 'NON_CLASSIFIE',
  FAUX = 'FAUX',
  PRISE_EN_CHARGE = 'PRISE_EN_CHARGE',
  SAUVEGARDE = 'SAUVEGARDE',
}

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'declarant_id', nullable: true })
  declarantId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'declarant_id' })
  declarant: User;

  @Column({ name: 'is_anonymous', default: false })
  isAnonymous: boolean;

  @Column({
    type: 'enum',
    enum: IncidentType,
  })
  type: IncidentType;

  @Column({
    type: 'enum',
    enum: UrgencyLevel,
  })
  urgence: UrgencyLevel;

  @Column()
  village: string;

  @Column({ name: 'nom_abuseur', nullable: true })
  nomAbuseur: string;

  @Column({ name: 'nom_enfant', nullable: true })
  nomEnfant: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ClassificationType,
    default: ClassificationType.NON_CLASSIFIE,
  })
  classification: ClassificationType;

  @Column({ name: 'classification_comment', type: 'text', nullable: true })
  classificationComment: string;

  @Column({ name: 'classified_by', nullable: true })
  classifiedBy: string;

  @Column({ name: 'classified_at', type: 'timestamp', nullable: true })
  classifiedAt: Date;

  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.EN_ATTENTE,
  })
  status: IncidentStatus;

  @Column({ name: 'analyste_id', nullable: true })
  analysteId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
