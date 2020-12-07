export class SectionModel {

    id: number;
    name: string;
    subjectGroupClassSectionId: number;
    
    clear() {
        this.id = 0;
        this.name = '';
        this.subjectGroupClassSectionId = 0;
    }
}