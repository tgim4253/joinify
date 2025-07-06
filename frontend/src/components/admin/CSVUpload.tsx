import React, { useState } from 'react';
import { useEventApi } from '../../lib/hooks/useEventApi';
import { CSVField } from './CSVField';
import { useParams } from 'react-router-dom';

const CSVUpload = () => {
    const { eventId } = useParams<{ id: string }>();
    
    const eventApi = useEventApi();
    const [file, setFile] = useState<File | null>(null);

    const [csvData, setCSVData] = useState<EventField[]>([]);
    const [csvMembers, setCSVMembers] = useState<EventMember[]>([]);
    const [oldFields, setOldFields] = useState<EventField[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0)
            setFile(e.target.files[0]);
    };

    const parseCSVField = (data: string[]): EventField[] => {
        return data.map((key) => {
            const temp = oldFields.filter((field) => field.fieldKey == key);
            if(temp.length == 0){
                const defaultVal: Partial<EventField> = {};
                defaultVal.fieldKey         = key;
                defaultVal.displayName      = key;
                defaultVal.dataType         = "string";
                defaultVal.enumOptions      = {};
                defaultVal.defaultValue     = "";
                defaultVal.isSensitive      = false;
                defaultVal.maskFrom         = 0;
                defaultVal.maskTo           = 0;
                defaultVal.order            = 9999;
                defaultVal.isMutable        = true;
                defaultVal.useForMatching   = false;

                return defaultVal;
            } 
            const temp2 = temp.filter((field) => field.eventId == eventId);
            if(temp.length == 0) return temp[0];
            else return temp2[0];
        })
    } 

    const handleCSVUpload = async () => {
        if (!file) return alert("CSV 파일을 선택하세요.");
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { members, oldFields, data } = await eventApi.uploadCsv(formData);
            setCSVMembers(members);
            setOldFields(oldFields);
            setCSVData(parseCSVField(data));
            console.log(members, oldFields, data)
        } catch (err) {
            alert("업로드 실패");
        }
    };

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
                                <CSVField fieldKey={d.fieldKey} fieldVal={} setFieldVal={}></CSVField>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default CSVUpload;
