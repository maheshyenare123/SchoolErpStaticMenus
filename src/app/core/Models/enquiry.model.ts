export class EnquiryModel {

    address: string;
    assigned: string;
    classId: number;
    contact: string;
    date: string;
    description: string;
    email: string;
    followUpDate: string;
    id: number;
    isActive: string;
    name: string;
    noOfChild: string;
    note: string;
    reference: string;
    source: string;

    clear() {
        this.id = 0;
        this.classId = 0;
        this.address = '';
        this.assigned = '';
        this.contact = '';
        this.date = '';
        this.description = '';
        this.email = '';
        this.followUpDate = '';
        this.isActive = '';
        this.name = '';
        this.noOfChild = '';
        this.note = '';
        this.reference = '';
        this.source = '';
    }
}