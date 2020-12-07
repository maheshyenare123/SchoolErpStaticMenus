export class OnlineexamStudentDtoModel {

    admissionNo: string;
    className: string;
    dob: string;
    fatherName: string;
    firstname: string;
    gender: string;
    id: number;
    lastname: string;
    mobileno: string;
    onlinexamId: number;
    sectionName: string;
    studentSessionId: number;

    clear() {
        this.admissionNo= '';
        this.className= '';
        this.dob= '';
        this.fatherName= '';
        this.firstname= '';
        this.gender= '';
        this.id= 0;
        this.lastname= '';
        this.mobileno= '';
        this.onlinexamId= 0;
        this.sectionName= '';
        this.studentSessionId= 0;
    }
}