export class FeesGroupModel {
    
    description: string;
    id: number;
    isActive: string;
    isSystem: number;
    name: string;

    clear() {
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.isSystem= 0;
        this.name= '';
    }
}