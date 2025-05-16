import { reset, seed } from "drizzle-seed";
import "dotenv/config";
import db from "@/db";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

async function main() {
  try {
    console.log("Removing old data 🗑️");
    await reset(db, schema);

    console.log("Seeding 🌱🚿");
    await seed(db, schema).refine((f) => ({
      users: {
        count: 20,
        columns: {
          email: f.email(),
          fullName: f.fullName(),
          isVerified: f.weightedRandom([
            { weight: 0.3, value: f.default({ defaultValue: false }) },
            { weight: 0.7, value: f.default({ defaultValue: true }) },
          ]),
        },
        with: {
          posts: [
            {
              weight: 0.3,
              count: 1,
            },
            {
              weight: 0.3,
              count: [1, 2, 3, 4, 5],
            },
            {
              weight: 0.2,
              count: [10, 15, 20, 25, 30],
            },
            {
              weight: 0.1,
              count: [50, 60, 70, 80, 90, 100],
            },
            {
              weight: 0.1,
              count: [100, 200, 300],
            },
          ],
          follows: [
            { weight: 0.5, count: [1, 2, 3, 4, 5] },
            { weight: 0.5, count: [10, 15, 20, 25, 30] },
          ],
        },
      },
      posts: {
        columns: {
          caption: f.string(),
        },
        with: {
          media: [
            {
              weight: 0.5,
              count: 1,
            },
            {
              weight: 0.3,
              count: [2, 3, 4, 5],
            },
            {
              weight: 0.2,
              count: [6, 7, 8, 9, 10],
            },
          ],
        },
      },
      likes: {
        count: 200,
      },
      comments: { count: 100 },
    }));

    console.log("Database seeded successfully! 🎉");
    console.log("Enhancing User data 👥");

    const users = await db.select().from(schema.users);
    const enhancedUsers = users.map((user) => {
      const name = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };
      return {
        ...user,
        fullName: faker.internet.displayName(name),
        username: faker.internet.username(name),
        email: faker.internet.email(name),
        bio: Math.random() > 0.7 ? faker.person.bio() : null,
        avatarUrl: faker.image.avatar(),
        externalUrl: Math.random() > 0.7 ? faker.internet.url() : null,
      };
    });

    await Promise.all(
      enhancedUsers.map((user) =>
        db.update(schema.users).set(user).where(eq(schema.users.id, user.id)),
      ),
    );

    console.log("User data enhanced successfully! 🎉");
    console.log("Enhancing Media data 🏞️");

    const media = await db.select().from(schema.media);
    const enhancedMedia = media.map((media) => {
      return {
        ...media,
        imageUrl: faker.image.url(),
      };
    });

    // TODO: introduce batch here
    await Promise.all(
      enhancedMedia.map((media) =>
        db.update(schema.media).set(media).where(eq(schema.media.id, media.id)),
      ),
    );

    console.log("Media data enhanced successfully! 🎉");

    console.log("Seed complete 🌲");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
