import db from "@/db";
import { UserProfile } from "@/modules/users/ui/components/profile";
import { Link, createFileRoute } from "@tanstack/react-router";

// TODO: convert to a feed instead of this
export const Route = createFileRoute("/")({
  component: IndexPage,
  loader: async () => {
    const users = await db.query.users.findMany({
      limit: 20,
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
    return { users };
  },
});
function IndexPage() {
  const { users } = Route.useLoaderData();

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Users to follow</h1>
      <div className="grid gap-2">
        {users.length === 0 && <p>No users found</p>}
        {users.map((user) => (
          <Link
            to={"/$username"}
            params={{ username: user.username }}
            key={user.id}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <UserProfile user={user} />
          </Link>
        ))}
      </div>
    </div>
  );
}
