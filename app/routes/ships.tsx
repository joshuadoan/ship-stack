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
    <div className="flex h-full flex-col bg-black text-orange-400">
      <header className="bg-or flex space-x-4 bg-orange-400 p-4 text-black">
        <h1>
          <Link to=".">Ships</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button type="submit">Logout</button>
        </Form>
      </header>

      <main className="flex flex-1 ">
        <div className="h-full w-80">
          <Link to="new" className="block p-4">
            + New Ship
          </Link>

          {data.shipListItems.length === 0 ? (
            <p className="p-4">No ships yet</p>
          ) : (
            <ol>
              {data.shipListItems.map((ship) => (
                <li key={ship.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block p-4 ${isActive ? " bg-orange-400 text-black" : ""}`
                    }
                    to={ship.id}
                  >
                    {ship.name}
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
