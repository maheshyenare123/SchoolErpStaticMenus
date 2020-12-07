import { TimestampModel } from "./timestamp.model";
export class ComplaintModel {

    actionTaken: string;
    assigned: string;
    complaintType: string;
    contact: string;
    createdAt:TimestampModel;
    date: string;
    description: string;
    email: string;
    id: number;
    image: string;
    isActive: string;
    name: string;
    note: string;
    source: string;

    clear() {
        this.id = 0;
        this.actionTaken = '';
        this.assigned = '';
        this.complaintType = '';
        this.contact = '';
        this.createdAt=new TimestampModel;
        this.date = '';
        this.description = '';
        this.email = '';
        this.image = '';
        this.isActive = '';
        this.name = '';
        this.note = '';
        this.source = '';
    }
}