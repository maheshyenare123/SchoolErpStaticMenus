export class SubjectDtoModel {

    code: string;
    id: number;
    isActive: string;
    name: string;
    type: string;

    clear() {
        this.code = '';
        this.id = 0;
        this.isActive = '';
        this.name = '';
        this.type = '';
    }
}