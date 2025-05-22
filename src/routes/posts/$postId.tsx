import db from "@/db";
import { PostCarousel } from "@/modules/posts/ui/components/carousel";
import { ClientOnly, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/$postId")({
  // TODO: loader - get post information and media, throw notFound if not found
  loader: async ({ params }) => {
    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, params.postId),
      with: {
        user: true,
        media: true,
        likes: true,
        comments: {
          with: {
            user: true,
          },
        },
      },
    });
    if (!post) {
      throw notFound();
    }
    return post;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const post = Route.useLoaderData();
  return (
    <div className="max-w-full w-4xl flex flex-col mx-auto items-center">
      <ClientOnly>
        <PostCarousel post={post} />
      </ClientOnly>
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </div>
  );
}
