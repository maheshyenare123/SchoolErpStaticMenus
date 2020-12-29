export class LibraryStaffMemberModel {

    dob: string;
    email: string;
    gender: string;
    isActive: string;
    libraryCardNo: string;
    memberId: number;
    mobileno: string;
    name: string;
    id: number;

    clear() {
        this.dob= '';
        this.email= '';
        this.gender= '';
        this.isActive= '';
        this.libraryCardNo= '';
        this.memberId= 0;
        this.mobileno= '';
        this.name= '';
        this.id= 0;
    }
}