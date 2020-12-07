export class AssignExamStudentModel {

    // admissionNo: string;
    // amount: number;
    // category: string;
    // className: string;
    // fatherName: string;
    // feeSessionGroupId: number;
    // firstname: string;
    // gender: string;
    // isActive: string;
    // lastname: string;
    // rollNo: string;
    // sectionName: string;
    // studentFeeMasterId: number;
    // studentId: number;
    // studentSessionId: number;
    // isSaved:number;


    admissionNo: string;
    category: string;
    examStudentId: number;
    fatherName: string;
    firstname: string;
    gender: string;
    lastname: string;
    rollNo: string;
    studentId: number;
    studentSessionId: number;


    clear() {
        this.admissionNo = '';
        this.category = '';
        this.fatherName = '';
        this.examStudentId = 0;
        this.firstname = '';
        this.gender = '';
        this.lastname = '';
        this.rollNo = '';
        this.studentId = 0;
        this.studentSessionId = 0;
    }
}