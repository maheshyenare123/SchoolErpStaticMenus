export class StudentFeeAmountDetailsModel {
    // amount: number;
    // amountDiscount: number;
    // amountFine: number;
    // date: string;
    // description: number;
    // id: number;
    // paymentMode: number;


    amount: number;
    amountDiscount: number;
    amountFine: number;
    date: string;
    description: string;
    feeMastersId: number;
    paymentMode: string;
    studentFeeMasterId: number;

    clear() {
        this.amount = 0;
        this.amountDiscount = 0;
        this.amountFine = 0;
        this.date = '';
        this.description= '';
        this.feeMastersId= 0;
        this.paymentMode= '';
        this.studentFeeMasterId= 0;
    }
}