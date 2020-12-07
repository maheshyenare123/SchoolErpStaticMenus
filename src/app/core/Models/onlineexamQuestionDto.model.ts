export class OnlineexamQuestionDtoModel {

    onlineexamQuestionId: number;
    questionId: number;
    subjectId: number;
    
    clear() {
       this.onlineexamQuestionId = 0;
       this.questionId = 0;
       this.subjectId = 0;
    }
}