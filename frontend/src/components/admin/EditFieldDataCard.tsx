import { Button } from '../ui/button';
import { CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Switch } from "../../components/ui/switch.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { ChangeEvent } from 'react';
import { SortableItem, SortableList } from '../ui/dnd.tsx';

interface Props extends CSVFieldProps {
    setIsEdited?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}
export const EditFieldDataCard: React.FC<Props> = ({ fieldVal, setFieldVal, setIsEdited,index}) => {

    const handleIsEdited = (key: string) => {
        if(setIsEdited)
            setIsEdited((prev) => {
                const newVal = { ...prev };
                newVal[key] = true;
                return newVal;
            });
    }
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value, type } = e.target;
        const key = name as keyof EventFieldData;
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index) {
                newVal[index] = { ...newVal[index], [key]: type === "number" ? Number(value) : value };
                // if (key == "displayName") newVal[index].fieldKey = value;
                // else if (key == "fieldKey") newVal[index].displayName = value;
            };
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    };
    // handle Switch toggle
    const handleToggle = (key: string, checked: boolean) => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index) {
                newVal[index] = { ...newVal[index], [key]: checked };
            };
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    };

    const handleSelect = (value: string) => {

        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index) {
                newVal[index] = { ...newVal[index], dataType: value as EventFieldData["dataType"] };
            };
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    }

    const handleEnumInput = (e: ChangeEvent<HTMLInputElement>, optIndex: number) => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index && newVal[index].enumOptions) {
                newVal[index].enumOptions![optIndex] = { ...newVal[index].enumOptions![optIndex], name: e.target.value };
            }
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    }

    const handleEnumColor = (e: ChangeEvent<HTMLInputElement>, optIndex: number) => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index && newVal[index].enumOptions) {
                newVal[index].enumOptions[optIndex] = { ...newVal[index].enumOptions![optIndex], color: e.target.value };
            }
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
        
    }

    const handleDragEnd = (oldIndex: number, newIndex: number) => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index && newVal[index].enumOptions) {
                console.log([...newVal])
                const [removed] = newVal[index].enumOptions!.splice(oldIndex, 1);
                newVal[index].enumOptions!.splice(newIndex, 0, removed);
                console.log([...newVal])
                console.log(oldIndex, newIndex)
            }
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    }

    const deleteField = (wholeDelete: boolean = false) => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if(wholeDelete) {
                return newVal.filter((_, i) => i !== index);
            } else {
                return newVal.map(((field, i) => {
                    if (i === index) {
                        return { ...field, isDeleted: true };
                    }
                    return field;
                })
                )
            }
        });
        handleIsEdited(fieldVal.fieldKey);
    }

    const deleteEnumOption = (optIndex: number) => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index && newVal[index].enumOptions) {
                newVal[index].enumOptions = newVal[index].enumOptions.filter((_, i) => i !== optIndex);
            }

            if (newVal[index].enumOptions.length == 0) newVal[index].enumOptions = [{ name: "", color: "#000000" }];

            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    }

    const addEnumOption = () => {
        setFieldVal((prev) => {
            const newVal = [...(prev ?? [])];
            if (newVal.length > 0 && newVal.length > index) {
                newVal[index] = {
                    ...newVal[index],
                    enumOptions: [
                        ...(newVal[index].enumOptions || []),
                        { name: "", color: "#ffffff" },
                    ],
                };
            }
            return newVal;
        });
        handleIsEdited(fieldVal.fieldKey);
    }

    return (
        <div>
        {
            !fieldVal.isDeleted && 
             <CardContent className="p-6 space-y-6">
            <div className='grid grid-cols-2 gap-4 '>
                {/* 필드 이름 */}
                <div>
                    <label className="block text-sm font-medium mb-1">필드 이름</label>
                    <Input
                        name="displayName"
                        type="text"
                        value={fieldVal.displayName}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* 필드 키 */}
                <div>
                    <label className="block text-sm font-medium mb-1">필드 키</label>
                    <Input
                        name="fieldKey"
                        type="text"
                        value={fieldVal.fieldKey}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            {/* 보안 설정 */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="isSensitive" className="text-sm">보안</label>
                    <Switch
                        id="isSensitive"
                        checked={fieldVal.isSensitive}
                        onCheckedChange={(checked) => handleToggle("isSensitive", checked)}
                    />
                </div>

                {fieldVal.isSensitive && (
                    <div className="space-y-2 pl-4 border-l border-gray-200">

                        {/* 공개 여부 */}
                        <div className="flex items-center justify-between">
                            <label htmlFor="isPublic" className="text-sm">공개</label>
                            <Switch
                                id="isPublic"
                                checked={fieldVal.isPublic}
                                onCheckedChange={(checked) => handleToggle("isPublic", checked)}
                            />
                        </div>

                        {/* 마스킹 범위 */}
                        {fieldVal.isPublic && (
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">마스킹 시작</label>
                                    <Input
                                        name="maskFrom"
                                        type="number"
                                        value={fieldVal.maskFrom}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">마스킹 끝</label>
                                    <Input
                                        name="maskTo"
                                        type="number"
                                        value={fieldVal.maskTo}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
            {/* 수정 가능 여부 & 매칭 사용 여부 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="isMutable" className="text-sm">수정 가능</label>
                    <Switch
                        id="isMutable"
                        checked={fieldVal.isMutable}
                        onCheckedChange={(checked) => handleToggle("isMutable", checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="useForMatching" className="text-sm">매칭에 사용</label>
                    <Switch
                        id="useForMatching"
                        checked={fieldVal.useForMatching}
                        onCheckedChange={(checked) => handleToggle("useForMatching", checked)}
                    />
                </div>
            </div>
            {/* 데이터 타입 */}
            <div>
                <label className="block text-sm font-medium mb-1">데이터 타입</label>
                <Select
                    onValueChange={handleSelect}
                    value={fieldVal.dataType}
                >
                    <SelectTrigger>
                        <SelectValue className="" placeholder="데이터 타입 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="string">문자열</SelectItem>
                        <SelectItem value="number">숫자</SelectItem>
                        <SelectItem value="boolean">불리언</SelectItem>
                        <SelectItem value="date">날짜</SelectItem>
                        <SelectItem value="enum">열거형</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* 열거형 옵션 (dataType이 'enum'일 때만 표시) 
                        */}
            {fieldVal.dataType === "enum" && (
                <div>
                    <div className='justify-end flex'>
                        <Button
                            type="button"
                            onClick={() => addEnumOption()}
                        >
                            +
                        </Button>
                    </div>

                    <SortableList
                        items={fieldVal.enumOptions?.map((option, idx) => ({ id: `${idx}`, ...option })) || []} // id 삽입
                        onSortEnd={handleDragEnd}
                        renderItem={(option, optIndex) => (
                            // drag Item들
                            <SortableItem key={option.id} id={option.id}>
                                <div className="flex items-center space-x-2 py-1">
                                    <Input
                                        type="text"
                                        value={option.name}
                                        tabIndex={optIndex + 1}
                                        onChange={e => handleEnumInput(e, optIndex)}
                                        placeholder={optIndex === 0 ? "기본값" : ""}
                                        className="flex-grow"
                                    />
                                    <input
                                        type="color"
                                        value={option.color}
                                        onChange={(e) => handleEnumColor(e, optIndex)}
                                        className="w-8 h-8 p-0 border-0 cursor-pointer"
                                        title="색상 선택"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => deleteEnumOption(optIndex)}
                                    >
                                        -
                                    </Button>
                                </div>
                            </SortableItem>
                        )}
                    />
                </div>


            )}
            <div className="flex justify-end">
                <Button
                    type="button"
                    onClick={() =>deleteField()}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                >
                    필드 삭제
                </Button>
            </div> 
        </CardContent>
        }

        </div>
       
    );
};
