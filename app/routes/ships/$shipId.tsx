import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteShip, getShip } from "~/models/ship.server";
import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.shipId, "shipId not found");

  const ship = await getShip({ userId, id: params.shipId });
  if (!ship) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ ship });
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.shipId, "shipId not found");

  await deleteShip({ userId, id: params.shipId });

  return redirect("/ships");
}

export default function ShipDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3>{data.ship.name}</h3>
      <Form method="post">
        <button type="submit">Delete</button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Ship not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
