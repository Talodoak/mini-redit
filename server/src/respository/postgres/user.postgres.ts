import { getConnection, Repository } from 'typeorm';
import { User } from '../../enteties';
import argon2 from 'argon2';

class UserRepository extends Repository<User> {
  async getUser(userInfo): Promise<User> {
    return await User.findOne(userInfo);
  }

  async getUserInfo(values): Promise<User> {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(values)
      .returning('*')
      .execute();
    return result.raw[0];
  }

  async updateUserInfo(userIdNum, password) {
    return await User.update(
      { id: userIdNum },
      {
        password: password,
      },
    );
  }
}

export default new UserRepository();
