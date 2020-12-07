export class LoginRequestModel {

    password: string;
    username: string;


    clear() {
       this.password = '';
       this.username = '';
    }
}