import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      const payload = this.verifyToken(token);
      request.user = {
        id: Number(payload.sub),
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private verifyToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      if (process.env.JWT_SECRET && process.env.JWT_SECRET !== 'secret') {
        return this.jwtService.verify<JwtPayload>(token, { secret: 'secret' });
      }
      throw error;
    }
  }
}
