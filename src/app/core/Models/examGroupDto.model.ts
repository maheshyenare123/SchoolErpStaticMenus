export class ExamGroupDtoModel {

    description: string;
    examType: string;
    id: number;
    isActive: string;
    name: string;

    clear() {
        this.description= '';
        this.examType= '';
        this.id= 0;
        this.isActive= '';
        this.name= '';
    }
}