import { UserPosts } from "@/modules/posts/ui/user-posts";
import { UserProfile } from "@/modules/users/ui/components/profile";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/$username")({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient, trpc } }) => {
    const userAndMeta = await queryClient.fetchQuery(trpc.users.getUser.queryOptions({
      username: params.username,
    }));
    if (!userAndMeta) {
      throw notFound();
    }
    void queryClient.prefetchQuery(
      trpc.posts.getPosts.queryOptions({
        userId: userAndMeta.user.id,
        cursor: {},
        limit: 20,
      }),
    );
    return userAndMeta;
  },
  notFoundComponent: () => <div>USER NOT FOUND</div>,
});

function RouteComponent() {
  const { user, meta } = Route.useLoaderData();
  return (
    <div>
      <Outlet />
      <UserProfile user={user} meta={meta} />
      <div>
        <UserPosts userId={user.id} />
      </div>
    </div>
  );
}
