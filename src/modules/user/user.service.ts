import { UserEntity } from './entities/user.entity';
import { UserRepository } from './entities/user.repository';

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUser(userName: string): Promise<UserEntity> {
    return this.userRepo.getOneByUserName(userName);
  }
}
