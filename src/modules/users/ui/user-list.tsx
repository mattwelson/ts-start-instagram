import { useTRPC } from "@/integrations/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { UserProfile } from "./components/profile";

export function UserList() {
  const trpc = useTRPC();

  const { data: users } = useSuspenseQuery(trpc.users.getUsers.queryOptions());

  console.log("client?");

  return (
    <div>
      {users.map((user) => (
        <Link
          to="/$username"
          params={{ username: user.username }}
          key={user.id}
        >
          <UserProfile user={user} />
        </Link>
      ))}
    </div>
  );
}
