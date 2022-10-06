export type Icon = "🚀" | "☄️" | "🌙 " | "👾";

export type Location = {
  x: number;
};

export type Guest = {
  id: string;
  type: "ship";
  location: Location;
  icon: Icon;
};

export type Destination = {
  id: string;
  name: string;
  guests: Guest[];
  type: "Asteroid" | "SpaceBar" | "Home" | "Ship" | "Moon";
  icon: Icon;
};

export type Speed = "off" | "on";

export type State = {
  speed: Speed;
  location: Location;
};

export type EventNames = "start" | "stop" | "forward";
