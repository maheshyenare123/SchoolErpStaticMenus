import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  stockReport() {
		this.router.navigate(["/report/stock-report"])
  }
  
  addItemReport() {
		this.router.navigate(["/report/add-item-report"])
  }

  issueItemReport() {
		this.router.navigate(["/report/issue-item-report"])
  }

}