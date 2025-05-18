import db from "@/db";
import { follows, posts } from "@/db/schema";
import { UserPosts } from "@/modules/posts/ui/user-posts";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/$username")({
  component: UserPage,
  // TODO: build a proper user not found skeleton
  notFoundComponent: () => <div>User not found</div>,
  loader: async ({ params }) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, params.username),
    });

    if (!user) throw notFound();

    // TODO: add trpc router prefetch posts at this point

    const followingCount = await db.$count(
      follows,
      eq(follows.followingId, user.id),
    );

    const followerCount = await db.$count(
      follows,
      eq(follows.followerId, user.id),
    );

    const postCount = await db.$count(posts, eq(posts.userId, user.id));

    return { user, followingCount, followerCount, postCount };
  },
});

function UserPage() {
  const { user, followingCount, followerCount, postCount } =
    Route.useLoaderData();

  // TODO: find the categories users posts are in?

  return (
    <div>
      <div>
        {user.avatarUrl && (
          <img src={user.avatarUrl} alt="" className="size-32 rounded-full" />
        )}
      </div>
      <div>
        <h1>{user.fullName}</h1>
        <p>{user.username}</p>
        {user.bio && <p>{user.bio}</p>}
        {user.externalUrl && <p>{user.externalUrl}</p>}
      </div>
      <div>
        <p>
          {followerCount} followers, {followingCount} following, {postCount}{" "}
          posts
        </p>
      </div>
      <div>
        <UserPosts userId={user.id} />
      </div>
    </div>
  );
}
