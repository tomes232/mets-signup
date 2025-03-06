import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { format, toZonedTime } from "date-fns-tz"
import TeamWithLogo from "~/components/TeamWithLogo"
import { Form, useLoaderData } from "@remix-run/react"
import { useMemo } from "react"

interface Game {
    id: string
    home_team: string
    away_team: string
    start_time: Date
    ticket_1: string
    ticket_2: string
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

    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Request Ticket</CardTitle>
                <CardDescription>
                    {format(toZonedTime(new Date(selectedGame.start_time), 'America/New_York'), "PPP")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex flex-row gap-4 items-center">
                        <TeamWithLogo teamName={selectedGame.home_team} />
                        <p><strong>VS</strong></p>
                        <TeamWithLogo teamName={selectedGame.away_team} />
                    </div>
                    <p><strong>Start Time:</strong> {format(toZonedTime(new Date(selectedGame.start_time), 'America/New_York'), "p")}</p>
                    <p><strong>Ticket:</strong> {open_ticket?.sec} {open_ticket?.row} {open_ticket?.seat}</p>
                    <p><strong>Venue:</strong> Citi Field</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <button 
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
                    onClick={() => setShowTicketModal(false)}
                >
                    Cancel
                </button>
                <Form method="post" action="/calendar">
                            <input type="hidden" name="game" value={selectedGame.id} />
                            <input type="hidden" name="ticket" value={open_ticket?.ticket_id} />
                            <input type="hidden" name="sec" value={open_ticket?.sec} />
                            <input type="hidden" name="row" value={open_ticket?.row} />
                            <input type="hidden" name="seat" value={open_ticket?.seat} />
          
                <button 
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    type="submit"
                  >
                    Confirm Request
                </button>
                    </Form>
            </CardFooter>
        </Card>
    </div>)
}