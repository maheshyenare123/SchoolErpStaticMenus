export class ItemDtoModel {

    description: string;
    id: number;
    isActive: string;
    itemCategory: string;
    itemCategoryId: number;
    itemPhoto: string;
    itemStore: string;
    itemStoreId: number;
    itemSupplier: string;
    itemSupplierId: number;
    name: string;
    quantity: number;
    unit: string;
   
    clear() {
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.itemCategory= '';
        this.itemCategoryId= 0;
        this.itemPhoto= '';
        this.itemStore= '';
        this.itemStoreId= 0;
        this.itemSupplier= '';
        this.itemSupplierId= 0;
        this.name= '';
        this.quantity= 0;
        this.unit= '';
    }
}