export class HostelRoomDtoModel {

    costPerBed: number;
    description: string;
    hostelId: number;
    id: number;
    isActive: string;
    noOfBed: number;
    roomNo: string;
    roomTypeId: number;
    title: string;
    clear() {

        this.costPerBed = 0;
        this.description = '';
        this.hostelId = 0;
        this.id = 0;
        this.isActive = '';
        this.noOfBed = 0;
        this.roomNo = '';
        this.roomTypeId = 0;
        this.title = '';
    }
}