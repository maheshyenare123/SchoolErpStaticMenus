export class QuestionDtoModel {

    correct: string;
    id: number;
    isActive: string;
    onlineexamId: number;
    onlineexamQuestionId: number;
    optA: string;
    optB: string;
    optC: string;
    optD: string;
    optE: string;
    question: string;
    subjectId: number;
    subjectName: string;

    clear() {
        this.correct= '';
        this.id= 0;
        this.isActive= '';
        this.onlineexamId= 0;
        this.onlineexamQuestionId= 0;
        this.optA= '';
        this.optB= '';
        this.optC= '';
        this.optD= '';
        this.optE= '';
        this.question= '';
        this.subjectId= 0;
        this.subjectName= '';
    }
}