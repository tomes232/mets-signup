import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseClientForServer } from "../utils/supabase";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);
  // Adjust the select to include the related user profile. Adjust the relationship name ("profile")
  // as appropriate based on your Supabase schema.
  const { data, error } = await supabase
    .from("Tickets")
    .select("*, profile:profiles(*), Games!Tickets_Game_fkey(start_time)")
    .eq("status", "pending");

  if (error) {
    throw new Response(error.message, { status: 500 });
  }

  return json({ tickets: data ?? [] }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const ticketId = formData.get("ticketId");
  const decision = formData.get("decision");

  if (typeof ticketId !== "string" || typeof decision !== "string") {
    throw new Response("Invalid form submission", { status: 400 });
  }

  const newStatus = decision === "accept" ? "approved" : null;
  const headers = new Headers();
  const supabase = createSupabaseClientForServer(request, headers);

  const userUpdate = decision === "decline" ? { owner: null } : {};

  const { error } = await supabase
    .from("Tickets")
    .upsert({ id: ticketId, status: newStatus, ...userUpdate })
    .select();

  if (error) {
    throw new Response(error.message, { status: 500 });
  }

  return redirect("/requests");
};

export default function RequestsPage() {
  const { tickets } = useLoaderData<typeof loader>();
  console.log("Tickets:", tickets);
  const sortedTickets = tickets.slice().sort((a: any, b: any) => {
    // Compare by game start time if available
    const aTime = a?.Games?.start_time
      ? new Date(a.Games.start_time).getTime()
      : 0;
    const bTime = b?.Games?.start_time
      ? new Date(b.Games.start_time).getTime()
      : 0;
    return aTime - bTime;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Pending Ticket Requests</h1>
      {tickets.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {sortedTickets.map((ticket: any) => (
            <li
              key={ticket.id}
              className="mb-4 border p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Ticket ID:</strong> {ticket.id}
                </p>
                <p>
                  <strong>Section:</strong> {ticket.sec}, <strong>Row:</strong>{" "}
                  {ticket.row}, <strong>Seat:</strong> {ticket.seat}
                </p>
                {ticket.game_id && (
                  <p>
                    <strong>Game ID:</strong> {ticket.game_id}
                  </p>
                )}
                {ticket.Games && ticket.Games.start_time && (
                  <p>
                    <strong>Game Date:</strong>{" "}
                    {new Date(ticket.Games.start_time).toLocaleDateString()}
                  </p>
                )}
                {ticket.profile && (
                  <div className="mt-2 flex items-center gap-2">
                    {ticket.profile.avatar_url && (
                      <img
                        src={ticket.profile.avatar_url}
                        alt={`${ticket.profile.name} Avatar`}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <p>
                      <strong>Requested by:</strong> {ticket.profile.name}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Form method="post">
                  <input type="hidden" name="ticketId" value={ticket.id} />
                  <input type="hidden" name="decision" value="accept" />
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Accept
                  </button>
                </Form>
                <Form method="post">
                  <input type="hidden" name="ticketId" value={ticket.id} />
                  <input type="hidden" name="decision" value="decline" />
                  <button
                    type="submit"
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Decline
                  </button>
                </Form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
