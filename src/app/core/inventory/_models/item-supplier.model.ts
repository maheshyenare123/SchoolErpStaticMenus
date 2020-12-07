export class ItemSupplierModel {

    address: string;
    contactPersonEmail: string;
    contactPersonName: string;
    contactPersonPhone: string;
    description: string;
    email: string;
    id: number;
    isActive: string;
    itemSupplier: string;
    phone: string;

    clear() {
        this.address = '';  
        this.contactPersonEmail = '';
        this.contactPersonName = '';
        this.contactPersonPhone = '';
        this.description = '';
        this.email = '';
        this.id = 0;
        this.isActive = '';
        this.itemSupplier = '';
        this.phone = '';
    }
}