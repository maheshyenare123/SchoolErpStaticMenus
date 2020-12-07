export class FeeMasterRequestDtoModel {


    amount: number;
    dueDate: string;
    feeGroupId: number;
    feetypeId: number;
    fineAmount: number;
    finePercentage: number;
    fineType: string;
    id: number;
    isActive: string;
    sessionID: number;

    clear() {
        this.amount= 0;
        this.dueDate= '';
        this.feeGroupId= 0;
        this.feetypeId= 0;
        this.fineAmount= 0;
        this.finePercentage= 0;
        this.fineType= '';
        this.id= 0;
        this.isActive= '';
        this.sessionID= 0;
    }
}