import * as dynamoose from 'dynamoose';
import { Repository } from 'src/shared/database/repository';

import { UserEntity } from './user.entity';

const UserNameGlobalIndex = {
  type: 'global',
  name: 'userNameGlobalIndex',
  project: true,
  rangeKey: 'userId',
};

const UserModelSchema = new dynamoose.Schema({
  userId: {
    type: String,
    hashKey: true,
    default: () => crypto.randomUUID(),
  },
  userName: {
    type: String,
    required: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    index: UserNameGlobalIndex as any,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
});

export const UserModel = dynamoose.model<UserEntity>('User', UserModelSchema);

export async function createUserTable() {
  console.log('🔃 Creating/Updating UserTable');

  // Create if not existing, else update
  await new dynamoose.Table('UserTable', [UserModel], {
    initialize: false,
  }).initialize();

  console.log('✅ UserTable is existing');
}

export class UserRepository extends Repository<UserEntity> {
  constructor() {
    super(UserModel);
  }

  async findOneByUserName(userName: string): Promise<UserEntity> {
    const userEntities = await this.model
      .query('userName')
      .using(UserNameGlobalIndex.name)
      .eq(userName)
      .exec();

    return userEntities?.length ? userEntities[0] : null;
  }

  async findOneByUserId(userId: string): Promise<UserEntity> {
    const userEntities = await this.model.query('userId').eq(userId).exec();

    return userEntities?.length ? userEntities[0] : null;
  }
}
