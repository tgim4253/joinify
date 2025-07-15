import React, { useEffect, useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
    fields: EventField[];
    members: EventMember[];
}

const MemberList: React.FC<Props> = ({fields, members}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    if (loading) return <p className="p-4">Loading event details...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    //order가 작을수록 앞에
    fields.sort((a, b) => a.order - b.order);

    return (
        <div className="p-4 space-y-4">
            {members.length > 0 && (
                <div>
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
                                <TableRow>
                                    {fields.map((field, index) => (
                                        <TableCell key={index}>
                                            {member.data && field.fieldKey in member.data
                                                ?   field.dataType == "enum" ?
                                                    (
                                                        <Select
                                                            onValueChange={()=>console.log("hi")}
                                                            value={member.data[field.fieldKey]}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue className="" placeholder="룰루" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    field.enumOptions?.map((option, index) => 
                                                                        <SelectItem key={index} value={option.name != "" ? option.name : "-"}>
                                                                            {option.name}
                                                                        </SelectItem>
                                                                    )
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    )
                                                :
                                                String(member.data[field.fieldKey])
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

export default MemberList;