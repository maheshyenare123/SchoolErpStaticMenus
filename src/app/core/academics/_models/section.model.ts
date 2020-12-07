export class SectionModel {

    id: number;
    name: string;
    subjectGroupClassSectionId: number;
    
    clear() {
        this.id = 0;
        this.name = '';
        this.subjectGroupClassSectionId = 0;
    }
    constructor(id:number,name:string,subjectGroupClassSectionId:number){
        this.id=id;
        this.name=name;
        this.subjectGroupClassSectionId=subjectGroupClassSectionId
    }
    
}