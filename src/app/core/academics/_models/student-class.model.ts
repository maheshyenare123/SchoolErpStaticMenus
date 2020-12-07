
import { SectionDtoModel } from './sectionDto.model';
export class StudentClassModel {

    classses: string;
    id: number;
    isActive: string;
    section:SectionDtoModel[];

    clear() {
        
        this.classses = '';
        this.id = 0;
        this.isActive = '';
        this.section =[];
    }
}