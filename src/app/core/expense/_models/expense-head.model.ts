export class ExpenseHeadModel {

    description: string;
    expCategory: string;
    id: number;
    isActive: string;
    isDeleted: string;

    clear() {
        this.description= '';
        this.expCategory= '';
        this.id= 0;
        this.isActive= '';
        this.isDeleted= '';
    }
}