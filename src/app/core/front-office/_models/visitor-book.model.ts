export class VisitorBookModel {

    contact: string;
    date: string;
    email: string;
    id: number;
    idProof: string;
    image: string;
    inTime: string;
    isActive: string;
    name: string;
    noOfPepple: number;
    note: string;
    outTime: string;
    purpose: string;
    source: string;

    clear() {
        this.id = 0;
        this.noOfPepple = 0;
        this.contact = '';
        this.date = '';
        this.email = '';
        this.idProof = '';
        this.image = '';
        this.inTime = '';
        this.isActive = '';
        this.name = '';
        this.note = '';
        this.outTime = '';
        this.purpose = '';
        this.source = '';
    }
}