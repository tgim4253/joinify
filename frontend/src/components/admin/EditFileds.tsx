import React, { useState } from 'react';
import { useEventApi } from '../../lib/hooks/useEventApi';
import { useParams } from 'react-router-dom';
import { MoonLoaderSpinner } from '../ui/loader';
import { Button, ListButton } from '../ui/button';
import { SortableItem, SortableList } from '../ui/dnd';
import { EditFieldDataCard } from './EditFieldDataCard';
import { generateUniqueKey } from '../../lib/utils';

interface Props {
    fieldVals: EventFieldData[];
    setFieldVals: React.Dispatch<React.SetStateAction<EventFieldData[]>>;
}
const EditFields: React.FC<Props> = ({ fieldVals, setFieldVals }) => {

    const { id } = useParams<{ id: string }>();

    const eventApi = useEventApi();
    const [isEdited, setIsEdited] = useState<Record<string, boolean>>({});

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [showFieldKey, setShowFieldKey] = useState<string | null>(null);



    const handleSubmit = async () => {
        if (loading) return;
        if (!id) return;
        try {
            setLoading(true);
            const data = await eventApi.updateEventFields(id, setOrder(fieldVals));
            setFieldVals(data);
            setIsEdited({});
            alert("필드가 성공적으로 수정되었습니다.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const setOrder = (prev: EventFieldData[]) => {
        return prev.filter(field => !field.isDeleted).map((field, index) => {
            return { ...field, order: index }
        })
    }

    const handleDragEnd = (oldIndex: number, newIndex: number) => {
        setFieldVals((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0) {
                const [removed] = newVal.splice(oldIndex, 1);
                newVal.splice(newIndex, 0, removed);
            }
            return setOrder(newVal);
        });
    }

    const addField = () => {
        setFieldVals((prev) => {
            const newKey = generateUniqueKey(`key-${prev.length}`, new Set(prev.map(field => field.fieldKey)));
            const defaultVal: EventFieldData = {
                fieldKey: newKey,
                displayName: `new`,
                dataType: "string",
                enumOptions: [
                    {
                        name: "",
                        color: "#ffffff"
                    }
                ],
                isSensitive: false,
                maskFrom: 0,
                maskTo: 0,
                order: prev.length,
                isDeleted: false,
                isMutable: true,
                useForMatching: false,
                isPublic: true,
            }
            return [...prev, defaultVal];
        });
    }

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row w-full gap-4">
                <div className="lg:w-1/2 w-full overflow-hidden max-h-[70vh] lg:pr-2 border rounded-2xl p-4 shadow-sm select-none">
                    <div className="flex justify-end pt-4 items-center space-x-2"><Button
                        type="button"
                        onClick={() => addField()}
                    >
                        +
                    </Button></div>

                    <SortableList
                        items={fieldVals.filter(field => !field.isDeleted).map((field, idx) => ({ id: `${field.fieldKey}`, ...field })) || []} // id 삽입
                        onSortEnd={handleDragEnd}
                        renderItem={(fieldVal, _) => (
                            <SortableItem key={fieldVal.id} id={fieldVal.id}>
                                <ListButton
                                    className="flex items-center justify-between py-2 cursor-pointer"
                                    onClick={() => setShowFieldKey(fieldVal.fieldKey)}
                                >
                                    <span>{fieldVal.displayName}</span>
                                    {isEdited[fieldVal.fieldKey] && (
                                        <span className="text-xs text-primary ml-2">수정됨</span>
                                    )}
                                    <span className="text-x ml-1">({fieldVal.fieldKey})</span>
                                </ListButton>
                            </SortableItem>
                        )}
                    />
                </div>

                <div className="lg:w-1/2 w-full min-h-[200px] lg:pl-2 border rounded-2xl p-4 shadow-sm">
                    {showFieldKey ? (
                        <EditFieldDataCard
                            fieldVal={fieldVals.find(field => field.fieldKey === showFieldKey)!}
                            setFieldVal={setFieldVals}
                            setIsEdited={setIsEdited}
                            index={fieldVals.findIndex(field => field.fieldKey === showFieldKey)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            필드를 선택하세요
                        </div>
                    )}
                </div>
            </div>

            {fieldVals.length > 0 && (
                <div className="flex justify-end pt-4 items-center space-x-2">
                    {loading && <MoonLoaderSpinner className="mr-1 h-6 w-6" size={20} />}
                    <Button className="px-6 py-2 rounded-2xl shadow" onClick={handleSubmit}>
                        저장하기
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EditFields;
