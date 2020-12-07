export class LibraryBookDtoModel {

    author: string;
    avaliable: number;
    bookNo: string;
    bookTitle: string;
    description: string;
    id: number;
    isActive: string;
    isbnNo: string;
    perunitcost: number;
    postdate: string;
    publish: string;
    qty: number;
    rackNo: string;
    subject: string;

   
    clear() {
        this.author= '';
        this.avaliable= 0;
        this.bookNo= '';
        this.bookTitle= '';
        this.description= '';
        this.id= 0;
        this.isActive= '';
        this.isbnNo= '';
        this.perunitcost= 0;
        this.postdate= '';
        this.publish= '';
        this.qty= 0;
        this.rackNo= '';
        this.subject= '';
    }
}