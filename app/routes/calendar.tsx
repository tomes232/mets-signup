import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { format, toZonedTime } from "date-fns-tz"
import { useLoaderData, useActionData } from '@remix-run/react'
import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node'
import { createSupabaseClientForServer } from '~/utils/supabase'
import TeamWithLogo from '~/components/TeamWithLogo'
import { GameDataTable } from '~/components/GameDataTable'
import GameCalendar from '~/components/Calendar'
import TicketRequestModal from '~/components/TicketRequestModal'
import { getUserId } from '~/services/session.server'
import {toast} from 'sonner'
import { Skeleton } from '~/components/ui/skeleton'

interface Game {
  id: string
  home_team: string
  away_team: string
  start_time: Date
  ticket_1: string
  ticket_2: string
}

export const loader = async ({ request }: LoaderFunctionArgs) =>{
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers)
    // get all supabase 
    const { data, error } = await supabase.from('Games').select('*')

    return { data }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const userId = await getUserId(request);
    const gameId = formData.get('game');
    const ticket = formData.get('ticket');
    const sec = formData.get('sec');
    const row = formData.get('row');
    const seat = formData.get('seat');

    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers);

    try {
        // Start a transaction
        const { data: ticketData, error: ticketError } = await supabase
            .from('Tickets')
            .insert({ game_id: gameId, owner: userId, sec, row, seat })
            .select();

        if (ticketError || !ticketData || ticketData.length === 0) {
            throw new Error('Failed to insert ticket');
        }

        let update = {};
        if (ticket === '1') {
            update = {
                ticket_1: ticketData[0].id
            };
        } else if (ticket === '2') {
            update = {
                ticket_2: ticketData[0].id
            };
        }

        const { error: gameError, data: gameData } = await supabase
            .from('Games')
            .update(update)
            .eq('id', gameId)
            .select();

        if (gameError) {
            throw new Error('Failed to update game');
        }

        return data({ data: gameData }, {status: 200});
    } catch (error) {
        console.error('Transaction failed:', (error as Error).message);
        return data({ error: (error as Error).message }, { status: 500 });
    }
};

export default function CalendarPage() {

    const [date, setDate] = useState<Date>(new Date())
    const [toggle, setToggle] = useState<boolean>(false)
    const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
    const [showTicketModal, setShowTicketModal] = useState<boolean>(false)
    const { data: loaderData } = useLoaderData<typeof loader>()
    const actionData = useActionData<typeof action>()
    const games = loaderData ?? []; // Provide a default empty array if data is null
    const selectedGame = games.find((game: Game) => {
        const zonedDate = toZonedTime(new Date(game.start_time), 'America/New_York');
        return (
            zonedDate.getDate() === date.getDate() &&
            zonedDate.getMonth() === date.getMonth() &&
            zonedDate.getFullYear() === date.getFullYear()
        );
    })

    useEffect(() => {
        console.log(actionData)
        if (actionData) {
            toast.success("Ticket requested successfully")
        }
        else {
            toast.error("Ticket request failed")
        }
    }, [actionData, toast])


    return (
        <div className="relative flex p-8">
            {/* Ticket Request Modal */}
            {showTicketModal && selectedGame && (
                <TicketRequestModal selectedGame={selectedGame} setShowTicketModal={setShowTicketModal} />
            )}
            <div className="w-1/3 p-4">
                <h2 className="text-xl font-bold mb-4">Game Information</h2>
                {selectedGame ? (
                    <div>
                        <p><strong>Date:</strong> {format(toZonedTime(new Date(selectedGame.start_time), 'America/New_York'), "PPP")}</p>
                        <div className="flex flex-row gap-4 items-center">
                            <TeamWithLogo teamName={selectedGame.home_team} />
                            <p><strong>VS</strong></p>
                            <TeamWithLogo teamName={selectedGame.away_team} />
                        </div>
                        <p><strong>Start Time:</strong> {format(toZonedTime(new Date(selectedGame.start_time), 'America/New_York'), "p")}</p>
                        <p>Venue: <a 
                            href="https://www.google.com/search?q=Citi+Field" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            Citi Field
                        </a></p>
                        <button 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                            onClick={() => setShowTicketModal(true)}
                        >
                            Request Ticket
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                )}
            </div>
            <div className="w-2/3 p-4">
                <h1 className="text-2xl font-bold mb-6">Schedule</h1>
                <button 
                    onClick={() => setToggle(!toggle)} 
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {toggle ? "Switch to Calendar View" : "Switch to List View"}
                </button>
                {toggle ? (
                    <GameDataTable data={games} selectedRowId={selectedRowId} setSelectedRowId={setSelectedRowId} setDate={setDate} />
                ) : (
                    <GameCalendar date={date} setDate={setDate} data={games} />
                )}
            </div>
        </div>
    )
}
