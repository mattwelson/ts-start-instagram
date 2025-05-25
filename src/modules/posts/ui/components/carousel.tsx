import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselSlideIndicator,
} from "@/components/ui/carousel";
import type { TRPCRouter } from "@/integrations/trpc/router";
import type { inferRouterOutputs } from "@trpc/server";

export function PostCarousel({
  post,
}: {
  post: NonNullable<inferRouterOutputs<TRPCRouter>["posts"]["getPost"]["post"]>;
}) {
  return (
    <Carousel>
      <CarouselContent className="ml-0">
        {post.media.map((media) => (
          <CarouselItem key={media.id} className="pl-0">
            <img src={media.imageUrl} alt="" />
          </CarouselItem>
        ))}
      </CarouselContent>
      {post.media.length > 1 && (
        <>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
          <CarouselSlideIndicator />
        </>
      )}
    </Carousel>
  );
}
