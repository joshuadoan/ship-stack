import { v4 as uuidv4 } from "uuid";
import { Destination } from "./$shipId";

export const destinations: {
  [kwy: number]: Destination;
} = {
  20: {
    id: uuidv4(),
    name: "Asteroid 42",
    guests: [],
    type: "Asteroid",
    icon: "☄️",
  },
  30: {
    id: uuidv4(),
    name: "Moon 42",
    guests: [],
    type: "Moon",
    icon: "🌙 ",
  },
  40: {
    id: uuidv4(),
    name: "Big Steve",
    guests: [],
    type: "Ship",
    icon: "👾",
  },
};
