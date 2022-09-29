import { Field, ObjectType } from "@nestjs/graphql";
import { Post } from "../post/post.enteties";

@ObjectType()
export class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}