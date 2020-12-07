export class StaffRatingDtoModel {

    approveStatus: string;
    comment: string;
    id: number;
    isActive: string;
    name: string;
    rate: number;
    role: string;
    staffId: number;
    staffName: string;
    userId: number;

    clear() {
        this.approveStatus= '';
        this.comment= '';
        this.id= 0;
        this.isActive= '';
        this.name= '';
        this.rate= 0;
        this.role= '';
        this.staffId= 0;
        this.staffName= '';
        this.userId= 0;
    }
}