import { format, toZonedTime } from "date-fns-tz";
import TeamWithLogo from "~/components/TeamWithLogo";
import { Form } from "@remix-run/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "~/components/ui/sheet";
import { Button } from "./ui/button";

interface Ticket {
  id: string;
  game_id: string;
  Games: Game;
  sec: number;
  row: number;
  seat: number;
  status: "pending" | "approved" | null;
  price: number;
}

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  start_time: string;
}

export default function TicketRequestModal({
  selectedTicket,
  setShowTicketModal,
}: {
  selectedTicket: Ticket;
  setShowTicketModal: (show: boolean) => void;
}) {
  return (
    <Sheet open={true} onOpenChange={setShowTicketModal}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2">
              <TeamWithLogo
                teamName={selectedTicket.Games.home_team}
                size={50}
                showName={false}
              />
              <span>vs</span>
              <TeamWithLogo
                teamName={selectedTicket.Games.away_team}
                size={50}
                showName={false}
              />
            </div>
          </SheetTitle>
          <SheetDescription>
            {format(
              toZonedTime(
                new Date(selectedTicket.Games.start_time),
                "America/New_York"
              ),
              "EEE, MMM d, yyyy"
            )}{" "}
            &bull;{" "}
            {format(
              toZonedTime(
                new Date(selectedTicket.Games.start_time),
                "America/New_York"
              ),
              "h:mm a"
            )}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="p-4 border rounded-lg space-y-2">
            <p className="text-sm font-medium text-gray-700">Citi Field</p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Section:</span> {selectedTicket?.sec}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Row:</span> {selectedTicket?.row}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Seat:</span> {selectedTicket?.seat}
            </p>
            <div className="flex justify-end"></div>
            <Form method="post">
              <input
                type="hidden"
                name="game"
                value={selectedTicket.Games.id}
              />
              <input type="hidden" name="ticket" value={selectedTicket?.id} />
              <input type="hidden" name="sec" value={selectedTicket?.sec} />
              <input type="hidden" name="row" value={selectedTicket?.row} />
              <input type="hidden" name="seat" value={selectedTicket?.seat} />

              <div className="flex justify-between items-center">
                <Button type="submit" className="bg-green-500 text-white">
                  Confirm Request
                </Button>
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Total:</span> $
                  {selectedTicket?.price}
                </p>
              </div>
            </Form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
