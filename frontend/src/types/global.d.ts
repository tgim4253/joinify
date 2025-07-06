interface User {
    userId:             string;
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
    id:                 bigint | number;
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

interface EventField {
    id:                 bigint | number;
    eventId:            bigint | number;
    fieldKey:           string;
    fieldType:          string;
    isSensitive:        boolean;
    maskFrom?:          number;
    maskTo?:            number;
    createdAt:          string;
    order:              number;
    isMutable:          boolean;
    isPublic:           boolean;
    useForMatching:     boolean;
}

interface EventMember {
    id:                 bigint | number;
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