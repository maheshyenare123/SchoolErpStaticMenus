export class FeesMasterModel {


    amount: number;
    dueDate: string;
    feeGroupId: number;
    feetypeId: number;
    fineAmount: number;
    finePercentage: number;
    feeGroupName: string
    feetypeName: string
    fineType: string;
    id: number;
    isActive: string;

    clear() {
        this.amount= 0;
        this.dueDate= '';
        this.feeGroupId= 0;
        this.feeGroupName = '';
        this.feetypeId= 0;
        this.feetypeName = '';
        this.fineAmount= 0;
        this.finePercentage= 0;
        this.fineType= 'None';
        this.id= 0;
        this.isActive= '';
        
    }
}