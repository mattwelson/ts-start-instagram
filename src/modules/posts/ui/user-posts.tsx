
import { useTRPC } from "@/integrations/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PostList } from "./components/post-list";

// TODO: change this to an infinite query
// TODO: change this to use suspense
export function UserPosts({ userId }: { userId: string }) {
  const trpc = useTRPC();

  console.log("client!")

  const { data: posts } = useSuspenseQuery(
    trpc.posts.getPosts.queryOptions({
      userId,
      limit: 20,
      cursor: {},
    }),
  );

  return <PostList posts={posts?.posts ?? []} />;
}
