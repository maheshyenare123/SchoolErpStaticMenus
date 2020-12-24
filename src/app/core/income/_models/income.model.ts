export class IncomeModel {

    amount: number;
    date: string;
    documents: string;
    id: number;
    incHeadId: string;
    invoiceNo: string;
    isActive: string;
    name: string;
    note: string;
    incHeadName:string;
    clear() {
        this.amount= 0;
        this.date= '';
        this.documents= '';
        this.id= 0;
        this.incHeadId= '';
        this.invoiceNo= '';
        this.isActive= '';
        this.name= '';
        this.note= '';
    }
}