import { postsRouter } from "@/modules/posts/server/router";
import { router } from "./init";

export const appRouter = router({
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
