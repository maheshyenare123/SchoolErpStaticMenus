export class DepartmentModel {

    departmentName: string;
    id: number;
    isActive: string;

    clear() {
        this.departmentName = '';
        this.id = 0;
        this.isActive = '';
    }
}