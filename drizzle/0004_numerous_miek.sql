ALTER TABLE "category_to_post" ADD CONSTRAINT "category_to_post_categoryId_postId_pk" PRIMARY KEY("categoryId","postId");--> statement-breakpoint
ALTER TABLE "category_to_post" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "category_to_post" ADD COLUMN "updatedAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX "category_to_post_category_id_idx" ON "category_to_post" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "category_to_post_post_id_idx" ON "category_to_post" USING btree ("postId");