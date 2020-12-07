export class RolesDtoModel {

    id: number;
    isActive: string;
    isSuperadmin: number;
    isSystem: number;
    name: string;
    roleName: string;
    slug: string;

    clear() {
        this.id = 0;
        this.isActive = '';
        this.isSuperadmin = 0;
        this.isSystem = 0;
        this.name = '';
        this.roleName = '';
        this.slug = '';
    }


    constructor(id:number,name:string){
        this.id=id;
        this.name=name;
       
    }
}