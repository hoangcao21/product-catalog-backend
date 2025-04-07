import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserModel } from 'src/modules/user/entities/user.repository';

import { BaseBuilder } from './base.builder';

export class UserEntityBuilder extends BaseBuilder<UserEntity> {
  protected object: Partial<UserEntity> = {};

  buildUserId(value: string) {
    this.object.userId = value;

    return this;
  }

  buildUserName(value: string) {
    this.object.userName = value;

    return this;
  }

  buildHashedPassword(value: string) {
    this.object.hashedPassword = value;

    return this;
  }

  getResult: () => UserEntity = () => {
    console.log('UserEntityBuilder.object ', { object: this.object });

    return new UserModel(this.object);
  };
}
