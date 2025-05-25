import { HydrateClient } from "@/components/hydrate-client";
import { UserList } from "@/modules/users/ui/user-list";
import { createFileRoute } from "@tanstack/react-router";

// TODO: convert to a feed instead of this
export const Route = createFileRoute("/")({
  component: IndexPage,
  loader: async ({ context: { queryClient, trpc } }) => {
    void queryClient.prefetchQuery(trpc.users.getUsers.queryOptions());
  },
});

function IndexPage() {
  return (
    <HydrateClient>
      <UserList />
    </HydrateClient>
  );
}
