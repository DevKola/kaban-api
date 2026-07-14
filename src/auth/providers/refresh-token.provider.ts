import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { GenerateTokenProvider } from './generate-token.provider';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class RefreshTokenProvider {
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

    /**
     * Inject UsersService
     */
    private readonly usersService: UsersService,

    /**
     * Inject generateTokenProvider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
      });
      const user = await this.usersService.findUserById(sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.generateTokenProvider.generateToken(user);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: error instanceof Error ? error.message : String(error),
        },
      );
    }
  }
}
