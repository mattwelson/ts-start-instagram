import type { TRPCRouter } from "@/integrations/trpc/router";
import type { inferRouterOutputs } from "@trpc/server";
import { PostPreview } from "./post-preview";

export function PostList({
  posts,
}: {
  posts: inferRouterOutputs<TRPCRouter>["posts"]["getPosts"]["posts"];
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
      {posts.map((post) => (
          <PostPreview post={post} key={post.id} />
      ))}
    </div>
  );
}
