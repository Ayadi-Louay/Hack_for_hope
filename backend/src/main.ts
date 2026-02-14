// 🚀 POINT D'ENTRÉE DU BACKEND
// Fichier principal qui démarre l'application NestJS

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // Créer l'application NestJS
  const app = await NestFactory.create(AppModule);

  // ✅ CORS : Autoriser les requêtes depuis le frontend (ports 3000, 3002)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://frontend:3000'],
    credentials: true,
  });

  // ✅ VALIDATION : Valider automatiquement les données entrantes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,      // Retire les propriétés non définies dans les DTOs
      forbidNonWhitelisted: true,  // Rejette les requêtes avec propriétés inconnues
      transform: true,      // Transforme automatiquement les types
    }),
  );

  // Préfixe global pour toutes les routes : /api
  app.setGlobalPrefix('api');

  // Démarrer le serveur sur le port 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Backend démarré sur : http://localhost:${port}`);
  console.log(`📚 Routes disponibles sur : http://localhost:${port}/api`);
}

bootstrap();
