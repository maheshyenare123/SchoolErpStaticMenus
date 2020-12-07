
import { StaffDtoModel } from './staffDto.model';
import { SectionDtoModel } from './sectionDto.model';

export class AssignClassTeacherModel {
    // id : number;
    // classId: number;
    // className: string;
    // sections: SectionDtoModel;
    // staffs: StaffDtoModel[]=[];


    classId: number;
    classes: string;
    id: number;
    section: string;
    sectionId: number;
    staffId: number;
    staffName: string;



    clear() {

        this.classId=0;
        this.classes='';
        this.id= 0;
        this.section='';
        this.sectionId=0;
        this.staffId=0;
        this.staffName='';


        // this.staffs =new StaffDtoModel;
    }
}