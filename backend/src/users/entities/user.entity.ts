import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  DECLARANT = 'DECLARANT',
  PSYCHOLOGUE = 'PSYCHOLOGUE',
  RESPONSABLE_SOCIAL = 'RESPONSABLE_SOCIAL',
  DIRECTEUR_VILLAGE = 'DIRECTEUR_VILLAGE',
  DIRECTEUR_NATIONAL = 'DIRECTEUR_NATIONAL',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ name: 'village_assigned', nullable: true })
  villageAssigned: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
