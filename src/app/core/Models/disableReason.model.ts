import { TimestampModel } from "./timestamp.model";
export class DisableReasonModel {
  
    createdAt: TimestampModel;
    id: number;
    isActive: string;
    reason: string;

    clear() {
        this.createdAt = new TimestampModel;
        this.id = 0;
        this.isActive = '';
        this.reason = '';
    }
}