import type { AppRouter } from "@/trpc";
import type { inferRouterOutputs } from "@trpc/server";

export function PostList({
  posts,
}: {
  posts: inferRouterOutputs<AppRouter>["posts"]["getPosts"]["posts"];
}) {
  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>{post.caption}</div>
      ))}
    </div>
  );
}
