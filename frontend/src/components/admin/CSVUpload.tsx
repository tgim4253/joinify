import React, { useState } from 'react';
import { useEventApi } from '../../lib/hooks/useEventApi';
import { CSVField } from './CSVField';

const CSVUpload = () => {
    const eventApi = useEventApi();
    const [file, setFile] = useState<File | null>(null);

    const [csvData, setCSVData] = useState<string[]>([]);
    const [csvMembers, setCSVMembers] = useState<EventMember[]>([]);
    const [oldFields, setOldFields] = useState<EventField[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0)
            setFile(e.target.files[0]);
    };

    const handleCsvUpload = async () => {
        if (!file) return alert("CSV 파일을 선택하세요.");
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { members, oldFields, data } = await eventApi.uploadCsv(formData);
            setCSVMembers(members);
            setOldFields(oldFields);
            setCSVData(data);
            console.log(members, oldFields, data)
        } catch (err) {
            alert("업로드 실패");
        }
    };

    return (
        <div>
            <div>
                <h2>CSV 업로드</h2>
                <input type="file" accept=".csv" onChange={handleCsvFileChange} />
                <button onClick={handleCsvUpload}>업로드</button>
            </div>
            <div>
                <h2>CSV 데이터</h2>
                {
                    csvData.map((d, index) => {
                        return (
                            <div key={index}>
                                <CSVField fieldKey={d}></CSVField>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default CSVUpload;
