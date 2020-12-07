export class ItemStockDtoModel {

    attachment: string;
    date: string;
    description: string;
    id: number;
    isActive: string;
    itemId: number;
    itemName: string;
    itemPhoto: string;
    itemStore: string;
    itemStoreId: number;
    itemSupplier: string;
    itemSupplierId: number;
    purchasePrice: string;
    quantity: number;
    symbol: string;

    clear() {
        this.attachment= '';
        this.date= '';
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.itemId= 0;
        this.itemName= '';
        this.itemPhoto= '';
        this.itemStore= '';
        this.itemStoreId= 0;
        this.itemSupplier= '';
        this.itemSupplierId= 0;
        this.purchasePrice= '';
        this.quantity= 0;
        this.symbol= '';
    }
}