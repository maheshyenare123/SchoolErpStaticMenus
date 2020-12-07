export class StaffAttendanceModel {

    attendence: boolean;
    attendenceType: string;
    attendenceTypeId: number;
    biometricAttendence: number;
    biometricDeviceData: string;
    date: string;
    employeeId: string;
    id: number;
    name: string;
    note: string;
    role: string;
    roleId: number;
    staffId: number;


    clear() {
        this.attendence= true;
        this.attendenceType= '';
        this.attendenceTypeId= 0;
        this.biometricAttendence= 0;
        this.biometricDeviceData= '';
        this.date= '';
        this.employeeId= '';
        this.id= 0;
        this.name= '';
        this.note= '';
        this.role= '';
        this.roleId= 0;
        this.staffId= 0;
    }
}