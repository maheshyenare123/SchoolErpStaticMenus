export class FindResultsModel {
    // fields
    content: any[];
    totalPages: number;
    errorMessage: string;
    constructor(items: any[] = [], totalCount: number = 0, errorMessage: string = '') {
      this.content = items;
      this.totalPages = totalCount;
    }
    
  }