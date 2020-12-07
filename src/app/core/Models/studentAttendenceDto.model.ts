export class StudentAttendenceDtoModel {

    admissionNo: string;
    attendence: boolean;
    attendenceType: string;
    attendenceTypeId: number;
    biometricAttendence: number;
    biometricDeviceData: string;
    date: string;
    firstname: string;
    gender: string;
    id: number;
    lastname: string;
    note: string;
    rollNo: string;
    studentSessionId: number;

    clear() {
       
        this.admissionNo= '';
        this.attendence= true;
        this.attendenceType= '';
        this.attendenceTypeId= 0;
        this.biometricAttendence= 0;
        this.biometricDeviceData= '';
        this.date= '';
        this.firstname= '';
        this.gender= '';
        this.id= 0;
        this.lastname= '';
        this.note= '';
        this.rollNo= '';
        this.studentSessionId= 0;
    }
}