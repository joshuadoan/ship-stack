import type { ReactNode } from "react";
import { useEffect, useReducer, useState } from "react";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import cx from "classnames";
import invariant from "tiny-invariant";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { deleteShip, getShip } from "~/models/ship.server";
import { requireUserId } from "~/session.server";
import { destinations } from "./data";
import type { Destination, EventNames, State } from "./types";

const NUM_STARS = 20;
const PLAYER_POSITION = Math.floor(NUM_STARS / 2);

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

  let [state, dispatch] = useReducer(reducer, {
    speed: "on",
    location: {
      x: 0,
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timer = setInterval(() => {
      const visiting = destinations[state.location.x + PLAYER_POSITION + 1];
      switch (state.speed) {
        case "on": {
          if (visiting) {
            dispatch("stop");
            return;
          }
          dispatch("forward");
          return;
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, [state.location.x, state.speed]);

  useEffect(() => {
    if (state.speed === "on") return;
    let interval: NodeJS.Timer = setTimeout(() => {
      dispatch("start");
    }, 3000);
    return () => clearInterval(interval);
  }, [state.speed]);

  const Button = (props: { children: ReactNode; className?: string }) => {
    return (
      <button
        className={
          "h-8 w-8 items-center  justify-center bg-slate-900 text-2xl hover:text-blue-500 " +
          props.className
        }
      >
        {props.children}
      </button>
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="flex justify-between">
        {data.ship.name} {state.location.x}°
        <Form method="post">
          <button type="submit">Delete</button>
        </Form>
      </h3>
      <div className="flex flex-wrap">
        {[...Array(NUM_STARS)].map((_, x) => {
          let isPlayerPosition = x === PLAYER_POSITION;
          let location = destinations[state.location.x + x];

          if (isPlayerPosition) {
            return (
              <Button
                key={x}
                className={cx({
                  "animate-bounce": state.speed === "off" && isPlayerPosition,
                })}
              >
                🚀
              </Button>
            );
          }

          if (location) return <Button key={x}>{location.icon}</Button>;

          return (
            <Button
              key={x}
              className={cx({
                "p-1": x % 2,
              })}
            >
              ✨
            </Button>
          );
        })}
      </div>

      <div
        className={cx(
          "border border-orange-400 p-4  transition-opacity duration-1000 ease-out",
          {
            "opacity-100": state.speed === "off",
            "opacity-0": state.speed === "on",
          }
        )}
      >
        <p>
          Visiting {destinations[state.location.x + PLAYER_POSITION - 1]?.name}
        </p>
      </div>
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

let reducer = (state: State, event: EventNames) => {
  let definition: {
    [key in EventNames]?: State;
  } = {
    start: {
      ...state,
      speed: "on",
    },
    stop: {
      ...state,
      speed: "off",
    },
    forward: {
      ...state,
      location: {
        x: state.location.x < NUM_STARS * 2 ? state.location.x++ : 0,
      },
    },
  };

  return definition[event] ?? state;
};
