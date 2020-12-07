export class ItemIssueDtoModel {

    id: number;
    isActive: string;
    isReturned: number;
    issueBy: string;
    issueDate: string;
    issueTo: string;
    issueType: string;
    itemCategory: string;
    itemCategoryId: number;
    itemId: number;
    itemName: string;
    note: string;
    quantity: number;
    returnDate: string;

    clear() {
        this.id= 0;
        this.isActive= '';
        this.isReturned= 0;
        this.issueBy= '';
        this.issueDate= '';
        this.issueTo= '';
        this.issueType= '';
        this.itemCategory= '';
        this.itemCategoryId= 0;
        this.itemId= 0;
        this.itemName= '';
        this.note= '';
        this.quantity= 0;
        this.returnDate= '';
    }
}