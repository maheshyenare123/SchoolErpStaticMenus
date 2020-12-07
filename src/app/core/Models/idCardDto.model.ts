export class IdCardDtoModel {

    background: string;
    enableAddress: number;
    enableAdmissionNo: number;
    enableBloodGroup: number;
    enableClass: number;
    enableDob: number;
    enableFathersName: number;
    enableMothersName: number;
    enablePhone: number;
    enableStudentName: number;
    headerColor: string;
    id: number;
    isActive: string;
    logo: string;
    schoolAddress: string;
    schoolName: string;
    signImage: string;
    status: number;
    title: string;
   
    clear() {
        this.background= '';
        this.enableAddress= 0;
        this.enableAdmissionNo= 0;
        this.enableBloodGroup= 0;
        this.enableClass= 0;
        this.enableDob= 0;
        this.enableFathersName= 0;
        this.enableMothersName= 0;
        this.enablePhone= 0;
        this.enableStudentName= 0;
        this.headerColor= '';
        this.id= 0;
        this.isActive= '';
        this.logo= '';
        this.schoolAddress= '';
        this.schoolName= '';
        this.signImage= '';
        this.status= 0;
        this.title= '';
    }
}