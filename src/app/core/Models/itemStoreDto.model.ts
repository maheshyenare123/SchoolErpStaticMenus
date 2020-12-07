export class ItemStoreDtoModel {

    code: string;
    description: string;
    id: number;
    isActive: string;
    itemStore: string;

    clear() {
        this.code= '';
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.itemStore= '';
    }
}