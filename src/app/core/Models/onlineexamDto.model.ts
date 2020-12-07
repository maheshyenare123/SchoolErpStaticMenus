export class OnlineexamDtoModel {

    attempt: number;
    description: string;
    duration: string;
    exam: string;
    examFrom: string;
    examTo: string;
    id: number;
    isActive: string;
    passingPercentage: number;
    publishResult: number;
    sessionID: number;
    timeFrom: string;
    timeTo: string;

    clear() {
       this.attempt= 0;
       this.description= '';
       this.duration= '';
       this.exam= '';
       this.examFrom= '';
       this.examTo= '';
       this.id= 0;
       this.isActive= '';
       this.passingPercentage= 0;
       this.publishResult= 0;
       this.sessionID= 0;
       this.timeFrom= '';
       this.timeTo= '';
    }
}