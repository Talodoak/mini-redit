import { Repository } from 'typeorm';
import { Post } from '../../enteties';

class PostRepository extends Repository<Post> {
  async updateVotedPost(realValue: number, postId: number, userId: number) {
    return await pq.transaction(async (tm) => {
      await tm.query(
        `
    update updoot
    set value = $1
    where "postId" = $2 and "userId" = $3
        `,
        [realValue, postId, userId],
      );

      await tm.query(
        `
          update post
          set points = points + $1
          where id = $2
        `,
        [2 * realValue, postId],
      );
    });
  }

  async updateUnvotedPost(realValue: number, postId: number, userId: number) {
    return await pq.transaction(async (tm) => {
      await tm.query(
        `
    insert into updoot ("userId", "postId", value)
    values ($1, $2, $3)
        `,
        [userId, postId, realValue],
      );

      await tm.query(
        `
    update post
    set points = points + $1
    where id = $2
      `,
        [realValue, postId],
      );
    });
  }

  async getPost(cursor: string | null, replacements: any[]) {
    return await Post.query(
      `
    select p.*
    from post p
    ${cursor ? `where p."created_at" < $2` : ''}
    order by p."created_at" DESC
    limit $1
    `,
      replacements,
    );
  }

  // async getPostById(id: number) {
  //   return Post.findOne(id);
  // }

  async createPost(input: any, userId: any) {
    return Post.create({
      ...input,
      creatorId: userId,
    });
  }

  async updatePost(title: string, text: string, userId: number, id: number) {
    const result = await pq
      .createQueryBuilder()
      .update(Post)
      .set({ title, text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: userId,
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  async deletePost(id: number, userId: number) {
    return await Post.delete({ id, creatorId: userId });
  }
}

export default new PostRepository();
