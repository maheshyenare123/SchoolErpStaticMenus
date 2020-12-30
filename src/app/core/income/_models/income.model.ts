export class IncomeModel {
    amount: number;
    date: string;
    documents: string;
    id: number;
    incHeadId: number;
    incHeadIncomeCategory: string;
    invoiceNo: string;
    isActive: string;
    name: string;
    note: string;
    clear() {
        this.amount= 0;
        this.date= '';
        this.documents= '';
        this.id= 0;
        this.incHeadId= 0;
        this.incHeadIncomeCategory= '';
        this.invoiceNo= '';
        this.isActive= '';
        this.name= '';
        this.note= '';
    }
}