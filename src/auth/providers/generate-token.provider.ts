import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GenerateTokenProvider {
  constructor(
    /**
     * Inject jwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        expiresIn: expiresIn,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      },
    );
  }

  async generateToken(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      // Generate access token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessToken,
        { email: user.email },
      ),

      // Generate refresh Token
      this.signToken(user.id, this.jwtConfiguration.refreshToken),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
