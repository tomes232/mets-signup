import { createSupabaseClientForServer } from "~/utils/supabase"
import { LoaderFunctionArgs } from "@remix-run/node"
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
  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id
  const { data, error } = await supabase.from('Tickets')
    .select('*, Games!Tickets_Game_fkey(*)')
    .eq('owner', userId)
  return data
}

export default function MyTicketPage() {
  const data = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-50 p-4 md:p-8 space-y-6 md:space-y-0 md:space-x-4">
      {/* Title - Full width on mobile, 1/3 on desktop */}
      <div className="w-full text-center md:text-left md:w-1/4 lg:w-1/3 p-4">
        <h1 className="text-2xl font-bold">My Tickets</h1>
      </div>
      
      {/* Separator - Hidden on mobile, visible on desktop */}
      <Separator orientation="vertical" className="hidden md:block h-20" />
      
      {/* Carousel - Full width on mobile, 2/3 on desktop */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
       {data && data.length > 0 ? <div className="relative w-[400px]">
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
        </div> : <div className="text-center text-gray-500">No tickets found</div>}
      </div>
    </div>
  )
}

