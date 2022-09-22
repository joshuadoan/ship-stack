import { Link } from "@remix-run/react";

export default function ShipIndexPage() {
  return (
    <p>
      No ship selected. Select a ship on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new ship.
      </Link>
    </p>
  );
}
