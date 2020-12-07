export class AssignFeeStudentDtoModel {

    admissionNo: string;
    amount: number;
    category: string;
    className: string;
    fatherName: string;
    feeSessionGroupId: number;
    firstname: string;
    gender: string;
    isActive: string;
    lastname: string;
    rollNo: string;
    sectionName: string;
    studentFeeMasterId: number;
    studentId: number;
    studentSessionId: number;

    clear() {
        this.admissionNo= '';
        this.amount= 0;
        this.category= '';
        this.className= '';
        this.fatherName= '';
        this.feeSessionGroupId= 0;
        this.firstname= '';
        this.gender= '';
        this.isActive= '';
        this.lastname= '';
        this.rollNo= '';
        this.sectionName= '';
        this.studentFeeMasterId= 0;
        this.studentId= 0;
        this.studentSessionId= 0;
    }
}