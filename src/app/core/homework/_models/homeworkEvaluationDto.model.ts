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
    constructor(id:number,date:string,homeworkId:number,isActive:string,status:string,studentAdmissionNo:string,studentFirstName:string,studentId:number ,studentLastName:string ,studentSessionId:number){
        this.id=id;
        this.date=date;
        this.homeworkId=homeworkId;
        this.isActive=isActive;
        this.status=status;
        this.studentAdmissionNo=studentAdmissionNo;
        this.studentFirstName=studentFirstName;
        this.studentId=studentId;
        this.studentLastName=studentLastName;
        this.studentSessionId=studentSessionId;




    }


}