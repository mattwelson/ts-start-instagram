import { reset, seed } from "drizzle-seed";
import "dotenv/config";
import db from "@/db";
import { faker } from "@faker-js/faker";
import * as schema from "./schema";

async function main() {
  try {
    // clean db
    await reset(db, schema);

    // create some faker bios and usernames
    // Users
    const usernames = new Array(40)
      .fill("")
      .map(() => faker.internet.username());
    const bios = new Array(20).fill("").map(() => faker.person.bio());
    const avatarUrls = new Array(20).fill("").map(() => faker.image.avatar());
    // Media
    const mediaUrls = new Array(100)
      .fill("")
      .map(
        () =>
          `https://source.unsplash.com/random/1080x1080?${["nature", "food", "travel", "people", "animals"][Math.floor(Math.random() * 5)]}&${Math.random()}`,
      );

    await seed(db, schema).refine((f) => ({
      users: {
        count: 20,
        columns: {
          username: f.valuesFromArray({ values: usernames, isUnique: true }),
          email: f.email(),
          bio: f.valuesFromArray({ values: bios }),
          fullName: f.fullName(),
          externalUrl: f.weightedRandom([
            { weight: 0.8, value: f.default({ defaultValue: null }) },
            { weight: 0.2, value: f.string() },
          ]),
          avatarUrl: f.valuesFromArray({ values: avatarUrls }),
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
      media: {
        columns: {
          imageUrl: f.valuesFromArray({ values: mediaUrls }),
        },
      },
      likes: {
        count: 200,
      },
      comments: { count: 100 },
    }));

    console.log("Database seeded successfully! 🎉");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
