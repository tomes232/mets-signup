import { format, toZonedTime } from "date-fns-tz"
import TeamWithLogo from "~/components/TeamWithLogo"
import { Form } from "@remix-run/react"
import { useMemo } from "react"
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet"
import { Sheet } from "~/components/ui/sheet"
import { Button } from "./ui/button"


interface Game {
    id: string
    home_team: string
    away_team: string
    start_time: Date
    ticket_1: {
        ticket_id: number
        sec: number
        row: number
        seat: number
        status: boolean
    }
    ticket_2: {
        ticket_id: number
        sec: number
        row: number
        seat: number
        status: boolean
    }
}



export default function TicketRequestModal({ selectedGame, setShowTicketModal }: { selectedGame: Game, setShowTicketModal: (show: boolean) => void }) {
    const open_ticket = useMemo(() =>{
        if (selectedGame.ticket_1 === null) {
            return ( 
                {
                    ticket_id: 1,
                    sec: 134,
                    row: 11,
                    seat: 19,
                }
            )
        }
        else if (selectedGame.ticket_2 === null) {
            return (
                {
                    ticket_id: 2,
                    sec: 134,
                    row: 11,
                    seat: 20,
                }
            )
        }
        else {
            return (
               undefined
            )
        }
    }, [selectedGame])

   return (
    <Sheet open={true} onOpenChange={setShowTicketModal}>
        <SheetContent>
            <SheetHeader>
                <SheetTitle>
                    <div className="flex items-center gap-2">
                        <TeamWithLogo teamName={selectedGame.home_team} size={50} showName={false}/>
                        <span>vs</span>
                        <TeamWithLogo teamName={selectedGame.away_team} size={50} showName={false}/>
                    </div>
                </SheetTitle>
                <SheetDescription>
                    {format(toZonedTime(new Date(selectedGame.start_time), 'America/New_York'), "EEE, MMM d, yyyy")} &bull; {format(toZonedTime(new Date(selectedGame.start_time), 'America/New_York'), "h:mm a")}
                </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                        Citi Field
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Section:</span> {open_ticket?.sec}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Row:</span> {open_ticket?.row}
                    </p>
                    <p className="text-sm text-gray-700">
                        <span className="font-bold">Seat:</span> {open_ticket?.seat}
                    </p>
                </div>
                
                <div className="flex justify-end">
                    <Form method="post" action="/calendar">
                        <input type="hidden" name="game" value={selectedGame.id} />
                        <input type="hidden" name="ticket" value={open_ticket?.ticket_id} />
                        <input type="hidden" name="sec" value={open_ticket?.sec} />
                        <input type="hidden" name="row" value={open_ticket?.row} />
                        <input type="hidden" name="seat" value={open_ticket?.seat} />

                        <Button 
                            type="submit"
                            className="bg-green-500 text-white"
                        >
                            Confirm Request
                        </Button>
                    </Form>         
                </div>
            </div>
        </SheetContent>
    </Sheet>
   )
}