import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Incident, IncidentStatus, ClassificationType } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { ClassifyIncidentDto } from './dto/classify-incident.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  private async setRlsContext(userId: string) {
    await this.dataSource.query(
      `SELECT set_config('app.current_user_id', $1, false)`,
      [userId],
    );
    console.log(`🔒 RLS contexte défini pour userId: ${userId}`);
  }

  async create(createIncidentDto: CreateIncidentDto, user: User): Promise<Incident> {
    await this.setRlsContext(user.id);
    
    const incident = this.incidentsRepository.create({
      ...createIncidentDto,
      declarantId: createIncidentDto.isAnonymous ? null : user.id,
      analysteId: null, // Sera assigné plus tard
    });

    return this.incidentsRepository.save(incident);
  }

  async findAll(user: User): Promise<Incident[]> {
    await this.setRlsContext(user.id);
    
    // RLS filtre automatiquement selon le rôle/village de l'utilisateur
    return this.incidentsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['declarant'],
    });
  }

  async findOne(id: string, user: User): Promise<Incident> {
    await this.setRlsContext(user.id);
    
    const incident = await this.incidentsRepository.findOne({
      where: { id },
      relations: ['declarant'],
    });

    if (!incident) {
      throw new NotFoundException(`Incident ${id} non trouvé`);
    }

    return incident;
  }

  async classify(id: string, classifyDto: ClassifyIncidentDto, user: User): Promise<Incident> {
    await this.setRlsContext(user.id);
    
    // Seuls PSYCHOLOGUE, RESPONSABLE_SOCIAL, DIRECTEUR_VILLAGE, DIRECTEUR_NATIONAL peuvent classifier
    const allowedRoles = [
      UserRole.PSYCHOLOGUE,
      UserRole.RESPONSABLE_SOCIAL,
      UserRole.DIRECTEUR_VILLAGE,
      UserRole.DIRECTEUR_NATIONAL,
    ];

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Vous n\'avez pas le droit de classifier les incidents');
    }

    const incident = await this.findOne(id, user);

    incident.classification = classifyDto.classification;
    incident.classificationComment = classifyDto.classificationComment;
    incident.classifiedBy = user.id;
    incident.classifiedAt = new Date();

    // Mettre à jour le statut selon la classification
    switch (classifyDto.classification) {
      case ClassificationType.FAUX:
        incident.status = IncidentStatus.FAUX;
        break;
      case ClassificationType.PRISE_EN_CHARGE:
        incident.status = IncidentStatus.PRISE_EN_CHARGE;
        break;
      case ClassificationType.SAUVEGARDE:
        incident.status = IncidentStatus.SAUVEGARDE;
        break;
    }

    return this.incidentsRepository.save(incident);
  }
}
