export class FindResultsModel {
    // fields
    content: any[];
    // totalPages: number;
    totalElements:number;
    errorMessage: string;
    constructor(items: any[] = [], totalElements: number = 0, errorMessage: string = '') {
      this.content = items;
      this.totalElements = totalElements;
    }
    
  }