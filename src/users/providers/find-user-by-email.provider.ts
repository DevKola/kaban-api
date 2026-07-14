import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    /**
     * Inject userRepository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    let user: User | null;

    try {
      user = await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: error instanceof Error ? error.message : String(error),
        },
      );
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
