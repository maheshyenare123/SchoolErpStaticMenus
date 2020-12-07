export class ExpenseModel {

    amount: number;
    date: string;
    documents: string;
    expHeadId: number;
    id: number;
    invoiceNo: string;
    isActive: string;
    isDeleted: string;
    name: string;
    note: string;

    clear() {
        this.amount= 0;
        this.date= '';
        this.documents= '';
        this.expHeadId= 0;
        this.id= 0;
        this.invoiceNo= '';
        this.isActive= '';
        this.isDeleted= '';
        this.name= '';
        this.note= '';
    }
}