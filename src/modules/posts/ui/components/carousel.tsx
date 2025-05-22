import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { TRPCRouter } from "@/integrations/trpc/router";
import type { inferRouterOutputs } from "@trpc/server";
import { useEffect, useState } from "react";

export function PostCarousel({
  post,
}: {
  // TODO: not actually the correct type
  post: inferRouterOutputs<TRPCRouter>["posts"]["getPosts"]["posts"][number];
}) {
  console.log("rendered where?");
  const [api, setApi] = useState<CarouselApi>();

  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Carousel setApi={setApi}>
        <CarouselContent>
          {post.media.map((media) => (
            <CarouselItem key={media.id}>
              <img src={media.imageUrl} alt="" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
}
