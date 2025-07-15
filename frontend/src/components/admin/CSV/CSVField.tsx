import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DropdownButton } from '../../ui/button.tsx';
import { Card } from '../../ui/card.tsx';
import { EditFieldDataCard } from '../EditFieldDataCard.tsx';



export const CSVField: React.FC<CSVFieldProps> = ({ fieldVal, setFieldVal, index }) => {

    const [showDetails, setShowDetails] = useState(false);



    return (
        <div>
            <DropdownButton
                onClick={() => setShowDetails(!showDetails)}
                className="flex w-full items-center justify-between"
            >
                <span className="font-medium">{fieldVal.fieldKey}</span>
                {showDetails ? (
                    <ChevronUp className="h-4 w-4" />
                ) : (
                    <ChevronDown className="h-4 w-4" />
                )}
            </DropdownButton>
            <Card className="shadow rounded-md overflow-hidden">

                {showDetails && (
                    <EditFieldDataCard fieldVal={fieldVal} setFieldVal={setFieldVal} index={index} />
                )}
            </Card>
        </div>

    );
};