import {
    CONTEXT,
    ResolveField,
    Args,
    Int,
    Mutation,
    Query,
    Resolver,
    Root,
} from "@nestjs/graphql";
import { getConnection } from "typeorm";
import { Post } from "./post.enteties";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { PaginatedPosts } from "../updoot/updoot.resolver";
import { PostInput } from "./inputs/post.input";

@Resolver(Post)
export class PostResolver {
    @ResolveField(() => String)
    textSnippet(@Root() post: Post) {
        return post.text.slice(0, 50);
    }

    @ResolveField(() => User)
    creator(@Root() post: Post, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(post.creatorId);
    }

    @ResolveField(() => Int, { nullable: true })
    async voteStatus(
        @Root() post: Post,
        @Ctx() { updootLoader, req }: MyContext
    ) {
        if (!req.session.userId) {
            return null;
        }

        const updoot = await updootLoader.load({
            postId: post.id,
            userId: req.session.userId,
        });

        return updoot ? updoot.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Args("postId", {type: () => Int}) postId: number,
        @Args("value", {type: () => Int}) value: number,
        @CONTEXT() { req }: MyContext
    ) {
        const isUpdoot = value !== -1;
        const realValue = isUpdoot ? 1 : -1;
        const { userId } = req.session;

        const updoot = await Updoot.findOne({ where: { postId, userId } });

        // the user has voted on the post before
        // and they are changing their vote
        if (updoot && updoot.value !== realValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
    update updoot
    set value = $1
    where "postId" = $2 and "userId" = $3
        `,
                    [realValue, postId, userId]
                );

                await tm.query(
                    `
          update post
          set points = points + $1
          where id = $2
        `,
                    [2 * realValue, postId]
                );
            });
        } else if (!updoot) {
            // has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
    insert into updoot ("userId", "postId", value)
    values ($1, $2, $3)
        `,
                    [userId, postId, realValue]
                );

                await tm.query(
                    `
    update post
    set points = points + $1
    where id = $2
      `,
                    [realValue, postId]
                );
            });
        }
        return true;
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Args("limit", {type: () => Int}) limit: number,
        @Args("cursor", {type: () => String, nullable: true}) cursor: string | null
    ): Promise<PaginatedPosts> {
        // 20 -> 21
        const realLimit = Math.min(50, limit);
        const reaLimitPlusOne = realLimit + 1;

        const replacements: any[] = [reaLimitPlusOne];

        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const posts = await getConnection().query(
            `
    select p.*
    from post p
    ${cursor ? `where p."createdAt" < $2` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
            replacements
        );

        // const qb = getConnection()
        //   .getRepository(Post)
        //   .createQueryBuilder("p")
        //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
        //   .orderBy('p."createdAt"', "DESC")
        //   .take(reaLimitPlusOne);

        // if (cursor) {
        //   qb.where('p."createdAt" < :cursor', {
        //     cursor: new Date(parseInt(cursor)),
        //   });
        // }

        // const posts = await qb.getMany();
        // console.log("posts: ", posts);

        return {
            posts: posts.slice(0, realLimit),
            hasMore: posts.length === reaLimitPlusOne,
        };
    }

    @Query(() => Post, { nullable: true })
    post(@Args("id", {type: () => Int}) id: number): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    // @UseMiddleware(isAuth)
    async createPost(
        @Args("input") input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {
        return Post.create({
            ...input,
            creatorId: req.session.userId,
        }).save();
    }

    @Mutation(() => Post, { nullable: true })
    // @UseMiddleware(isAuth)
    async updatePost(
        @Args("id", {type: () => Int}) id: number,
        @Args("title") title: string,
        @Args("text") text: string,
        @Ctx() { req }: MyContext
    ): Promise<Post | null> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Post)
            .set({ title, text })
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session.userId,
            })
            .returning("*")
            .execute();

        return result.raw[0];
    }

    @Mutation(() => Boolean)
    // @UseMiddleware(isAuth)
    async deletePost(
        @Args("id", {type: () => Int}) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        // not cascade way
        // const post = await Post.findOne(id);
        // if (!post) {
        //   return false;
        // }
        // if (post.creatorId !== req.session.userId) {
        //   throw new Error("not authorized");
        // }

        // await Updoot.delete({ postId: id });
        // await Post.delete({ id });

        await Post.delete({ id, creatorId: req.session.userId });
        return true;
    }
}