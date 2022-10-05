import { v4 as uuidv4 } from "uuid";
import cx from "classnames";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteShip, getShip } from "~/models/ship.server";
import { requireUserId } from "~/session.server";
import { ReactNode, useEffect, useReducer, useState } from "react";

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

  let [location, setLocation] = useState<Destination | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timer = setInterval(() => {
      switch (state.speed) {
        case "on": {
          const guest = destinations.find(
            (destination) =>
              destination.location.x === state.location.x + PLAYER_POSITION + 1
          );
          if (guest) {
            dispatch("stop");
            setLocation(guest);
            return;
          }
          dispatch("forward");
          return;
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [location, state.location.x, state.speed]);

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
          const isPlayerPosition = x === PLAYER_POSITION;

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
          const guest = destinations.find(
            (destination) => destination.location.x === state.location.x + x
          );

          if (guest) return <Button key={x}>{guest.icon}</Button>;

          return <Button key={x}>✨</Button>;
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
        <p>Visiting {location?.name}</p>
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

type Speed = "off" | "on";

type State = {
  speed: Speed;
  location: Location;
};

type Event = "start" | "stop" | "forward";

let reducer = (state: State, event: Event) => {
  let definition: {
    [key in Event]?: State;
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

type Icon = "🚀" | "☄️" | "🌙 " | "👾";

type Location = {
  x: number;
};

type Guest = {
  id: string;
  type: "ship";
  location: Location;
  icon: Icon;
};

type Destination = {
  id: string;
  name: string;
  guests: Guest[];
  type: "Asteroid" | "SpaceBar" | "Home" | "Ship" | "Moon";
  location: Location;
  icon: Icon;
};

const destinations: Destination[] = [
  {
    id: uuidv4(),
    name: "Asteroid 42",
    guests: [],
    type: "Asteroid",
    location: {
      x: NUM_STARS,
    },
    icon: "☄️",
  },
  {
    id: uuidv4(),
    name: "Moon 42",
    guests: [],
    type: "Moon",
    location: {
      x: NUM_STARS + 5,
    },
    icon: "🌙 ",
  },
  {
    id: uuidv4(),
    name: "Big Steve",
    guests: [],
    type: "Ship",
    location: {
      x: NUM_STARS + 10,
    },
    icon: "👾",
  },
];
