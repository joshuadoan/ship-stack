import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getShipListItems } from "~/models/ship.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const shipListItems = await getShipListItems({ userId });
  return json({ shipListItems });
}

export default function ShipsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div>
      <header>
        <h1>
          <Link to=".">Ships</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button type="submit">Logout</button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Ship
          </Link>

          <hr />

          {data.shipListItems.length === 0 ? (
            <p className="p-4">No ships yet</p>
          ) : (
            <ol>
              {data.shipListItems.map((ship) => (
                <li key={ship.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={ship.id}
                  >
                    📝 {ship.name}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
