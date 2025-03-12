import { useEffect, useState } from 'react'
import { format, toZonedTime } from "date-fns-tz"
import { useLoaderData, useActionData } from '@remix-run/react'
import { ActionFunctionArgs, LoaderFunctionArgs, data } from '@remix-run/node'
import { createSupabaseClientForServer } from '~/utils/supabase'
import { GameDataTable } from '~/components/GameDataTable'
import GameCalendar from '~/components/Calendar'
import TicketRequestModal from '~/components/TicketRequestModal'
import {toast} from 'sonner'
import { Skeleton } from '~/components/ui/skeleton'
import { Ticket } from '~/components/Ticket'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'
import { createGameEvent } from '~/services/google.calendar'

interface Game {
  id: string
  home_team: string
  away_team: string
  start_time: Date
  ticket_1: Ticket
  ticket_2: Ticket
}

interface Ticket {
  id: string
  sec: number
  row: number
  seat: number
  game_id: string
  owner: string
}

export const loader = async ({ request }: LoaderFunctionArgs) =>{
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers)
    // get all supabase 
    const { data, error } = await supabase.from('Games').select('*, ticket_1:Tickets!Games_ticket_1_fkey(*), ticket_2:Tickets!Games_ticket_2_fkey(*)')

    return { data }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
 
    const gameId = formData.get('game');
    const ticket = formData.get('ticket');
    const sec = formData.get('sec');
    const row = formData.get('row');
    const seat = formData.get('seat');
    const headers = new Headers();
    const supabase = createSupabaseClientForServer(request, headers);
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id

    //check if the user is authenticated
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
        throw new Error('Failed to get user');
    }
   
    

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

        // if (gameData?.length > 0) {
        //     const game = gameData[0];
        //     if (game.start_time && game.home_team && game.away_team) {
        //       await createGameEvent(request, {
        //         start_time: game.start_time,
        //         home_team: game.home_team || "",
        //         away_team: game.away_team,
        //       });
        //     }
        //   }

        

        return  {data: gameData , status: 200};
    } catch (error) {
        return { error: (error as Error).message,  status: 500 };
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
        if (actionData?.status === 200) {
            toast.success("Ticket requested successfully")
            setShowTicketModal(false)
        }
        else if(actionData?.status === 500) {
            toast.error("Ticket request failed")
        }
    }, [actionData, toast])


    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 p-4 md:p-8 space-y-8 md:space-y-0 md:space-x-4">
            {/* Ticket Request Modal */}
            {showTicketModal && selectedGame && (
                <TicketRequestModal selectedGame={selectedGame} setShowTicketModal={setShowTicketModal} />
            )}


            
            {/* Game Information - Full width on mobile, 1/3 on desktop */}
            <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <h2 className="text-xl font-bold mb-4">Game Information</h2>
                {selectedGame ? (
                    <div className="flex flex-col space-y-3">
                        <Ticket 
                            game={selectedGame} 
                            ticket={selectedGame.ticket_1 ? selectedGame.ticket_1 : {
                                id: null,
                                sec: 134,
                                row: 11,
                                seat: 19,
                                game_id: selectedGame.id,
                                owner: null,
                            }} 
                            setShowTicketModal={setShowTicketModal} 
                        />
                        <Ticket game={selectedGame} ticket={selectedGame.ticket_2 ? selectedGame.ticket_2 : {
                            id: null,
                            sec: 134,
                            row: 11,
                            seat: 20,
                            game_id: selectedGame.id,
                            owner: null,
                        }} setShowTicketModal={setShowTicketModal} />                    
                    </div>
                ) : (
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-full md:w-[250px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full md:w-[250px]" />
                            <Skeleton className="h-4 w-full md:w-[200px]" />
                        </div>
                    </div>
                )}
            </div>
                                    {/* Schedule - Full width on mobile, 1/3 on desktop */}
                                    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <h1 className="text-2xl font-bold mb-6">Schedule</h1>
                <div className="flex items-center gap-2 mb-4">
                    <Switch
                        id='view-toggle'
                        checked={toggle}
                        onCheckedChange={() => setToggle(!toggle)}
                    />
                    <Label htmlFor="view-toggle">{toggle ? "Calendar View" : "List View"}</Label>
                </div>
                
                {toggle ? (
                    <GameDataTable data={games} selectedRowId={selectedRowId} setSelectedRowId={setSelectedRowId} setDate={setDate} />
                ) : (
                    <GameCalendar date={date} setDate={setDate} data={games} />
                )}
            </div>
        </div>
    )
}
