import React, { useEffect, useState, useContext } from "react";
import { Card, CardContent, } from "../../components/ui/card"; //
import { Button } from "../../components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../../components/ui/table";
import { ArrowUpDown, LayoutGrid, Rows } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { eventApi } from "../../api/event";



const EventList: React.FC = () => {
    // Component state
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<"table" | "card">("table"); // current view mode
    const [sortKey, setSortKey] = useState<keyof Event>("name"); // active sort field
    const [sortAsc, setSortAsc] = useState(true); // sort direction (ascending?)

    const navigate = useNavigate();

    // Fetch events once on mount
    useEffect(() => {
        (async () => {
            try {
                const data = await eventApi.getEvents();
                setEvents(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Sort the events array every render, based on active key & direction
    const sortedEvents = [...events].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        // Handle undefined values first
        if (aVal == null || bVal == null) return 0;

        // String comparison
        if (typeof aVal === "string" && typeof bVal === "string") {
            return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        // Boolean comparison
        if (typeof aVal === "boolean" && typeof bVal === "boolean") {
            return sortAsc ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        }

        // Date comparison (ISO strings converted to Date)
        if (sortKey === "startAt" || sortKey === "endAt" || sortKey === "createdAt") {
            const dateA = new Date(aVal as string);
            const dateB = new Date(bVal as string);
            return sortAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }

        return 0; // fallback (id etc.)
    });

    // Toggle sort order or change key
    const handleSort = (key: keyof Event) => {
        if (key === sortKey) {
            setSortAsc(!sortAsc);
        } else {
            setSortKey(key);
            setSortAsc(true);
        }
    };

    const eventClickHandler = (eventItem: Event) => {
        const id = (eventItem.id);
        if (id) {
            // id가 있을 경우 라우트 이동
            const url = `/events/dashboard/${id}`;
            navigate(url);
        }
    }

    // Simple loading / error states
    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="p-4 space-y-4 select-none">
            <div className="flex gap-2">
                <Button
                    variant={view === "table" ? "default" : "secondary"}
                    onClick={() => setView("table")}
                >
                    <Rows className="mr-2 h-4 w-4" /> Table
                </Button>
                <Button
                    variant={view === "card" ? "default" : "secondary"}
                    onClick={() => setView("card")}
                >
                    <LayoutGrid className="mr-2 h-4 w-4" /> Cards
                </Button>
            </div>

            {/* Conditional rendering based on view mode */}
            {view === "table" ? (
                <Table className="min-w-full border rounded-2xl shadow">
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                ID
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("name")}
                                className="cursor-pointer select-none"
                            >
                                Name <ArrowUpDown className="inline-block h-4 w-4" />
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("location")}
                                className="cursor-pointer select-none"
                            >
                                Location <ArrowUpDown className="inline-block h-4 w-4" />
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("startAt")}
                                className="cursor-pointer select-none"
                            >
                                Start <ArrowUpDown className="inline-block h-4 w-4" />
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("endAt")}
                                className="cursor-pointer select-none"
                            >
                                End <ArrowUpDown className="inline-block h-4 w-4" />
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedEvents.map((event) => (
                            <TableRow key={String(event.id)} onClick={() => eventClickHandler(event)}>
                                <TableCell>{String(event.id)}</TableCell>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{event.location ?? "-"}</TableCell>
                                <TableCell>
                                    {event.startAt ? new Date(event.startAt).toLocaleString() : "-"}
                                </TableCell>
                                <TableCell>
                                    {event.endAt ? new Date(event.endAt).toLocaleString() : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sortedEvents.map((event) => (
                        <Card
                            key={String(event.id)}
                            onClick={() => eventClickHandler(event)}
                            className="shadow hover:shadow-lg transition-shadow rounded-2xl overflow-hidden"
                        >
                            {event.bannerImageUrl && (
                                <img
                                    src={event.bannerImageUrl}
                                    alt={event.name}
                                    className="w-full h-40 object-cover"
                                />
                            )}
                            <CardContent className="p-4 space-y-2">
                                <h3 className="text-xl font-semibold">{event.name}</h3>
                                {event.location && (
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                )}
                                {event.description && (
                                    <p className="text-sm line-clamp-3">{event.description}</p>
                                )}
                                <p className="text-sm">
                                    {event.startAt ? new Date(event.startAt).toLocaleString() : ""}
                                    {event.endAt && " ~ " + new Date(event.endAt).toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventList;
