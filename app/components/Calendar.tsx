import { Calendar as UICalendar } from "~/components/ui/calendar"
import {  toZonedTime } from "date-fns-tz"

type Game = {
    date: string
    start_time: string
}

export default function GameCalendar({date, setDate, data}: {date: Date, setDate: (date: Date) => void, data: Game[]}) {
    // Extract dates from the data with null check
    const highlightedDates = data?.map((item: Game) => {
        const zonedDate = toZonedTime(new Date(item.start_time), 'America/New_York');
        return zonedDate
    }) ?? []
    // check if the date is in the highlightedDates array
    const hasGame = (day: Date) => {
        return highlightedDates.find(date => date.getDate() === day.getDate() && date.getMonth() === day.getMonth() && date.getFullYear() === day.getFullYear())
    }


   return  (
            <div>
                <UICalendar
                    mode="single"
                    selected={date}
                    onSelect={(day) => 
                        day && hasGame(day) && setDate(day)
                    }
                    className="rounded-md border"
                    modifiers={{ highlighted: highlightedDates }}
                    modifiersStyles={{
                        highlighted: { backgroundColor: '#FFA500' }
                    }}
                />
            </div>
)
                    }