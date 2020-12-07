export class StudentModel {

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
        this.examStudentId = 0;
        this.fatherName = '';
        this.firstname = '';
        this.gender = '';
        this.lastname = '';
        this.rollNo = '';
        this.studentId = 0;
        this.studentSessionId = 0;
    }
}