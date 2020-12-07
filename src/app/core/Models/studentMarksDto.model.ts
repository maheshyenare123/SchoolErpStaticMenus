export class StudentMarksDtoModel {

    admissionNo: string;
    attendence: string;
    category: string;
    examResultId: number;
    examStudentId: number;
    examSubjectId: number;
    fatherName: string;
    firstname: string;
    gender: string;
    lastname: string;
    marks: number;
    note: string;
    rollNo: string;
    studentId: number;
    

    clear() {
        this.admissionNo= '';
        this.attendence= '';
        this.category= '';
        this.examResultId= 0;
        this.examStudentId= 0;
        this.examSubjectId= 0;
        this.fatherName= '';
        this.firstname= '';
        this.gender= '';
        this.lastname= '';
        this.marks= 0;
        this.note= '';
        this.rollNo= '';
        this.studentId= 0;
    }
}