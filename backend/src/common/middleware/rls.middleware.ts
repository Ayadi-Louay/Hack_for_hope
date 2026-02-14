import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RlsMiddleware implements NestMiddleware {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Si l'utilisateur est authentifié (récupéré par JWT Strategy dans req.user)
    if (req.user && (req.user as any).id) {
      const userId = (req.user as any).id;
      
      try {
        // Définir la variable PostgreSQL app.current_user_id pour cette session
        await this.dataSource.query(
          `SELECT set_config('app.current_user_id', $1, false)`,
          [userId],
        );
      } catch (error) {
        console.error('Erreur lors de la configuration RLS:', error);
      }
    }

    next();
  }
}
