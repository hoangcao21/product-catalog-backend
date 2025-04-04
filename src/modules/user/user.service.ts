import { UserEntity } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserByUserName(userName: string): Promise<UserEntity> {
    return this.userRepo.findOneByUserName(userName);
  }

  async getUserById(userId: string): Promise<UserEntity> {
    return this.userRepo.findOneByUserId(userId);
  }
}
