import React, { useState } from 'react';
import { useEventApi } from '../../../lib/hooks/useEventApi';
import { CSVField } from './CSVField';
import { useParams } from 'react-router-dom';
import { MoonLoaderSpinner } from '../../ui/loader';
import { Button } from '../../ui/button';

const CSVUpload = () => {

    const { id } = useParams<{ id: string }>();

    const eventApi = useEventApi();
    const [file, setFile] = useState<File | null>(null);

    const [csvData, setCSVData] = useState<EventFieldData[]>([]);
    const [csvMembers, setCSVMembers] = useState<EventMember[]>([]);
    const [oldFields, setOldFields] = useState<EventField[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0)
            setFile(e.target.files[0]);
    };

    const parseCSVField = (data: string[], oldFields: EventField[]): EventFieldData[] => {
        return data.map((key, index) => {
            const temp = oldFields.filter((field) => field.fieldKey == key);
            if (temp.length == 0) {
                const defaultVal: EventFieldData = {
                    fieldKey: key,
                    displayName: key,
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
                    order: index,
                    isMutable: true,
                    isDeleted: false,
                    useForMatching: false,
                    isPublic: true,
                }
                return defaultVal;
            }
            const temp2 = temp.filter((field) => field.eventId == id);
            if (temp.length == 0) return temp[0];
            else return temp2[0];
        })
    }

    const handleCSVUpload = async () => {
        if (!file) return alert("CSV 파일을 선택하세요.");
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await eventApi.uploadCsv(formData);
            setCSVMembers(res.members);
            setOldFields(res.oldFields);
            setCSVData(parseCSVField(res.data, res.oldFields));
        } catch (err) {
            alert("업로드 실패");
        }
    };

    const handleSubmit = async () => {
        if (loading) return;
        if (!id) return;
        try {
            setLoading(true);
            const data = await eventApi.updateEventFields(id, csvData);
            alert("필드가 성공적으로 수정되었습니다.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div>
                <h2>CSV 업로드</h2>
                <input type="file" accept=".csv" onChange={handleCSVFileChange} />
                <button onClick={handleCSVUpload}>업로드</button>
            </div>
            <div>
                <h2>CSV 데이터</h2>
                {
                    csvData.map((d, index) => {
                        return (
                            <div key={index}>
                                <CSVField fieldVal={d} setFieldVal={setCSVData} index={index}></CSVField>
                            </div>
                        )
                    })
                }
            </div>
            {
                csvData.length > 0 &&
                <div className="flex justify-end pt-4 items-center space-x-2">
                    {
                        loading &&
                        <MoonLoaderSpinner className="mr-1 h-6 w-6" size={20}></MoonLoaderSpinner>}
                    <Button className="px-6 py-2 rounded-2xl shadow" onClick={handleSubmit}>
                        저장하기
                    </Button>
                </div>
            }

        </div>
    );
};

export default CSVUpload;
