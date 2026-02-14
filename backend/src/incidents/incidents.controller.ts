import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { ClassifyIncidentDto } from './dto/classify-incident.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('incidents')
@UseGuards(JwtAuthGuard)
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto, @CurrentUser() user: User) {
    return this.incidentsService.create(createIncidentDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.incidentsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.incidentsService.findOne(id, user);
  }

  @Patch(':id/classify')
  classify(
    @Param('id') id: string,
    @Body() classifyDto: ClassifyIncidentDto,
    @CurrentUser() user: User,
  ) {
    return this.incidentsService.classify(id, classifyDto, user);
  }
}
