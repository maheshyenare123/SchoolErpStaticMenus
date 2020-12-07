
import { SectionDtoModel } from './sectionDto.model';
export class ClassDtoModel {

    classses: string;
    id: number;
    isActive: string;
    section:SectionDtoModel

    clear() {
        
        this.classses = '';
        this.id = 0;
        this.isActive = '';
        this.section =new SectionDtoModel;
    }
}