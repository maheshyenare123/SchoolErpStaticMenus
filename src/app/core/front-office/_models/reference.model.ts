export class ReferenceModel {

    description: string;
    id: number;
    isActive: string;
    reference: string;

    clear() {
        this.id = 0;
        this.description = '';
        this.isActive = '';
        this.reference = '';
    }
}