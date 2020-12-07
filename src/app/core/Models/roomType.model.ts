export class RoomTypeModel {

  
    description: string;
    id: number;
    isActive: string;
    roomType: string;
    clear() {
        this.description = '';
        this.id = 0;
        this.isActive = '';
        this.roomType = '';
       
    }
}