import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

export interface User {
  id: number;
  userId: string;
  email: string;
  provider: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    // Authorization 헤더 확인
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is missing or invalid');
    }

    // Bearer 토큰 추출
    const token = authHeader.split(' ')[1];
    console.log('token >>', token);
    try {
      // 토큰 검증 및 디코딩
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'defaultSecret',
      });

      req.user = decoded;

      next();
    } catch (error) {
      console.error('Invalid JWT token:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
