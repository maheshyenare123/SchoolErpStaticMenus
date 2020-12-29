export class BookIssueReturnModel{
    bookId:number;	
    duereturnDate:string;
    id: number;
    isActive:string;
    isReturned:number;
    issueDate:string
    libararyMemberId:number;
    returnDate:string;
    bookNo:string;
	bookTitle:string

  



    clear() {
        this.bookId= 0;
        this.duereturnDate= '';
        this.issueDate= '';
        this.returnDate= '';
        this.id= 0;
        this.isActive= '';
        this.isReturned= 0;
        this.libararyMemberId= 0;     
    }
    }    