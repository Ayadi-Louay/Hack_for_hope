import { IsEnum, IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { IncidentType, UrgencyLevel } from '../entities/incident.entity';

export class CreateIncidentDto {
  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @IsEnum(UrgencyLevel)
  @IsNotEmpty()
  urgence: UrgencyLevel;

  @IsString()
  @IsNotEmpty()
  village: string;

  @IsString()
  @IsOptional()
  nomEnfant?: string;

  @IsString()
  @IsOptional()
  nomAbuseur?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;
}
