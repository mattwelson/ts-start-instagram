import db from "@/db";
import { router } from "@/trpc/init";
import { publicProcedure } from "@/trpc/init";
import { z } from "zod";

export const postsRouter = router({
  getPosts: publicProcedure
    .input(
      z.object({
        cursor: z.object({
          id: z.string().optional(),
        }),
        limit: z.number().optional().default(20),
        userId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      console.log("I'm a server side thing!");
      // TODO: use limit and cursor to make this an infinite query
      const { userId } = input;

      const posts = await db.query.posts.findMany({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        where: (posts, { eq }) => eq(posts.userId, userId),
        with: {
          media: true,
          user: true,
          likes: true,
          comments: {
            with: {
              user: true,
            },
          },
        },
      });

      return {
        posts,
      };
    }),
});
