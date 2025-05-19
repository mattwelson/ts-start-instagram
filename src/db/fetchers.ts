import db from "@/db"
import { eq } from "drizzle-orm"
import { follows, posts } from "./schema"

export async function getUser(username: string) {
    const user = await db.query.users.findFirst({
        where: (users, {eq}) => eq(users.username, username)
    })
    if (!user) {
        return undefined
    }

    const followingCount = await db.$count(
        follows,
        eq(follows.followingId, user.id),
      );
  
      const followerCount = await db.$count(
        follows,
        eq(follows.followerId, user.id),
      );
  
      const postCount = await db.$count(posts, eq(posts.userId, user.id));
  
    return {user, meta: {followingCount, followerCount, postCount}}
}