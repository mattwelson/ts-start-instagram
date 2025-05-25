import { useQueryClient } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>{props.children} </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    );
  }