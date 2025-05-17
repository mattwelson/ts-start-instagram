import { reset, seed } from "drizzle-seed";
import "dotenv/config";
import db from "@/db";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const EXTERNAL_URL_PROBABILITY = 0.3;

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
              weight: 0.2,
              count: [50, 60, 70, 80],
            },
          ],
          follows: [
            { weight: 0.5, count: [1, 2, 3, 4, 5] },
            { weight: 0.5, count: [10, 15] },
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
      categories: {
        columns: {
          name: f.valuesFromArray({
            isUnique: true,
            values: [
              "people",
              "nature",
              "city",
              "food",
              "fashion",
              "sports",
              "travel",
              "health",
              "music",
              "technology",
            ],
          }),
        },
      },
    }));

    console.log("Database seeded successfully! 🎉");
    console.log("Enhancing User data 👥");

    const users = await db.query.users.findMany({
      columns: { id: true },
    });
    const enhancedUsers = users.map((user) => {
      const name = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };
      return {
        id: user.id,
        fullName: faker.internet.displayName(name),
        username: faker.internet.username(name),
        email: faker.internet.email(name),
        avatarUrl: faker.image.avatar(),
        bio: faker.helpers.arrayElement([
          faker.person.bio(),
          faker.word.words(5),
          faker.helpers.fake("{{word.adjective}} {{animal.type}}"),
          null,
        ]),
        externalUrl:
          Math.random() < EXTERNAL_URL_PROBABILITY
            ? faker.internet.url()
            : null,
      };
    });

    await Promise.all(
      enhancedUsers.map((user) =>
        db.update(schema.users).set(user).where(eq(schema.users.id, user.id)),
      ),
    );

    console.log("User data enhanced successfully! 🎉");
    console.log("Enhancing Media data 🏞️");

    const posts = await db.query.posts.findMany({
      with: {
        media: true,
      },
    });

    const enhancedPosts = posts.map((post) => {
      const media = post.media;
      const enhancedMedia = media.map((media) => {
        return {
          id: media.id,
          imageUrl: faker.helpers.arrayElement([
            // TODO: Show credit on frontend
            // Credit: https://unsplash.com/@lifeof_peter_
            "https://images.unsplash.com/photo-1729731321933-ff3057be4562?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851374655-3911c1b0e95a?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851374666-1bc849a293c3?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851374723-bac450ba6733?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851373837-e97628a6e513?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851373499-e2c10ed2eeb3?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851374430-d242e0dcd70c?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851373478-322cb92466f8?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851373472-de94347de24e?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741851373441-88b6f673d655?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1741850820882-1cb02da0f04f?q=80&w=1000&h=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1729731322170-98a4bf245c72?q=80&w=1000&h=1000&auto=format&fit=crop",
          ]),
        };
      });
      return {
        id: post.id,
        media: enhancedMedia,
      };
    });

    for (const post of enhancedPosts) {
      await Promise.all(
        post.media.map((media) =>
          db
            .update(schema.media)
            .set(media)
            .where(eq(schema.media.id, media.id)),
        ),
      );
    }

    console.log("Media data enhanced successfully! 🎉");

    console.log("Seed complete 🌲");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
