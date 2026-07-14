import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly hashingProvider: HashingProvider,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    let existingUser: User | null = null;

    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: error instanceof Error ? error.message : String(error),
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException('User with email already exists');
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later',
        {
          description: error instanceof Error ? error.message : String(error),
        },
      );
    }

    return newUser;
  }
}
