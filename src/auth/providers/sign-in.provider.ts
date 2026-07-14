import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokenProvider } from './generate-token.provider';
import { SignInDto } from '../dto/sign-in.dto';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject userService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
     * Inject hashingProvider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject generateTokenProvider
     */
    private readonly generateTokenProvider: GenerateTokenProvider,
  ) {}

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmail(signInDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!user.password) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!signInDto.password) {
      throw new BadRequestException('Invalid credentials');
    }
    let isPasswordValid: boolean;
    try {
      isPasswordValid = await this.hashingProvider.verifyPassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: error instanceof Error ? error.message : String(error),
        },
      );
    }
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return await this.generateTokenProvider.generateToken(user);
  }
}
