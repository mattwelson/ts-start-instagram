import { HydrateClient } from "@/components/hydrate-client";
import { useTRPC } from "@/integrations/trpc/react";
import { PostCarousel } from "@/modules/posts/ui/components/carousel";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  // TODO: loader - get post information and media, throw notFound if not found
  component: RouteComponent,
  notFoundComponent: () => <div>POST NOT FOUND</div>,
});

function RouteComponent() {
  const {postId} = Route.useParams();
  const trpc = useTRPC()
  const {data: {post}} = useSuspenseQuery(trpc.posts.getPost.queryOptions({postId}))
  
  if (!post) {
    throw notFound()
  }

  return (
    <HydrateClient>
      <div className="max-w-full w-4xl flex flex-col mx-auto items-center">
        <PostCarousel post={post} />
        <pre>{JSON.stringify(post, null, 2)}</pre>
      </div>
    </HydrateClient>
  );
}
