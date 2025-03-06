"use client"

import * as React from "react"
import { 
ColumnDef,
flexRender,
getCoreRowModel,
getPaginationRowModel,
getSortedRowModel,
SortingState,
useReactTable,
getFilteredRowModel,
ColumnFiltersState
} from "@tanstack/react-table"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow,
} from "~/components/ui/table"
import { format, toZonedTime } from "date-fns-tz"
import TeamWithLogo from "~/components/TeamWithLogo"

interface Game {
id: string
date: Date
home_team: string
away_team: string
start_time: Date
location?: string
status?: "scheduled" | "in_progress" | "completed" | "postponed"
home_score?: number
away_score?: number
}

export interface GameDataTableProps {
data: Game[]
selectedRowId: string | null
setSelectedRowId: (id: string) => void
setDate: (date: Date) => void
}

export function GameDataTable({ data, selectedRowId, setSelectedRowId, setDate }: GameDataTableProps) {
const [sorting, setSorting] = React.useState<SortingState>([])
const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

const columns: ColumnDef<Game>[] = [
    {
    accessorKey: "start_time",
    header: "Date",
    cell: ({ row }) => {
        const date = row.getValue("start_time") as Date
        return format(date, "MMM dd, yyyy")
    },
    },
    {
    accessorKey: "game_time",
    header: "Time",
    cell: ({ row }) => {
        const time =  row.original.start_time
        console.log('time', time, row)
        const zonedDate = toZonedTime(time, 'America/New_York')
        console.log('zonedDate', zonedDate)
        return format(zonedDate, "hh:mm a")
    },
    },
    {
    accessorKey: "home_team",
    header: "Home Team",
    cell: ({ row }) => {
        const teamName = row.getValue("home_team") as string
        return (
        <div className="flex items-center gap-2">
            <TeamWithLogo teamName={teamName} size={30} showName={false}/>
            <span>{teamName}</span>
        </div>
        )
    },
    },
    {
    accessorKey: "away_team",
    header: "Away Team",
    cell: ({ row }) => {
        const teamName = row.getValue("away_team") as string
        return (
        <div className="flex items-center gap-2">
            <TeamWithLogo teamName={teamName} size={30} showName={false}/>
            <span>{teamName}</span>
        </div>
        )
    },
    },
    {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
        return (<a 
        href="https://www.google.com/search?q=Citi+Field" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 underline"
    >
        Citi Field
    </a>)
    }
    },
    {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
        <div className="capitalize">{status?.replace("_", " ") || "Scheduled"}</div>
        )
    },
    },
    {
    id: "score",
    header: "Score",
    cell: ({ row }) => {
        const homeScore = row.original.home_score
        const awayScore = row.original.away_score
        
        if (homeScore === undefined || awayScore === undefined) {
        return "-"
        }
        
        return `${homeScore} - ${awayScore}`
    },
    },
]

const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: false,
    state: {
    sorting,
    columnFilters,
    },
})

return (
    <div className="space-y-4">
    <div className="flex items-center justify-between">
        <Input
        placeholder="Filter by team..."
        value={(table.getColumn("home_team")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
            const value = event.target.value
            table.getColumn("home_team")?.setFilterValue(value)
            table.getColumn("away_team")?.setFilterValue(value)
        }}
        className="max-w-sm"
        />
    </div>
    <div className="rounded-md border">
        <Table>
        <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                    {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                        )}
                </TableHead>
                ))}
            </TableRow>
            ))}
        </TableHeader>
        <TableBody>
            {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
                <TableRow
                key={row.id}
                onClick={() => {
                    setSelectedRowId(row.original.id)
                    setDate(new Date(row.original.start_time))
                }}
                className={selectedRowId === row.original.id ? "bg-blue-100" : ""}
                >
                {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                ))}
                </TableRow>
            ))
            ) : (
            <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                No games found.
                </TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
    </div>
    <div className="flex items-center justify-end space-x-2">
        <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        >
        Previous
        </Button>
        <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        >
        Next
        </Button>
    </div>
    </div>
)
}

