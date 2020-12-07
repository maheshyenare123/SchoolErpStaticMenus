export class HomeworkDtoModel {

   
    classes: string;
    classesId: number;
    createDate: string;
    createdBy: number;
    description: string;
    document: string;
    evaluatedBy: number;
    evaluationDate: string;
    homeworkDate: string;
    id: number;
    isActive: string;
    section: string;
    sectionId: number;
    staffId: number;
    staffName: string;
    subjectGroupSubjectId: number;
    subjectId: number;
    subjectName: string;
    submitDate: string;

    clear() {
        this.classes= '';
        this.classesId= 0;
        this.createDate= '';
        this.createdBy= 0;
        this.description= '';
        this.document= '';
        this.evaluatedBy= 0;
        this.evaluationDate= '';
        this.homeworkDate= '';
        this.id= 0;
        this.isActive= '';
        this.section= '';
        this.sectionId= 0;
        this.staffId= 0;
        this.staffName= '';
        this.subjectGroupSubjectId= 0;
        this.subjectId= 0;
        this.subjectName= '';
        this.submitDate= '';

    }
}