import { TimestampModel } from "./timestamp.model";
export class SchSettingModel {

    address: string;
    admAutoInsert: number;
    admNoDigit: number;
    admPrefix: string;
    admStartFrom: string;
    admUpdateStatus: number;
    adminLogo: string;
    adminSmallLogo: string;
    admissionDate: number;
    attendenceType: number;
    bankAccountNo: number;
    biometric: number;
    biometricDevice: string;
    cast: number;
    category: number;
    classTeacher: string;
    createdAt: TimestampModel;
    cronSecretKey: string;
    currency: string;
    currencyPlace: string;
    currencySymbol: string;
    currentAddress: number;
    dateFormat: string;
    diseCode: string;
    email: string;
    fatherName: number;
    fatherOccupation: number;
    fatherPhone: number;
    fatherPic: number;
    feeDueDays: number;
    guardianAddress: number;
    guardianEmail: number;
    guardianPic: number;
    guardianRelation: number;
    hostelId: number;
    id: number;
    image: string;
    isActive: string;
    isBloodGroup: number;
    isDuplicateFeesInvoice: number;
    isRtl: string;
    isStudentHouse: number;
    langId: number;
    languages: string;
    lastname: number;
    localIdentificationNo: number;
    measurementDate: number;
    mobileNo: number;
    motherName: number;
    motherOccupation: number;
    motherPhone: number;
    motherPic: number;
    name: string;
    nationalIdentificationNo: number;
    onlineAdmission: number;
    permanentAddress: number;
    phone: string;
    previousSchoolDetails: number;
    religion: number;
    rollNo: number;
    routeList: number;
    rte: number;
    sessionId: number;
    staffAccountDetails: number;
    staffBasicSalary: number;
    staffContractType: number;
    staffCurrentAddress: number;
    staffDateOfJoining: number;
    staffDepartment: number;
    staffDesignation: number;
    staffEmergencyContact: number;
    staffEpfNo: number;
    staffFatherName: number;
    staffLastName: number;
    staffLeaves: number;
    staffMaritalStatus: number;
    staffMotherName: number;
    staffNote: number;
    staffPermanentAddress: number;
    staffPhone: number;
    staffPhoto: number;
    staffQualification: number;
    staffSocialMedia: number;
    staffUploadDocuments: number;
    staffWorkExperience: number;
    staffWorkLocation: number;
    staffWorkShift: number;
    staffidAutoInsert: number;
    staffidNoDigit: number;
    staffidPrefix: string;
    staffidStartFrom: string;
    staffidUpdateStatus: number;
    startMonth: string;
    studentEmail: number;
    studentHeight: number;
    studentNote: number;
    studentPhoto: number;
    studentWeight: number;
    theme: string;
    timeFormat: string;
    timezone: string;
    updatedAt: string;
    uploadDocuments: number;

    clear() {
        this.address= '';
        this.admAutoInsert= 0;
        this.admNoDigit= 0;
        this.admPrefix= '';
        this.admStartFrom= '';
        this.admUpdateStatus= 0;
        this.adminLogo= '';
        this.adminSmallLogo= '';
        this.admissionDate= 0;
        this.attendenceType= 0;
        this.bankAccountNo= 0;
        this.biometric= 0;
        this.biometricDevice= '';
        this.cast= 0;
        this.category= 0;
        this.classTeacher= '';
        this.createdAt= new TimestampModel;
        this.cronSecretKey= '';
        this.currency= '';
        this.currencyPlace= '';
        this.currencySymbol= '';
        this.currentAddress= 0;
        this.dateFormat= '';
        this.diseCode= '';
        this.email= '';
        this.fatherName= 0;
        this.fatherOccupation= 0;
        this.fatherPhone= 0;
        this.fatherPic= 0;
        this.feeDueDays= 0;
        this.guardianAddress= 0;
        this.guardianEmail= 0;
        this.guardianPic= 0;
        this.guardianRelation= 0;
        this.hostelId= 0;
        this.id= 0;
        this.image= '';
        this.isActive= '';
        this.isBloodGroup= 0;
        this.isDuplicateFeesInvoice= 0;
        this.isRtl= '';
        this.isStudentHouse= 0;
        this.langId= 0;
        this.languages= '';
        this.lastname= 0;
        this.localIdentificationNo= 0;
        this.measurementDate= 0;
        this.mobileNo= 0;
        this.motherName= 0;
        this.motherOccupation= 0;
        this.motherPhone= 0;
        this.motherPic= 0;
        this.name= '';
        this.nationalIdentificationNo= 0;
        this.onlineAdmission= 0;
        this.permanentAddress= 0;
        this.phone= '';
        this.previousSchoolDetails= 0;
        this.religion= 0;
        this.rollNo= 0;
        this.routeList= 0;
        this.rte= 0;
        this.sessionId= 0;
        this.staffAccountDetails= 0;
        this.staffBasicSalary= 0;
        this.staffContractType= 0;
        this.staffCurrentAddress= 0;
        this.staffDateOfJoining= 0;
        this.staffDepartment= 0;
        this.staffDesignation= 0;
        this.staffEmergencyContact= 0;
        this.staffEpfNo= 0;
        this.staffFatherName= 0;
        this.staffLastName= 0;
        this.staffLeaves= 0;
        this.staffMaritalStatus= 0;
        this.staffMotherName= 0;
        this.staffNote= 0;
        this.staffPermanentAddress= 0;
        this.staffPhone= 0;
        this.staffPhoto= 0;
        this.staffQualification= 0;
        this.staffSocialMedia= 0;
        this.staffUploadDocuments= 0;
        this.staffWorkExperience= 0;
        this.staffWorkLocation= 0;
        this.staffWorkShift= 0;
        this.staffidAutoInsert= 0;
        this.staffidNoDigit= 0;
        this.staffidPrefix= '';
        this.staffidStartFrom= '';
        this.staffidUpdateStatus= 0;
        this.startMonth= '';
        this.studentEmail= 0;
        this.studentHeight= 0;
        this.studentNote= 0;
        this.studentPhoto= 0;
        this.studentWeight= 0;
        this.theme= '';
        this.timeFormat= '';
        this.timezone= '';
        this.updatedAt= '';
        this.uploadDocuments= 0;
    }
}