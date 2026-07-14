import { Injectable } from '@nestjs/common';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenProvider } from './providers/refresh-token.provider';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  /**
   * Validate credentials and return access + refresh tokens.
   */
  async signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  /**
   * Verify a refresh token and issue a new token pair.
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
