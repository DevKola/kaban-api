import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/sign-in
   * Authenticate and receive access + refresh tokens.
   */
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login successful',
  })
  @ResponseMessage('Login successful')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  /**
   * POST /auth/refresh-token
   * Exchange a valid refresh token for a new token pair.
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'New token issued' })
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
