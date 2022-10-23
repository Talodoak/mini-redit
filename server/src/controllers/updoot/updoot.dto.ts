import { Post } from '../../enteties';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field(() => Boolean)
  hasMore: boolean;
}
