export class ExamDtoModel {

    dateFrom: string;
    dateTo: string;
    description: string;
    examGroupId: number;
    examGroupName: string;
    id: number;
    isPublish: string;
    name: string;
    sessionName: string;
    status: string;
    subjectCount: number;

    clear() {
        this.dateFrom= '';
        this.dateTo= '';
        this.description= '';
        this.examGroupId= 0;
        this.examGroupName= '';
        this.id= 0;
        this.isPublish= '';
        this.name= '';
        this.sessionName= '';
        this.status= '';
        this.subjectCount= 0;
    }
}