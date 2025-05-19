import type { TRPCRouter } from "@/integrations/trpc/router";
import { Link } from "@tanstack/react-router";
import type { inferRouterOutputs } from "@trpc/server";
import { GalleryHorizontalEnd } from "lucide-react";

export function PostPreview({
  post,
}: {
  post: inferRouterOutputs<TRPCRouter>["posts"]["getPosts"]["posts"][number];
}) {
  return (
    <Link to={"/post/$postId"} params={{ postId: post.id }}>
      <div className="relative">
        <p className="absolute top-2 right-2 text-white">
          {post.media.length > 1 && <GalleryHorizontalEnd />}
        </p>
        <img src={post.media[0].imageUrl} alt="" className="aspect-square" />
      </div>
    </Link>
  );
}
