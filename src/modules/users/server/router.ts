import db from "@/db";
import { publicProcedure } from "@/integrations/trpc/init";
import type { TRPCRouterRecord } from "@trpc/server";

export const usersRouter = ({
  getUsers: publicProcedure.query(async () => {
    const users = await db.query.users.findMany({
      limit: 20,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return users;
  }),
}) satisfies TRPCRouterRecord