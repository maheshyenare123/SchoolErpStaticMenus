export class ApproveLeaveDtoModel {

    applyDate: string;
    approveBy: number;
    docs: string;
    fromDate: string;
    id: number;
    isActive: string;
    reason: string;
    requestType: number;
    status: number;
    studentSessionId: number;
    toDate: string;

    classId: number;
    sectionId: number;
    studentId: number;

    clear() {

        this.applyDate = '';
        this.approveBy = 0;
        this.docs = '';
        this.fromDate = '';
        this.id = 0;
        this.isActive = '';
        this.reason = '';
        this.requestType = 0;
        this.status = 0;
        this.studentSessionId = 0;
        this.toDate = '';
        this.classId=0;
        this.sectionId=0;
        this.studentId=0;
    }
}