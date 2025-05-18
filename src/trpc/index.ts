import { postsRouter } from "@/modules/posts/server/router";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { router } from "./init";

export const appRouter = router({
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;

export const { TRPCProvider, useTRPC, useTRPCClient } =
  createTRPCContext<AppRouter>();
