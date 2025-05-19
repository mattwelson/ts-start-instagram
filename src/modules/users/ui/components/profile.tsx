import type { User } from "@/db/schema";

export function UserProfile({
  user,
  meta: {
    followerCount,
    followingCount,
    postCount,
  } = {},
}: {
  user: User;
  meta?: {
    followerCount?: number;
    followingCount?: number;
    postCount?: number;
  }
}) {
  return (
    <div className="flex gap-4 flex-col items-center m-8 md: mt-16">
      <div className="flex gap-4 md:gap-8 items-center">
        <div>
          {user.avatarUrl && (
            <img src={user.avatarUrl} alt="" className="size-32 rounded-full" />
          )}
        </div>
        <div>
          <h1 className="font-bold text-lg">{user.fullName}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
          {user.bio && <p className="mt-2">{user.bio}</p>}
          {user.externalUrl && <p className="mt-2">{user.externalUrl}</p>}
        </div>
      </div>
      {followerCount !== undefined &&
        followingCount !== undefined &&
        postCount !== undefined && (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl">
                {followerCount}
              </div>
              <div className="text-muted-foreground">
                Followers
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl">
                {followingCount}
              </div>
              <div className="text-muted-foreground">
                Following
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold text-2xl">
                {postCount}
              </div>
              <div className="text-muted-foreground">
                Posts
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
