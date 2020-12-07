import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-fees-collection-report',
  templateUrl: './fees-collection-report.component.html',
  styleUrls: ['./fees-collection-report.component.scss']
})
export class FeesCollectionReportComponent implements OnInit {
  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  feesStatement() {
		this.router.navigate(["/report/fees-statement"])
  }
  
  balanceFeesReport() {
		this.router.navigate(["/report/balance-fees-report"])
  }

  feesCollectionReport() {
		this.router.navigate(["/report/fees-collection-report"])
  }

  onlineFeesCollectionReport() {
		this.router.navigate(["/report/online-fees-collection-report"])
  }

  incomeReport() {
		this.router.navigate(["/report/income-report"])
  }

  expenseReport() {
		this.router.navigate(["/report/expense-report"])
  }

  payrollReport() {
		this.router.navigate(["/report/payroll-report"])
  }

  incomeGroupReport() {
		this.router.navigate(["/report/income-group-report"])
  }

  expenseGroupReport() {
		this.router.navigate(["/report/expense-group-report"])
  }

}
