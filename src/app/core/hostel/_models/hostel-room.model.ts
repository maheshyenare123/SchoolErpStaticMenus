export class HostelRoomModel {

    costPerBed: number;
    description: string;
    hostelId: number;
    hostelName: string;
    id: number;
    isActive: string;
    noOfBed: number;
    roomNo: string;
    roomType: string;
    roomTypeId: number;
    title: string;

    clear() {

        this.costPerBed = 0;
        this.description = '';
        this.hostelId = 0;
        this.hostelName = '';
        this.id = 0;
        this.isActive = '';
        this.noOfBed = 0;
        this.roomNo = '';
        this.roomType = '';
        this.roomTypeId = 0;
        this.title = '';
    }
}