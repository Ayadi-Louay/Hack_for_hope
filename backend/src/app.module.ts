// 📦 MODULE PRINCIPAL
// Configure tous les modules de l'application

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { IncidentsModule } from './incidents/incidents.module';
import { RlsInterceptor } from './common/interceptors/rls.interceptor';

@Module({
  imports: [
    // Configuration des variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,  // Variables accessibles partout
    }),

    // Configuration TypeORM (connexion PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: 'app_user',  // Utilisateur applicatif pour que RLS s'applique
      password: 'app_password_2026',
      database: process.env.DB_NAME || 'hackforhope_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,  // ⚠️ false car on utilise init.sql
      logging: true,       // Logs SQL pour debug
    }),

    // Modules fonctionnels
    AuthModule,
    IncidentsModule,
  ],
  providers: [
    // Intercepteur global pour configurer RLS après authentification
    {
      provide: APP_INTERCEPTOR,
      useClass: RlsInterceptor,
    },
  ],
})
export class AppModule {}

