CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "category_to_post" (
	"categoryId" text NOT NULL,
	"postId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "category_to_post" ADD CONSTRAINT "category_to_post_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_to_post" ADD CONSTRAINT "category_to_post_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;