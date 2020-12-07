export class FeesReminderModel {
    days: number;
    id: number;
    isActive: string;
    type: string;

    clear() {
        this.days= 0;
        this.id= 0;
        this.isActive= '';
        this.type= '';
    }
}