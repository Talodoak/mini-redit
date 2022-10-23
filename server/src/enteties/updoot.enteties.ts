import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from 'typeorm';
import { Users } from './user.enteties';
import { Post } from './post.enteties';

@Entity()
export class Updoot extends BaseEntity {
  @Column({ type: 'int' })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => Users, (user) => user.updoots)
  user: Users;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.updoots, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
