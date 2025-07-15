type ID = BigInt | number | string;


interface User {
    userId:             ID;
    email:              string;
    role:               "admin" | "viewr";
}

interface LoginedData {
    user:               User;
    token:              string;
}

interface AuthContextType {
    user:               User | null;
    ready:              boolean;
    token:              string;
    login:              (u: User, t: string) => void;
    logout:             () => void;
}

interface Event {   
    id:                 ID;
    name:               string;
    isPublic:           boolean;
    fields?:            EventField[];
    members?:           EventMember[];
    description?:       string;
    location?:          string;
    startAt?:           string;
    endAt?:             string;
    contactName?:       string;
    contactPhone?:      string;
    bannerImageUrl?:    string;
    createdAt:          string;
}

interface EventForm {
    name:               string;
    isPublic:           boolean;
    description?:       string;
    location?:          string;
    startAt?:           string;
    endAt?:             string;
    contactName?:       string;
    contactPhone?:      string;
    bannerImageUrl?:    string;
}

interface EventField extends EventFieldData {
    id:                 ID;
    eventId:            ID;
    createdAt:          string;
}

interface EventFieldData {
    fieldKey:           string;
    displayName:        string;
    dataType:           string;
    enumOptions:        EnumOptionData[];
    isSensitive:        boolean;
    maskFrom?:          number;
    maskTo?:            number;
    order:              number;
    isMutable:          boolean;
    isPublic:           boolean;
    isDeleted:          boolean;
    useForMatching:     boolean;
}

interface EnumOptionData {
    name:        string;
    color:       string;
}

interface EventMember {
    id:                 ID;
    eventId:            bigint | number;
    data:               MemberData;
    createdAt:          string;
}

interface MemberData {
    [key: string]:      any;
}

interface CSVUploadResponse {
    data:               string[]
    members:            EventMember[];  
    oldFields:             EventField[];
}

interface CSVFieldProps {
    fieldVal: EventFieldData;
    index: number;
    setFieldVal: React.Dispatch<React.SetStateAction<EventFieldData[]>>;
}