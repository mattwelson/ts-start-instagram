import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// TODO: add clerk id
export const users = pgTable(
  "users",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    username: varchar({ length: 50 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    fullName: varchar({ length: 100 }).notNull(),
    bio: text(),
    avatarUrl: text(),
    // URL to user's external profile or website (e.g., personal site, LinkedIn, etc.)
    externalUrl: text(),
    isVerified: boolean().notNull().default(false),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("users_username_idx").on(t.username)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  savedPosts: many(savedPosts),
  followedBy: many(follows, { relationName: "followedBy" }),
  following: many(follows, { relationName: "following" }),
}));

export const posts = pgTable(
  "posts",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    caption: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("posts_user_id_idx").on(t.userId)],
);

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  media: many(media),
  likes: many(likes),
  comments: many(comments),
}));

export const media = pgTable(
  "media",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    imageUrl: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("media_user_id_post_id_idx").on(t.userId, t.postId)],
);

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, {
    fields: [media.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [media.postId],
    references: [posts.id],
  }),
}));

export const likes = pgTable(
  "likes",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("likes_user_id_post_id_idx").on(t.userId, t.postId)],
);

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

// TODO: look into comment interactions (likes/replies/reactions/upvote/downvote/reports)
export const comments = pgTable(
  "comments",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    content: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("comments_user_id_post_id_idx").on(t.userId, t.postId)],
);

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));

// TODO: look into saved post lists, ordering, etc
export const savedPosts = pgTable(
  "saved_posts",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    postId: text()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [index("saved_posts_user_id_post_id_idx").on(t.userId, t.postId)],
);

export const savedPostsRelations = relations(savedPosts, ({ one }) => ({
  user: one(users, {
    fields: [savedPosts.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [savedPosts.postId],
    references: [posts.id],
  }),
}));

export const follows = pgTable(
  "follows",
  {
    id: text()
      .primaryKey()
      .$default(() => createId()),
    followerId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    followingId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
  (t) => [
    index("follows_follower_id_following_id_idx").on(
      t.followerId,
      t.followingId,
    ),
  ],
);

export const followsRelations = relations(follows, ({ one }) => ({
  followedBy: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "followedBy",
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}));
