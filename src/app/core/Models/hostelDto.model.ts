export class HostelDtoModel {

    address: string;
    description: string;
    hostelName: string;
    id: number;
    intake: number;
    isActive: string;
    type: string;
    clear() {
        this.address = '';
        this.description = '';
        this.hostelName = '';
        this.id = 0;
        this.intake = 0;
        this.isActive = '';
        this.type = '';
       
    }
}