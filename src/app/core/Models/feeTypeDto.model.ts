export class FeeTypeDtoModel {

    code: string;
    description: string;
    feecategoryId: number;
    id: number;
    isActive: string;
    type: string;

    clear() {
        this.code= '';
        this.description= '';
        this.feecategoryId= 0;
        this.id= 0;
        this.isActive= '';
        this.type= '';
    }
}