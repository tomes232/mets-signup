import { useEffect, useState } from "react";
import { toZonedTime } from "date-fns-tz";
import { useLoaderData, Outlet, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseClientForServer } from "~/utils/supabase";
import { GameDataTable } from "~/components/GameDataTable";
import GameCalendar from "~/components/Calendar";

import { Ticket } from "~/components/Ticket";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  start_time: Date;
  ticket_1: Ticket;
  ticket_2: Ticket;
}

interface Owner {
  name: string;
  avatar_url: string;
}

interface Ticket {
  id: string;
  sec: number;
  row: number;
  seat: number;
  game_id: string;
  owner: Owner | null;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);
  // get all supabase
  const { data, error } = await supabase
    .from("Games")
    .select(
      "*, ticket_1:Tickets!Games_ticket_1_fkey(*, owner:profiles!Tickets_owner_fkey1(name, avatar_url)), ticket_2:Tickets!Games_ticket_2_fkey(*)"
    );
  if (error) {
    console.error(error);
  }
  return { data };
};

export default function SchedulePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [toggle, setToggle] = useState<boolean>(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const { data: loaderData } = useLoaderData<typeof loader>();
  const games = loaderData ?? []; // Provide a default empty array if data is null
  const navigate = useNavigate();
  const selectedGame = games.find((game: Game) => {
    const zonedDate = toZonedTime(
      new Date(game.start_time),
      "America/New_York"
    );
    return (
      zonedDate.getDate() === date.getDate() &&
      zonedDate.getMonth() === date.getMonth() &&
      zonedDate.getFullYear() === date.getFullYear()
    );
  });

  useEffect(() => {
    if (selectedGame?.id) {
      navigate(`/schedule/${selectedGame.id}`);
    }
  }, [date]);

  // ...existing code...
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 pt-0 pr-4 pb-4 pl-4 md:pt-0 md:pr-8 md:pb-8 md:pl-8 space-y-8 md:space-y-0 md:space-x-4">
      {/* Ticket Request Modal */}
      {/* Game Information - Full width on mobile, 1/3 on desktop */}

      <Outlet />
      {/* Schedule - Full width on mobile, 1/3 on desktop */}
      <div className="w-full md:w-1/2 lg:w-1/3 p-4">
        <h1 className="text-2xl font-bold mb-6">Schedule</h1>
        <div className="flex items-center gap-2 mb-4">
          <Switch
            id="view-toggle"
            checked={toggle}
            onCheckedChange={() => setToggle(!toggle)}
          />
          <Label htmlFor="view-toggle">
            {toggle ? "Calendar View" : "List View"}
          </Label>
        </div>

        {toggle ? (
          <GameDataTable
            data={games}
            selectedRowId={selectedRowId}
            setSelectedRowId={setSelectedRowId}
            setDate={setDate}
          />
        ) : (
          <GameCalendar date={date} setDate={setDate} data={games} />
        )}
      </div>
    </div>
  );
  // ...existing code...
}
