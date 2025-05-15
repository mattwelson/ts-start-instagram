import { reset, seed } from "drizzle-seed";
import "dotenv/config";
import db from "@/db";
import * as schema from "./schema";

async function main() {
  try {
    // clean db
    await reset(db, schema);

    await seed(db, schema).refine((f) => ({
      users: {
        count: 20,
        columns: {
          username: f.weightedRandom([
            { weight: 0.3, value: f.string({ isUnique: true }) },
            { weight: 0.7, value: f.fullName({ isUnique: true }) },
          ]),
          email: f.email(),
          fullName: f.fullName(),
          bio: f.loremIpsum({ sentencesCount: 1 }),
          externalUrl: f.weightedRandom([
            { weight: 0.8, value: f.default({ defaultValue: null }) },
            { weight: 0.2, value: f.string() },
          ]),
          avatarUrl: f.default({
            defaultValue: `https://source.unsplash.com/random/300x300?portrait&${Math.random()}`,
          }),
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
          // TODO: workout image generation for this and the avatar
          imageUrl: f.default({
            defaultValue: `https://source.unsplash.com/random/1080x1080?${["nature", "food", "travel", "people", "animals"][Math.floor(Math.random() * 5)]}&${Math.random()}`,
          }),
        },
      },
      likes: {
        count: 200,
      },
      comments: { count: 100 },
    }));
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
