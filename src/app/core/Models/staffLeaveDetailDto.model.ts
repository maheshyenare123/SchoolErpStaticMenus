export class StaffLeaveDetailDtoModel {

    allotedLeave: number;
    id: number;
    isActive: string;
    leaveType: string;
    leaveTypeId: number;
    staffId: number;
    staffName: string;

    clear() {
        this.allotedLeave= 0;
        this.id= 0;
        this.isActive= '';
        this.leaveType= '';
        this.leaveTypeId= 0;
        this.staffId= 0;
        this.staffName= '';
    }
}