export class FeesDiscountModel {

    amount: number;
    code: string;
    description: string;
    id: number;
    isActive: string;
    name: string;

    clear() {
        this.amount= 0;
        this.code= '';
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.name= '';
    }
}