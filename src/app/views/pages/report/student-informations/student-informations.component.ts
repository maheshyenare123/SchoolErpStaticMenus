import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-student-information',
  templateUrl: './student-informations.component.html',
  styleUrls: ['./student-informations.component.scss']
})
export class StudentInformationsComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit(): void {
  }


  studentReport() {
		this.router.navigate(["/report/student-report"])
  }
  
  guardianReport() {
		this.router.navigate(["/report/guardian-report"])
  }

  studentHistory() {
		this.router.navigate(["/report/student-history"])
  }

  studentLoginCredential() {
		this.router.navigate(["/report/student-login-credential"])
  }

  classSubjectReport() {
		this.router.navigate(["/report/class-subject-report"])
  }

  admissionReport() {
		this.router.navigate(["/report/admission-report"])
  }

  siblingReport() {
		this.router.navigate(["/report/sibling-report"])
  }

  studentProfile() {
		this.router.navigate(["/report/student-profile"])
  }

  homeworkEvaluationReport() {
		this.router.navigate(["/report/homework-evaluation-report"])
  }

}
