
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';

const LIMIT = 60;           
const WINDOW_MS = 60_000;   

@Injectable()
export class RateLimitGuard implements CanActivate {
    private readonly hits = new Map<string, { count: number; resetAt: number }>();

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ?? req.ip;
        const now = Date.now();
        const entry = this.hits.get(ip);

        if (!entry || now > entry.resetAt) {
            this.hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
            return true;
        }
        if (++entry.count > LIMIT) {
            throw new HttpException('Demasiadas peticiones, intenta más tarde', HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
}