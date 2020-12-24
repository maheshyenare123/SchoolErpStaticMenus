export class EnquiryModel {

    // address: string;
    // assigned: string;
    // classes: string;
    // classId: 0;
    // contact: string;
    // date: string;
    // description: string;
    // email: string;
    // followUpDate: string;
    // id: 0;
    // isActive: string;
    // name: string;
    // noOfChild: string;
    // note: string;
    // reference: string;
    // source: string;
    // sourceId: 0;
    // status: string;



    address: string;
    assigned: string;
    classesId: 0;
    classes: string;
    contact: string;
    date: string;
    description: string;
    email: string;
    followUpDate: string;
    id: 0;
    isActive: string;
    name: string;
    noOfChild: string;
    note: string;
    reference: string;
    source: string;
    sourceId: 0;
    status: string

    clear() {
       
        this.address = '';
        this.assigned = '';
        this.classes = '';
        this.classesId = 0;
        this.contact = '';
        this.date = '';
        this.description = '';
        this.email = '';
        this.followUpDate = '';
        this.id = 0;
        this.isActive = '';
        this.name = '';
        this.noOfChild = '';
        this.note = '';
        this.reference = '';
        this.source = '';
        this.sourceId = 0;
        this.status = 'active';
    }
}