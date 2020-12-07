export class HomeworkEvaluationDtoModel {

    date: string;
    homeworkId: number;
    id: number;
    isActive: string;
    status: string;
    studentAdmissionNo: string;
    studentFirstName: string;
    studentId: number;
    studentLastName: string;
    studentSessionId: number;
   
    clear() {
        this.date= '';
        this.homeworkId= 0;
        this.id= 0;
        this.isActive= '';
        this.status= '';
        this.studentAdmissionNo= '';
        this.studentFirstName= '';
        this.studentId= 0;
        this.studentLastName= '';
        this.studentSessionId= 0;
    }
}