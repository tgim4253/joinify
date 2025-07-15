import type { AuthPayload } from "../middleware/auth";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
            file?: Express.Multer.File;
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

        interface EventFieldData {
            fieldKey:           string;
            displayName:        string;
            dataType:           string;
            enumOptions:        EnumOptionData[];
            isSensitive:        boolean;
            isDeleted:          boolean;
            maskFrom?:          number;
            maskTo?:            number;
            order:              number;
            isMutable:          boolean;
            isPublic:           boolean;
            useForMatching:     boolean;
        }
    }
}

export {};