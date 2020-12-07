import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-library-report',
  templateUrl: './library-report.component.html',
  styleUrls: ['./library-report.component.scss']
})
export class LibraryReportComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  bookIssueReport() {
		this.router.navigate(["/report/book-issue-report"])
  }

  bookDueReport() {
		this.router.navigate(["/report/book-due-report"])
  }

  bookInventoryReport() {
		this.router.navigate(["/report/book-inventory-report"])
  }

  bookIssueReturnReport() {
		this.router.navigate(["/report/book-issue-return-report"])
  }

}