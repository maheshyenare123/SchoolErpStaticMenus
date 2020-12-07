export class SectionDtoModel {

    id: number;
    isActive: string;
    section: string;

    clear() {
        this.id = 0;
        this.isActive = '';
        this.section = '';
    }
}