export class VisitorsPurposeModel {

    
    description: string;
    id: number;
    isActive: string;
    visitorsPurpose: string;

    clear() {
        this.id = 0;
        this.description = '';
        this.isActive = '';
        this.visitorsPurpose = '';
    }
}