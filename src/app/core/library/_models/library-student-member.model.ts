export class LibraryStudentMemberModel {

    admissionNo: string;
    classes: string;
    dob: string;
    fatherName: string;
    firstName: string;
    gender: string;
    isActive: string;
    lastName: string;
    libraryCardNo: string;
    memberId: number;
    mobileno: string;
    section: string;
    sessionID: number;
    studentId: number;

    clear() {
        this.admissionNo= '';
        this.classes= '';
        this.dob= '';
        this.fatherName= '';
        this.firstName= '';
        this.gender= '';
        this.isActive= '';
        this.lastName= '';
        this.libraryCardNo= '';
        this.memberId= 0;
        this.mobileno= '';
        this.section= '';
        this.sessionID= 0;
        this.studentId= 0;
    }
}