import { createSupabaseClientForServer } from "~/utils/supabase"
import { LoaderFunctionArgs } from "@remix-run/node"
import { getUserId } from "~/services/session.server"
import { useLoaderData } from "@remix-run/react"
import { Ticket } from "~/components/Ticket"
import { Separator } from "~/components/ui/separator"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "~/components/ui/carousel"

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
  Games: Game;
  status: "pending" | "approved" | null;
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

export default function MyTicketPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div>
      <div className="flex items-center justify-left min-h-screen bg-gray-50 p-8 space-x-4">
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <Separator orientation="vertical" className="my-4" />
        <div className="relative w-[400px]">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">      
              {data?.map((ticket: Ticket) => (
                <CarouselItem key={ticket.id} className="pl-4 basis-full">
                  <div className="p-1">
                    <Ticket game={ticket.Games} ticket={ticket} setShowTicketModal={() => {}} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent> 
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  )
}