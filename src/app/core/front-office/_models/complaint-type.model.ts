import { TimestampModel } from "./timestamp.model";
export class ComplaintTypeModel {

    complaintType: string;
    createdAt:TimestampModel;
    description: string;
    id: number;
    isActive: string;

    clear() {
        this.id = 0;
        this.complaintType = '';;
        this.createdAt=new TimestampModel;
        this.description = '';
        this.isActive = '';
    }
    
}