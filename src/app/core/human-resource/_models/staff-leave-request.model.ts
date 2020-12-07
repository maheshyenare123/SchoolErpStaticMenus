export class StaffLeaveRequestModel {

    adminRemark: string;
    date: string;
    documentFile: string;
    id: number;
    leaveDays: number;
    leaveFrom: string;
    leaveTo: string;
    leaveType: string;
    leaveTypeId: number;
    reason: string;
    sessionID: number;
    staffId: number;
    staffName: string;
    status: string;

    clear() {
       
    this.adminRemark= '';
    this.date= '';
    this.documentFile= '';
    this.id= 0;
    this.leaveDays= 0;
    this.leaveFrom= '';
    this.leaveTo= '';
    this.leaveType= '';
    this.leaveTypeId= 0;
    this.reason= '';
    this.sessionID= 0;
    this.staffId= 0;
    this.staffName= '';
    this.status= '';

    }
}