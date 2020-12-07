export class SubjectDtoModel {

    canAdd: number;
    canDelete: number;
    canEdit: number;
    canView: number;
    id: number;
    permissionCategoryId: number;
    permissionCategoryName: string;
    roleId: number;
    roleName: string;

    clear() {
        this.canAdd = 0;
        this.canDelete = 0;
        this.canEdit = 0;
        this.canView = 0;
        this.id = 0;
        this.permissionCategoryId = 0;
        this.permissionCategoryName = '';
        this.roleId = 0;
        this.roleName = '';
    }
}