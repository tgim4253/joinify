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
import { Card, CardContent } from "../../components/ui/card";
import { useEventApi } from "../../lib/hooks/useEventApi";

const EventDashboard: React.FC = () => {
  const eventApi = useEventApi();

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
        const data = await eventApi.getEvent(id);
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
  fields.sort((a, b) => b.order - a.order);
  const members = event.members || [];

  return (
    <div className="p-4 space-y-4">
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

export default EventDashboard;