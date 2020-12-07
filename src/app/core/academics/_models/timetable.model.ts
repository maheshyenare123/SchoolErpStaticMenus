


export class TimetableDayModel {
monday:TimetableModel[];
tuesday:TimetableModel[];
wednesday:TimetableModel[];
thursday:TimetableModel[];
friday:TimetableModel[];
saturday:TimetableModel[];
sunday:TimetableModel[];

}
export class TimetableModel {
    id: number;
    day: string;
    roomNo: number;
    timeFrom: string;
    timeTo: string;
    staffId: number;
    staffName: string;
    isActive: string;
    subjectId: number;
    subjectName: string;
    classesId: number;
    classes: string;
    sectionId:number;
    section: string;

    clear() {

        this.id=0;
        this.day='';
        this.roomNo=0;
        this.timeFrom='';
        this.timeTo='';
        this.staffId=0;
        this.staffName='';
        this.isActive='';
        this.subjectId=0;
        this.subjectName='';
        this.classesId=0;
        this.classes='';
        this.sectionId=0;
        this.section='';

    }
}