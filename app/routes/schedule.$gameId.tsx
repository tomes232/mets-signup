import { Suspense, useEffect, useState } from "react";
import { useLoaderData, useActionData, Await } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseClientForServer } from "~/utils/supabase";
import TicketRequestModal from "~/components/TicketRequestModal";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";
import { Ticket } from "~/components/Ticket";

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
  Games: Game;
  owner: Owner | null;
  sec: number;
  row: number;
  seat: number;
  status: "pending" | "approved" | null;
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);
  const gameId = params.gameId;
  // get all supabase
  const { data, error } = await supabase
    .from("Tickets")
    .select(
      "*, Games!Tickets_Game_fkey(*), owner:profiles!Tickets_owner_fkey1(name, avatar_url)"
    )
    .eq("game_id", gameId);
  if (error) {
    console.error(error);
  }
  return { data };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const gameId = params.gameId;
  const ticket = formData.get("ticket");
  const sec = formData.get("sec");
  const row = formData.get("row");
  const seat = formData.get("seat");
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (userError) {
    throw new Error("Failed to get user");
  }
  console.log("Ticket ID: ", ticket);

  try {
    // Start a transaction
    const { data: ticketData, error: ticketError } = await supabase
      .from("Tickets")
      .upsert({
        id: ticket,
        game_id: gameId,
        owner: userId,
        sec,
        row,
        seat,
        status: "pending",
      })
      .select();

    console.log("TICKET DATA: ", ticketData, ticketError);

    if (ticketError || !ticketData || ticketData.length === 0) {
      throw new Error("Failed to insert ticket");
    }

    //TODO: make this work
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
    return { data: ticketData, status: 200 };
  } catch (error) {
    return { error: (error as Error).message, status: 500 };
  }
};

export default function TicketListPage() {
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { data: loaderData } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  console.log("IN HERE");

  useEffect(() => {
    if (actionData?.status === 200) {
      toast.success("Ticket requested successfully");
      setShowTicketModal(false);
    } else if (actionData?.status === 500) {
      toast.error("Ticket request failed");
    }
  }, [actionData]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Ticket Request Modal */}
      {showTicketModal && selectedTicket && (
        <TicketRequestModal
          selectedTicket={selectedTicket}
          setShowTicketModal={setShowTicketModal}
        />
      )}

      <Suspense
        fallback={
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full md:w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full md:w-[250px]" />
              <Skeleton className="h-4 w-full md:w-[200px]" />
            </div>
          </div>
        }
      >
        <Await resolve={loaderData}>
          {(resolvedValue) => (
            <>
              {resolvedValue?.map((ticket) => (
                <div key={ticket.id} className="flex flex-col space-y-3">
                  <Ticket
                    game={ticket.Games}
                    ticket={ticket}
                    showAvatar={true}
                    setSelectedTicket={setSelectedTicket}
                    setShowTicketModal={setShowTicketModal}
                  />
                </div>
              ))}
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
