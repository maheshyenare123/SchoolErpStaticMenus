import { SectionModel } from './section.model';
import { SubjectModel } from './subject.model';
export class SubjectGroupDtoModel {

    classId: number;
    className: string;
    description: string;
    id: number;
    name: string;
    sections: SectionModel[];
    subjects: SubjectModel[];	

    clear() {
        this.classId = 0;
        this.className = '';
        this.description = '';
        this.id = 0;
        this.name = '';
        this.sections = [];
        this.subjects = [];
    }
}