import * as React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"
import TeamWithLogo from "~/components/TeamWithLogo"
import { format, toZonedTime } from "date-fns-tz"


interface Game {
  id: string;
  home_team: string;
  away_team: string;
  start_time: string;
}

interface Ticket {
  id: string;
  game_id: string;
  owner: string;
  sec: number;
  row: number;
  seat: number;
  status: "pending" | "approved" | null;
}

interface TicketProps {
  game: Game;
  ticket: Ticket;
  setShowTicketModal: React.Dispatch<React.SetStateAction<boolean>> | ((show: boolean) => void);
}

function TicketStatus({ ticket, setShowTicketModal }: { ticket: Ticket, setShowTicketModal: React.Dispatch<React.SetStateAction<boolean>> | ((show: boolean) => void) }) {
    if (ticket?.status === undefined) {
    return <div className="text-sm"><button
        onClick={() => setShowTicketModal(true)}
        className="text-blue-600 hover:text-blue-800 "
    >
      Request Ticket
    </button> | $50</div>
    }

    if (ticket.status === "pending") {
    return <div className="text-sm">Pending | <button className="text-blue-600 hover:text-blue-800 ">cancel</button></div>
  }
  return <div className="text-sm">Approved | <button className="text-blue-600 hover:text-blue-800 " >cancel</button></div>
}


export function Ticket({ game, ticket, setShowTicketModal }: TicketProps) {

  return (
    <Card className="relative flex w-[360px] bg-white shadow-lg">
      {/* Left side with main ticket info */}
      <div className="flex-1 p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-bold">
           <div className="flex items-center gap-2">
            <TeamWithLogo teamName={game.home_team} size={50} showName={false}/>
            <span>vs</span>
            <TeamWithLogo teamName={game.away_team} size={50} showName={false}/>
           </div>
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {format(toZonedTime(new Date(game.start_time), 'America/New_York'), "EEE, MMM d, yyyy")} &bull; {format(toZonedTime(new Date(game.start_time), 'America/New_York'), "h:mm a")}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 mt-4 border-t border-dashed border-gray-300 pt-2">
          <p className="text-sm font-medium text-gray-700">
            Citi Field
          </p>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-bold">Section:</span> {ticket.sec}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-bold">Row:</span> {ticket.row}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-bold">Seat:</span> {ticket.seat}
          </p>
        </CardContent>
        <div className="absolute bottom-2 right-2">
            <TicketStatus ticket={ticket} setShowTicketModal={setShowTicketModal} />
        </div>
      </div>

      {/* "Stub" area on the right with punch holes to mimic ticket perforation */}
      <div className="relative flex flex-col items-center justify-between h-full px-2 py-2 border-l border-dashed border-gray-300">
        {/* Top circle punch */}
        <div className="w-5 h-5 rounded-full border border-gray-300 bg-white" />
        {/* Bottom circle punch */}
        <div className="w-5 h-5 rounded-full border border-gray-300 bg-white" />
      </div>
    </Card>
  )
}
