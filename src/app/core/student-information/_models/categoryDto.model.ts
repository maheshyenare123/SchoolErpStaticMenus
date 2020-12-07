export class CategoryDtoModel {

    category: string;
    id: number;
    isActive: string;

    clear() {
        this.id = 0;
        this.category = '';;
        this.isActive = '';
    }
}