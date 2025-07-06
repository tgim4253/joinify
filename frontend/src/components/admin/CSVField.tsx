import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button, DropdownButton } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from '@radix-ui/react-switch';
import { Textarea } from '../ui/textarea';

interface CSVFieldProps {
    fieldKey: string;
    // onSelectChange: (value: string) => void;
    // options: string[];
    // selectedValue: string;
    // onRemove: () => void;
}

export const CSVField: React.FC<CSVFieldProps> = ({ fieldKey }) => {

    const [showDetails, setShowDetails] = useState(false);


    return (
        <div>
            <DropdownButton
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between"
            >
                <span className="font-medium">{fieldKey}</span>
                {showDetails ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </DropdownButton>
            <Card className="shadow overflow-hidden rounded-t-none rounded-b-md">

                {showDetails && (
                    <CardContent className="p-6 space-y-4">
                        <form onSubmit={() => { }} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium">이벤트 이름</label>
                                <Input
                                    name="name"
                                    value={""}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <label htmlFor="isPublic" className="text-sm">
                                    이벤트 활성화
                                </label>
                                <Switch
                                    id="isPublic"
                                    checked={Boolean(true)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-sm font-medium">설명</label>
                                <Textarea
                                    name="description"
                                    value={""}
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">장소</label>
                                    <Input
                                        name="location"
                                        value={""}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">배너 이미지</label>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">담당자 이름</label>
                                    <Input
                                        name="contactName"
                                        value={""}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">담당자 전화</label>
                                    <Input
                                        name="contactPhone"
                                        value={""}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">시작 일시</label>
                                    <Input
                                        type="datetime-local"
                                        name="startAt"
                                        value={""}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium">종료 일시</label>
                                    <Input
                                        type="datetime-local"
                                        name="endAt"
                                        value={""}
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                )}
            </Card>
        </div>

    );
};