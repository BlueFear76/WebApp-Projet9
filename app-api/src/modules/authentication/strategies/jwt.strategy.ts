// src/authentication/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 👈 Get JWT from Authorization Bearer token
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret_key', // 👈 Same secret as in JwtModule
    });
  }

  async validate(payload: any) {
    // 👇 This returns user info to be attached to req.user
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
