import { TimestampModel } from "./timestamp.model";

export class AttendenceTypeModel {

    createdAt: TimestampModel;
    id: number;
    isActive: string;
    type: string;
    updatedAt: string;

    clear() {
        this.createdAt = new TimestampModel;
        this.id = 0;
        this.isActive = '';
        this.type = '';
        this.updatedAt = '';
    }
}