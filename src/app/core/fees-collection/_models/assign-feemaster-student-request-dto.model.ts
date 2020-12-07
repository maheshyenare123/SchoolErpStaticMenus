import { AssignFeesStudentModel } from '..';

export class AssignFeemasterStudentRequestDtoModel {

    feeGroupId: number;
    feeGroupName: string;
    studentDtos: AssignFeesStudentModel[];

    // clear() {
        
    //     this.feeGroupId= 0;
    //     this.feeGroupName= '';
    //     this.studentDtos = [];

    // }
}