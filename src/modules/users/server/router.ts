import db from "@/db";
import { getUser } from "@/db/fetchers";
import { publicProcedure } from "@/integrations/trpc/init";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

export const usersRouter = ({
  getUsers: publicProcedure.query(async () => {
    const users = await db.query.users.findMany({
      limit: 20,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return users;
  }),
  getUser: publicProcedure.input(z.object({ username: z.string() })).query(async ({ input }) => {
    const { username } = input;
    return getUser(username);
  }),
}) satisfies TRPCRouterRecord