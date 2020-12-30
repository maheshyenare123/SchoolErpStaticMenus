export class ExpenseModel {

    amount: number;
    date: string;
    documents: string;
    expHeadId: number;
    expCategory: string;
    id: number;
    invoiceNo: string;
    isActive: string;
    name: string;
    note: string;

    clear() {
        this.amount= 0;
        this.date= '';
        this.documents= '';
        this.expHeadId= 0;
        this.expCategory=''
        this.id= 0;
        this.invoiceNo= '';
        this.isActive= '';
        this.name= '';
        this.note= '';
    }
}