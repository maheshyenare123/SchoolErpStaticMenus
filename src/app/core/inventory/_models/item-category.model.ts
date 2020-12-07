export class ItemCategoryModel {

    description: string;
    id: number;
    isActive: string;
    itemCategory: string;
    clear() {
    
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.itemCategory= '';
        
    }
}