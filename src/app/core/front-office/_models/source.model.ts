export class SourceModel {

    description: string;
    id: number;
    isActive: string;
    source: string;

    clear() {
        this.id = 0;
        this.description = '';
        this.isActive = '';
        this.source = '';
    }
}