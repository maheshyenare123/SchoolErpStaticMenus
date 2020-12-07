export class StaffDesignationModel {

    designation: string;
    id: number;
    isActive: string;

    clear() {
        this.designation = '';
        this.id = 0;
        this.isActive = '';
    }
}