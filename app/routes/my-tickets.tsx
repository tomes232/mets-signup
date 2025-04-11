import { createSupabaseClientForServer } from "~/utils/supabase";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { Ticket } from "~/components/Ticket";
import { Separator } from "~/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import TicketCancelModal from "~/components/TicketCancelModal";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  const { data, error } = await supabase
    .from("Tickets")
    .select(
      "*, Games!Tickets_Game_fkey(*), owner:profiles!Tickets_owner_fkey1(name, avatar_url)"
    )
    .eq("owner", userId);
  if (error) {
    console.error(error);
  }

  return data;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const ticketId = formData.get("ticket");
  const headers = new Headers();
  try {
    const supabase = createSupabaseClientForServer(request, headers);
    const { data: ticketData, error } = await supabase
      .from("Tickets")
      .update({ status: null, owner: null })
      .eq("id", ticketId);
    if (error) {
      console.error(error);
    }
    return { data: ticketData, status: 200 };
  } catch (error) {
    return { error: (error as Error).message, status: 500 };
  }
};

export default function MyTicketPage() {
  const data = useLoaderData<typeof loader>();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData?.status === 200) {
      //toast to confirm deletion
      toast.success("Ticket request successful cancelled");
      setShowTicketModal(false);
    } else if (actionData?.status === 500) {
      toast.error("Ticket request failed");
    }
  }, [actionData]);

  return (
    <div className="flex flex-col md:flex-row items-center min-h-screen bg-gray-50 p-4 md:p-8 space-y-6 md:space-y-0 md:space-x-4">
      {/* Title - Full width on mobile, 1/3 on desktop */}
      <div className="w-full text-center md:text-left md:w-1/4 lg:w-1/3 p-4">
        <h1 className="text-2xl font-bold">My Tickets</h1>
      </div>

      {/* Separator - Hidden on mobile, visible on desktop */}
      <Separator orientation="vertical" className="hidden md:block h-20" />
      {/* Ticket Request Modal */}
      {selectedTicket && showTicketModal && (
        <TicketCancelModal
          selectedTicket={selectedTicket}
          setShowTicketModal={setShowTicketModal}
        />
      )}
      {/* Carousel - Full width on mobile, 2/3 on desktop */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        {data && data.length > 0 ? (
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
                      <Ticket
                        game={ticket.Games}
                        ticket={ticket}
                        showAvatar={false}
                        setShowTicketModal={setShowTicketModal}
                        setSelectedTicket={setSelectedTicket}
                      />
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
        ) : (
          <div className="text-center text-gray-500">No tickets found</div>
        )}
      </div>
    </div>
  );
}
