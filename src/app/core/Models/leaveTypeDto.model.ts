export class LeaveTypeDtoModel {

    id: number;
    isActive: string;
    type: string;

    clear() {
        this.id= 0;
        this.isActive = '';
        this.type = '';
    }
}