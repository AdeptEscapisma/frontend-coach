import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { UserSchema, User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserSchema)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ login });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }
}
