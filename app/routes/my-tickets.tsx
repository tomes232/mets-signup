import { createSupabaseClientForServer } from "~/utils/supabase"
import { LoaderFunctionArgs } from "@remix-run/node"
import { getUserId } from "~/services/session.server"
import { useLoaderData } from "@remix-run/react"
import { Ticket } from "~/components/Ticket"
import Approved from "~/assets/approved"
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
  sec: string;
  row: string;
  seat: string;
  Games: Game;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers)
  const userId = await getUserId(request)
  const { data, error } = await supabase.from('Tickets')
    .select('*, Games!Tickets_Game_fkey(*)')
    .eq('owner', userId)
  return data
}

// export const action = async ({ request }: ActionFunctionArgs) => {
//     const headers = new Headers();
//     const supabase = createSupabaseClientForServer(request, headers)
//     const userId = await getUserId(request)
//     const { data, error } = await supabase.from('Tickets').select('*').eq('owner', userId)
//     return data
// }

export default function MyTicketPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <h1>My Ticket</h1>
      <Approved />
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-8">
        {data?.map((ticket: Ticket) => (
          <div key={ticket.id}>
            <h2>{ticket.game_id}</h2>
            <Ticket game={ticket.Games} ticket={ticket} />
          </div>
        ))}
      </div>
    </div>
  )
}