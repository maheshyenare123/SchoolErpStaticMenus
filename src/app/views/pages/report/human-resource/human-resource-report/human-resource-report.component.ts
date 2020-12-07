import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-human-resource-report',
  templateUrl: './human-resource-report.component.html',
  styleUrls: ['./human-resource-report.component.scss']
})
export class HumanResourceReportComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }

  staffReport() {
		this.router.navigate(["/report/staff-report"])
  }
  
  payrollsReport() {
		this.router.navigate(["/report/payrolls-report"])
  }

}
