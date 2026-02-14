import { IsEnum, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ClassificationType } from '../entities/incident.entity';

export class ClassifyIncidentDto {
  @IsEnum(ClassificationType)
  @IsNotEmpty()
  classification: ClassificationType;

  @IsString()
  @IsOptional()
  classificationComment?: string;
}
