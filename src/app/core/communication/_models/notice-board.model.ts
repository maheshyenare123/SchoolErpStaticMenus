import { RolesDtoModel } from '../../Models/rolesDto.model';

export class NoticeBoardModel {

    title: string;
    message: string; 
    messageTo: RolesDtoModel[];
    id: number;
    isActive: string;
    noticeDate: string;
    publishOn: string;
   
    clear() {
    
        this.title= '';
        this.message= '';
        this.messageTo = [];
        this.id= 0;
        this.isActive= '';
        this.noticeDate= '';
        this.noticeDate= '';
        
    }
}