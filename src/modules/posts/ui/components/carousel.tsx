import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselSlideIndicator,
} from "@/components/ui/carousel";
import type { TRPCRouter } from "@/integrations/trpc/router";
import type { inferRouterOutputs } from "@trpc/server";
import { useEffect, useState } from "react";

export function PostCarousel({
  post,
}: {
  // TODO: not actually the correct type
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
