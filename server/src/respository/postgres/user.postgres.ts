import { getConnection, Repository } from 'typeorm';
import { Users } from '../../enteties';

class UserRepository extends Repository<Users> {
  async getUser(userInfo: any): Promise<Users> {
    return await Users.findOne(userInfo);
  }

  async getUserInfo(values: any) {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values(values)
        .returning('*')
        .execute();
      return result.raw[0];
    } catch (e) {
      if (e.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }
  }

  async updateUserInfo(userIdNum: number, password: string) {
    return await Users.update(
      { id: userIdNum },
      {
        password: password,
      },
    );
  }
}

export default new UserRepository();
