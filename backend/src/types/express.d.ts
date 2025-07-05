import type { AuthPayload } from "../middleware/auth";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
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
    }
}

export {};