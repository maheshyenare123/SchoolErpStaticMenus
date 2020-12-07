export class TemplateAdmitcardDtoModel {

    backgroundImg: string;
    examCenter: string;
    examName: string;
    heading: string;
    id: number;
    isActive: string;
    isAddress: number;
    isAdmissionNo: number;
    isDob: number;
    isFatherName: number;
    isGender: number;
    isMotherName: number;
    isName: number;
    isPhoto: number;
    isRollNo: number;
    leftLogo: string;
    rightLogo: string;
    schoolName: string;
    sign: string;
    template: string;
    title: string;

    clear() {
        this.backgroundImg= '';
        this.examCenter= '';
        this.examName= '';
        this.heading= '';
        this.id= 0;
        this.isActive= '';
        this.isAddress= 0;
        this.isAdmissionNo= 0;
        this.isDob= 0;
        this.isFatherName= 0;
        this.isGender= 0;
        this.isMotherName= 0;
        this.isName= 0;
        this.isPhoto= 0;
        this.isRollNo= 0;
        this.leftLogo= '';
        this.rightLogo= '';
        this.schoolName= '';
        this.sign= '';
        this.template= '';
        this.title= '';
    }
}