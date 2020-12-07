export class TemplateMarksheetDtoModel {

    backgroundImg: string;
    date: string;
    examCenter: string;
    examName: string;
    examSession: number;
    heading: string;
    id: number;
    isActive: string;
    isAdmissionNo: number;
    isCustomfield: number;
    isDivision: number;
    isDob: number;
    isFatherName: number;
    isMotherName: number;
    isName: number;
    isPhoto: number;
    isRollNo: number;
    leftLogo: string;
    leftSign: string;
    middleSign: string;
    rightLogo: string;
    rightSign: string;
    schoolName: string;
    template: string;
    title: string;

    clear() {
        this.backgroundImg= '';
        this.date= '';
        this.examCenter= '';
        this.examName= '';
        this.examSession= 0;
        this.heading= '';
        this.id= 0;
        this.isActive= '';
        this.isAdmissionNo= 0;
        this.isCustomfield= 0;
        this.isDivision= 0;
        this.isDob= 0;
        this.isFatherName= 0;
        this.isMotherName= 0;
        this.isName= 0;
        this.isPhoto= 0;
        this.isRollNo= 0;
        this.leftLogo= '';
        this.leftSign= '';
        this.middleSign= '';
        this.rightLogo= '';
        this.rightSign= '';
        this.schoolName= '';
        this.template= '';
        this.title= '';
    }
}