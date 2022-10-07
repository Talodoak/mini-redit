import DataLoader from 'dataloader';
import { Updoot, User } from '../enteties';

class Loaders {
  updootLoader() {
    return new DataLoader<{ postId: number; userId: number }, Updoot | null>(
      async (keys) => {
        const updoots = await Updoot.findByIds(keys as any);
        const updootIdsToUpdoot: Record<string, Updoot> = {};
        updoots.forEach((updoot) => {
          updootIdsToUpdoot[`${updoot.userId}|${updoot.postId}`] = updoot;
        });

        return keys.map(
          (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`],
        );
      },
    );
  }

  userLoader() {
    return new DataLoader<number, User>(async (userIds) => {
      const users = await User.findByIds(userIds as number[]);
      const userIdToUser: Record<number, User> = {};
      users.forEach((u) => {
        userIdToUser[u.id] = u;
      });

      const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
      return sortedUsers;
    });
  }
}

export default new Loaders();
