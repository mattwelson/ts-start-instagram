import { HydrateClient } from "@/components/hydrate-client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useTRPC } from "@/integrations/trpc/react";
import { PostCarousel } from "@/modules/posts/ui/components/carousel";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/$username/$postId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { postId, username } = Route.useParams();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.posts.getPost.queryOptions({ postId }),
  );

  const navigate = useNavigate();

  if (!data.post) throw notFound();

  return (
    <HydrateClient>
      <Dialog
        open
        onOpenChange={() =>
          navigate({
            to: "/$username",
            params: { username },
          })
        }
      >
        <DialogContent className="w-full sm:max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)]">
          <div className="flex flex-col mx-auto items-center flex-2/3">
            <PostCarousel post={data.post} />
          </div>
          <DialogTitle className="flex-1/3">
            {data.post.caption}
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </HydrateClient>
  );
}
