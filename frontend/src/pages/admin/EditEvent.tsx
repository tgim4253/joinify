import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { eventApi } from "../../api/event";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { Card, CardContent } from "../../components/ui/card";

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await eventApi.getAdminEvent(id);
        console.log(data);
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

  const fields = event.fields || [];

  //order가 작을수록 앞에
  fields.sort((a, b) => a.order - b.order);
  const members = event.members || [];

  return (
    <div className="p-4 space-y-4">
        <Card className="shadow rounded-2xl overflow-hidden">
        {event.bannerImageUrl && (
          <img
            src={event.bannerImageUrl}
            alt={event.name}
            className="w-full h-40 object-cover"
          />
        )}
        <CardContent className="p-4 space-y-2">
          <h2 className="text-2xl font-bold">{event.name}</h2>
          {event.location && (
            <p className="text-sm text-gray-600">{event.location}</p>
          )}
          {event.description && (
            <p className="text-sm text-gray-700">{event.description}</p>
          )}
          <p className="text-sm text-gray-500">
            {event.startAt ? new Date(event.startAt).toLocaleString() : ""}
            {event.endAt && " ~ " + new Date(event.endAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {members.length > 0 && (
        <div>
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <Table className="min-w-full border rounded-lg">
              <TableHeader>
                <TableRow>
                  {fields.map((field, index) => (
                    <TableHead key={index}>{field.fieldKey}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    {fields.map((field, index) => (
                      <TableCell key={index}>
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