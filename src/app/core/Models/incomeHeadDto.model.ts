export class IncomeHeadDtoModel {

    description: string;
    id: number;
    incomeCategory: string;
    isActive: string;
   
    clear() {
        this.description= '';
        this.id= 0;
        this.incomeCategory= '';
        this.isActive= '';
    }
}