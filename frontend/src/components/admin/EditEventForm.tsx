import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom";
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
import { Input } from "../../components/ui/input.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { Switch } from "../../components/ui/switch.tsx";
import { Button } from "../../components/ui/button";
import { MoonLoaderSpinner } from "../ui/loader.tsx";


type ChildComponentsProps = {
    setEvent: React.Dispatch<React.SetStateAction<Event | null>>;
    event: Event;
}
export const EditEventForm = (props: ChildComponentsProps) => {
    const { id } = useParams<{ id: string }>();

    const { event, setEvent } = props;

    // loading & error state
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    // editable form data – sync with event once fetched
    const [eventFormData, setEventFormData] = useState<Partial<EventForm>>({
        name: event.name,
        isPublic: event.isPublic,
        description: event.description ?? "",
        location: event.location ?? "",
        contactName: event.contactName ?? "",
        contactPhone: event.contactPhone ?? "",
        bannerImageUrl: event.bannerImageUrl ?? "",
        startAt: event.startAt ?? "",
        endAt: event.endAt ?? "",
    });

    // handle generic input change
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;

        setEventFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    // handle Switch toggle for isPublic
    const handleTogglePublic = (checked: boolean) => {
        setEventFormData((prev) => ({ ...prev, isPublic: checked }));
    };

    // submit update
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (loading) return;
        if (!id) return;
        try {
            setLoading(true);
            await eventApi.updateAdminEvent(id, eventFormData);
            setEvent((prev) => (prev ? { ...prev, ...eventFormData } as Event : prev));
            alert("이벤트가 성공적으로 수정되었습니다.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (<Card className="shadow rounded-2xl overflow-hidden">
        <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="block text-sm font-medium">이벤트 이름</label>
                    <Input
                        name="name"
                        value={eventFormData.name ?? ""}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <label htmlFor="isPublic" className="text-sm">
                        이벤트 활성화
                    </label>
                    <Switch
                        id="isPublic"
                        checked={Boolean(eventFormData.isPublic)}
                        onCheckedChange={handleTogglePublic}
                    />
                </div>
                
                <div className="space-y-1">
                    <label className="block text-sm font-medium">설명</label>
                    <Textarea
                        name="description"
                        value={eventFormData.description ?? ""}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium">장소</label>
                        <Input
                            name="location"
                            value={eventFormData.location ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">배너 이미지</label>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">담당자 이름</label>
                        <Input
                            name="contactName"
                            value={eventFormData.contactName ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">담당자 전화</label>
                        <Input
                            name="contactPhone"
                            value={eventFormData.contactPhone ?? ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">시작 일시</label>
                        <Input
                            type="datetime-local"
                            name="startAt"
                            value={eventFormData.startAt ? new Date(eventFormData.startAt).toISOString().slice(0, 16) : ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium">종료 일시</label>
                        <Input
                            type="datetime-local"
                            name="endAt"
                            value={eventFormData.endAt ? new Date(eventFormData.endAt).toISOString().slice(0, 16) : ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 items-center space-x-2">
                    {
                        loading &&
                        <MoonLoaderSpinner className="mr-1 h-6 w-6" size={20}></MoonLoaderSpinner>}
                    <Button type="submit" className="px-6 py-2 rounded-2xl shadow">
                        저장하기
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>)
}
