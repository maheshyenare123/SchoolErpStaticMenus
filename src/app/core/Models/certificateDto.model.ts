export class CertificateDtoModel {

    backgroundImage: string;
    centerFooter: string;
    centerHeader: string;
    certificateName: string;
    certificateText: string;
    contentHeight: number;
    contentWidth: number;
    createdFor: number;
    enableImageHeight: number;
    enableStudentImage: number;
    footerHeight: number;
    headerHeight: number;
    id: number;
    isActive: string;
    leftFooter: string;
    leftHeader: string;
    rightFooter: string;
    rightHeader: string;
    status: number;

    clear() {
        this.backgroundImage= '';
        this.centerFooter= '';
        this.centerHeader= '';
        this.certificateName= '';
        this.certificateText= '';
        this.contentHeight= 0;
        this.contentWidth= 0;
        this.createdFor= 0;
        this.enableImageHeight= 0;
        this.enableStudentImage= 0;
        this.footerHeight= 0;
        this.headerHeight= 0;
        this.id= 0;
        this.isActive= '';
        this.leftFooter= '';
        this.leftHeader= '';
        this.rightFooter= '';
        this.rightHeader= '';
        this.status= 0;
    }
}