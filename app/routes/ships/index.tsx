import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getShipListItems, Ship } from "~/models/ship.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  let userId = await requireUserId(request);
  let shipListItems = await getShipListItems({ userId });
  return json({ shipListItems });
}

export default function ShipIndexPage() {
  let { shipListItems } = useLoaderData<typeof loader>();

  return <div>Select a ship</div>;
}
