import db from "@/db";
import { publicProcedure } from "@/integrations/trpc/init";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

export const postsRouter = {
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
    }),getPost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { postId } = input;

      const post = await db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, postId),
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
        post,
      };
    }),
} satisfies TRPCRouterRecord
