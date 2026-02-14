import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RlsInterceptor implements NestInterceptor {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si l'utilisateur est authentifié, configurer le RLS
    if (user && user.id) {
      try {
        // Définir la variable PostgreSQL app.current_user_id pour cette requête
        await this.dataSource.query(
          `SELECT set_config('app.current_user_id', $1, false)`,
          [user.id],
        );
        console.log(`🔒 RLS configuré pour user ${user.id} (${user.email})`);
      } catch (error) {
        console.error('❌ Erreur lors de la configuration RLS:', error);
      }
    }

    return next.handle();
  }
}
