export class LibraryMemberListModel {

    libraryCardNo: string;
    memberId: number;
    memberType: string;
    memberName: string;
    admmisionNumer: string;
    id: number;
    isActive: string;
    phoneNumber: string;
    gender: string;
    email: string;
   
    clear() {
        this.libraryCardNo= '';
        this.memberId= 0;
        this.memberType= '';
        this.memberName= '';
        this.admmisionNumer= '';
        this.id= 0;
        this.isActive= '';
        this.phoneNumber= '';
        this.gender= '';
        this.email= '';
       
    }
}
