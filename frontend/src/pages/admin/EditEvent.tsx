import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../../components/ui/table";
import {EditEventForm} from "../../components/admin/EditEventForm";
import { Button } from "../../components/ui/button";
import { useEventApi } from "../../lib/hooks/useEventApi";
import CSVUpload from "../../components/admin/CSVUpload";


const EditEvent: React.FC = () => {
    const eventApi = useEventApi();
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();

    // loading & error state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // event detail
    const [event, setEvent] = useState<Event | null>(null);

    // show event edit form
    const [showEditForm, setShowEditForm] = useState(false);


    // fetch event data once component mounts
    useEffect(() => {
        setLoading(true);
        if (!id) {
            setError("Event ID is missing.");
            setLoading(false);
            return;
        }

        (async () => {
            try {
                const data = await eventApi.getAdminEvent(id);
                setEvent(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);


    if (loading) return <p className="p-4">Loading event details...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;
    if (!event) return <p className="p-4">Event not found.</p>;

    // sort fields for member table
    const fields = [...(event.fields || [])].sort((a, b) => a.order - b.order);
    const members = event.members || [];

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-end">
                <Button
                    onClick={() => setShowEditForm((prev) => !prev)}
                    className="gap-1"
                >
                    {showEditForm ? "편집 숨기기 ▲" : "편집하기 ▼"}
                </Button>
            </div>

            {/* ==== Collapsible edit form ==== */}
            {showEditForm && (
                <EditEventForm setEvent={setEvent} event={event} />
            )}
            <CSVUpload />
            {/* Members Table */}
            {members.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">참여자 목록</h3>
                    <Table className="min-w-full border rounded-lg">
                        <TableHeader>
                            <TableRow>
                                {fields.map((field) => (
                                    <TableHead key={field.id}>{field.fieldKey}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    {fields.map((field) => (
                                        <TableCell key={field.id}>
                                            {member.data && field.fieldKey in member.data
                                                ? String(member.data[field.fieldKey])
                                                : "-"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default EditEvent;
