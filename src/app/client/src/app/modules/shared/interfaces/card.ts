export interface ICard {
    name: string;
    image?: string;
    downloadStatus?: string;
    imageVisibility?: boolean;
    description?: string;
    subject?: string;
    medium?: string;
    creator?: string;
    creators?: string;
    orgDetails?: { orgName: string, email: string};
    gradeLevel?: any;
    resourceType?: string;
    maxCount?: number;
    progress?: number;
    board?: string;
    identifier?: string;
   // sector?: string;
   // assetTtpe?: string;
   // submittedBy?: string;
   // source?: string;
    contentType?: string;
    ribbon?: {
        right?: { class: string, name: string }
        left?: { class: string, name: string , image: string }
    };
    rating?: number;
    metaData?: any;
    action?: {
        right?: {
            class: string,
            text?: string,
            eventName: string,
            displayType: string
        };
        left?: {
            class: string,
            text?: string,
            eventName: string,
            displayType: string
        };
        onImage?: {
            eventName: string
        };
    };
 // completionPercentage?: number;
}
