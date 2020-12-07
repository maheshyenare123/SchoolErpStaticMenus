export class EmailModel {

    emailEngine: string = 'smtp';
    smtpUsername: string;
    smtpPassword: string;
    smtpServer: string;
    smtpPort: string;
    smtpSecurity: string;
    clear() {
        this.emailEngine = 'smtp';
        this.smtpUsername = '';
        this.smtpPassword = '';
        this.smtpServer = '';
        this.smtpPort = '';
        this.smtpSecurity = '';
    }
}