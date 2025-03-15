//ticket cancel modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Form } from "@remix-run/react";

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  start_time: string;
}
interface Owner {
  name: string;
  avatar_url: string;
}

interface Ticket {
  id: string;
  game_id: string;
  owner: Owner | null;
  sec: number;
  row: number;
  seat: number;
  Games: Game;
  status: "pending" | "approved" | null;
}

export default function TicketCancelModal({
  selectedTicket,
  setShowTicketModal,
}: {
  selectedTicket: Ticket;
  setShowTicketModal: (show: boolean) => void;
}) {
  console.log("in ticket cancel modal", selectedTicket);
  return (
    <Dialog open={true} onOpenChange={setShowTicketModal}>
      <DialogHeader>
        <DialogTitle>Cancel Ticket</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <DialogDescription>
          Are you sure you want to cancel your ticket for the game between{" "}
          {selectedTicket.Games.home_team} and {selectedTicket.Games.away_team}?
        </DialogDescription>
        <h4 className="text-lg font-semibold mt-4">Ticket Details</h4>
        <div className="flex flex-col space-y-2 mt-2">
          <div>
            <span className="font-semibold">Status:</span>{" "}
            {selectedTicket.status}
          </div>
          <div>
            <span className="font-semibold">Section:</span> {selectedTicket.sec}
          </div>
          <div>
            <span className="font-semibold">Row:</span> {selectedTicket.row}
          </div>
          <div>
            <span className="font-semibold">Seat:</span> {selectedTicket.seat}
          </div>
        </div>
        <Form method="post">
          <input type="hidden" name="ticket" value={selectedTicket.id} />
          <Button type="submit" variant="destructive">
            Cancel Ticket
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
