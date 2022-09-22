import type { User, Ship } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Ship } from "@prisma/client";

export function getShip({
  id,
  userId,
}: Pick<Ship, "id"> & {
  userId: User["id"];
}) {
  return prisma.ship.findFirst({
    select: { id: true, name: true },
    where: { id, userId },
  });
}

export function getShipListItems({ userId }: { userId: User["id"] }) {
  return prisma.ship.findMany({
    where: { userId },
    select: { id: true, name: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createShip({
  name,
  userId,
}: Pick<Ship, "name"> & {
  userId: User["id"];
}) {
  return prisma.ship.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteShip({
  id,
  userId,
}: Pick<Ship, "id"> & { userId: User["id"] }) {
  return prisma.ship.deleteMany({
    where: { id, userId },
  });
}
