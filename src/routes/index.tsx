import { UserList } from "@/modules/users/ui/user-list";
import { HydrationBoundary, dehydrate, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// TODO: convert to a feed instead of this
export const Route = createFileRoute("/")({
  component: IndexPage,
  loader: async ({context: {queryClient, trpc}}) => {
    void queryClient.prefetchQuery(trpc.users.getUsers.queryOptions())
  },
});

function IndexPage() {
  const queryClient = useQueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <UserList />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
