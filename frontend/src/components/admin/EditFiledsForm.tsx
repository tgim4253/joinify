// CSVUpload.jsx
import React, { useState } from 'react';
import { eventApi } from '../../api/event';

const CSVUpload = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0)
            setFile(e.target.files[0]);
    };
    
    const handleCsvUpload = async () => {
        if (!file) return alert("CSV 파일을 선택하세요.");

        const formData = new FormData();
        formData.append('file', file);

        try {
            const headers = { 'Content-Type': 'multipart/form-data' };
            const res = await eventApi.uploadCsv(formData, headers);
        } catch (err) {
            console.error(err);
            alert("업로드 실패");
        }
    };

    return (
        <div>
            <h2>CSV 업로드</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>업로드</button>
        </div>
    );
};

export default CSVUpload;
