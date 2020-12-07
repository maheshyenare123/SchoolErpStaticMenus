export class SessionModel {

    id: number;
    isActive: string;
    session: string;
    
    clear() {
        this.id = 0;
        this.isActive = '';
        this.session = '';
    }
}