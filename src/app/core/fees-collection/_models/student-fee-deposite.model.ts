import { StudentFeeAmountDetailsModel } from './student-fee-amount-details.model';
import { StudentModel } from '../../Models/student.model';

export class StudentFeeDepositeModel {
    amount: number;
    amountDetails: StudentFeeAmountDetailsModel;
    balance: number;
    discount: number;
    dueDate: string;
    feeCode: string;
    feeGroupId: number;
    feeGroupName: string;
    feeMastersId: number;
    feeTypeId: number;
    fine: number;
    paid: number;
    status: string;
    studentFeeMasterId:number;
    student: StudentModel;


    clear() {
        this.amount = 0;
        this.amountDetails = new StudentFeeAmountDetailsModel;
        this.balance = 0;
        this.discount = 0;
        this.dueDate = '';
        this.feeCode = '';
        this.feeGroupId = 0;
        this.feeGroupName = '';
        this.feeMastersId = 0;
        this.feeTypeId = 0;
        this.fine = 0;
        this.paid = 0;
        this.status = '';
        this.studentFeeMasterId = 0;
        this.student = new StudentModel;
    }
}

