import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly createUserProvider: CreateUserProvider,

    private readonly findByEmailProvider: FindUserByEmailProvider,
  ) {}

  /**
   * Checks email uniqueness then persists the new user.
   * Throws ConflictException if the email is already taken.
   */
  async create(dto: CreateUserDto): Promise<User> {
    return await this.createUserProvider.signUp(dto);
  }

  /**
   * Look up a user by email.
   * Note: passwordHash is excluded by default (select: false on the column).
   * Use addSelect when you need to verify credentials.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findByEmailProvider.findByEmail(email);
  }

  async findUserById(id: string): Promise<User | null> {
    let user: User | null;
    try {
      user = await this.userRepository.findOneBy({ id: id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: error instanceof Error ? error.message : String(error),
        },
      );
    }

    if (user == null) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
