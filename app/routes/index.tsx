import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="min-h-screen">
      {user ? (
        <Link to="/ships">View Ships for {user.email}</Link>
      ) : (
        <nav>
          <Link to="/join">Sign up</Link>
          <Link to="/login">Log In</Link>
        </nav>
      )}
    </main>
  );
}
