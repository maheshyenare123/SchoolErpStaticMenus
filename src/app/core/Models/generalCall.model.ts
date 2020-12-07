export class GeneralCallModel {

    callDureation: string;
    callType: string;
    contact: string;
    date: string;
    description: string;
    followUpDate: string;
    id: number;
    isActive: string;
    name: string;
    note: string;

clear() {
    this.id = 0;
    this.callDureation = '';
    this.callType = '';
    this.contact = '';
    this.date = '';
    this.description = '';
    this.followUpDate = '';
    this.isActive = '';
    this.name = '';
    this.note = '';
}
}