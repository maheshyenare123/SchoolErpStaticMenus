export class SessionDtoModel {

    id: number;
    isActive: string;
    session: string;
    
    clear() {
        this.id = 0;
        this.isActive = '';
        this.session = '';
    }
}