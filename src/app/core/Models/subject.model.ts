export class SubjectModel {

    id: number;
    name: string;
    subjectGroupSubjectId: number;

    clear() {
        this.id = 0;
        this.name = '';
        this.subjectGroupSubjectId = 0;
    }
}