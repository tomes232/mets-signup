import { google } from "googleapis";
import { createSupabaseClientForServer } from "~/utils/supabase";

interface Game {
  home_team: string;
  away_team: string;
  start_time: Date;
}

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  process.env.GOOGLE_REDIRECT_URL
);

export const generateAuthUrl = (userId: string) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: userId,
    prompt: "consent",
  });
};

export async function createGameEvent(request: Request, event: Game) {
  const client = await getGoogleClient(request);

  const calendar = google.calendar({ version: "v3", auth: client });

  try {
    const start = new Date(event.start_time);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const calEvent = {
      summary: event.home_team + " vs " + event.away_team,
      start: {
        dateTime: start.toISOString(),
        timeZone: "America/New_York", // Adjust to your desired time zone
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/New_York",
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: calEvent,
    });

    return Response.json({
      success: true,
      eventLink: response.data.htmlLink,
    });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return Response.json(
      { error: error.message || "Error creating event" },
      { status: 500 }
    );
  }
}

const getGoogleClient = async (request: Request) => {
  const requestUrl = new URL(request.url);

  const supabase = createSupabaseClientForServer(request, new Headers());

  const { data, error } = await supabase.auth.getSession();

  const token = data?.session?.provider_token;
  const refresh_token = data?.session?.provider_refresh_token;

  if (!token) {
    return;
  }

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

  client.setCredentials({
    access_token: token,
    refresh_token: refresh_token,
    scope: "https://www.googleapis.com/auth/calendar.events",
  });

  return client;
};
