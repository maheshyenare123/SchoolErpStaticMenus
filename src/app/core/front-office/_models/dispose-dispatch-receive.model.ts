export class DispatchReceiveModel {

    address: string;
    date: string;
    fromTitle: string;
    id: number;
    image: string;
    isActive: string;
    note: string;
    referenceNo: string;
    toTitle: string;
    type: string;

    clear() {
    this.id = 0;
    this.address = '';
    this.date = '';
    this.fromTitle = '';
    this.image = '';
    this.isActive = '';
    this.note = '';
    this.referenceNo = '';
    this.toTitle = '';
    this.type = '';
}
}