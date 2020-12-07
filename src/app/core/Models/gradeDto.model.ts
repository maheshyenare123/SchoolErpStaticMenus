export class GradeDtoModel {

    description: string;
    examType: string;
    id: number;
    isActive: string;
    markFrom: number;
    markUpto: number;
    name: string;
    point: number;

    clear() {
        this.description= '';
        this.examType= '';
        this.id= 0;
        this.isActive= '';
        this.markFrom= 0;
        this.markUpto= 0;
        this.name= '';
        this.point= 0;
    }
}