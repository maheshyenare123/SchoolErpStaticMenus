export class staffPayslipDtoModel {

    basic: number;
    id: number;
    leaveDeduction: number;
    month: string;
    netSalary: number;
    paymentDate: string;
    paymentMode: string;
    remark: string;
    staffId: number;
    status: string;
    tax: string;
    totalAllowance: number;
    totalDeduction: number;
    year: string;

clear() {
    this.basic= 0;
    this.id= 0;
    this.leaveDeduction= 0;
    this.month= '';
    this.netSalary= 0;
    this.paymentDate= '';
    this.paymentMode= '';
    this.remark= '';
    this.staffId= 0;
    this.status= '';
    this.tax= '';
    this.totalAllowance= 0;
    this.totalDeduction= 0;
    this.year= ''; 
}
}