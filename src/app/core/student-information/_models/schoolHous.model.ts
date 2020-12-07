export class SchoolHousModel {

  
    description: string;
    houseName: string;
    id: number;
    isActive: string;
    
    clear() {
        this.description = '';
        this.houseName = '';
        this.id = 0;
        this.isActive = '';
        
       
    }
}