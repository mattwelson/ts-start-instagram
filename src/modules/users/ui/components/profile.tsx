import type { User } from "@/db/schema";

export function UserProfile({
  user,
  followerCount,
  followingCount,
  postCount,
}: {
  user: User;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex justify-between gap-4">
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
          <div>
            <p>
              {followerCount} followers, {followingCount} following, {postCount}
              posts
            </p>
          </div>
        )}
    </div>
  );
}
