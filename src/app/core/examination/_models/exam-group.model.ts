export class ExamGroupModel {
    description: string;
    examType: string;
    id: 0;
    isActive: string;
    name: string;
    clear() {

        this.description = '';
        this.examType = '';
        this.id = 0;
        this.isActive = '';
        this.name = '';

    }
}