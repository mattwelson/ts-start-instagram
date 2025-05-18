import { appRouter } from "@/trpc";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = ({ request }: { request: Request }) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
  });

export const APIRoute = createAPIFileRoute("/api/trpc/$")({
  GET: ({ request }) => handler({ request }),
  POST: ({ request }) => handler({ request }),
});
