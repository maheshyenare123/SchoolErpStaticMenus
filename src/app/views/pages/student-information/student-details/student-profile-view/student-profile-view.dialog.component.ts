// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray} from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentDtoModel, selectStudentsActionLoading, StudentUpdated, selectLastCreatedStudentId, StudentOnServerCreated } from '../../../../../core/student-information';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { StudentFeeDepositeService } from 'src/app/core/fees-collection';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-student-profile-view-dialog',
	templateUrl: './student-profile-view.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class StudentProfileViewDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
student: any;
searchFormData :any;
documentForm: FormGroup;

hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
	title: any;
	document: any;
	formShow: boolean= false;


	studentfeedeposite

	collectionFeeShowFlag: boolean = false;
	studentListFlag: boolean = true;
	feesDepositeList: any;
	feesDiscountList: any;
  
	totalAmount: number = 0;
	totalDiscount: number = 0;
	totalFine: number = 0;
	totalPaid: number = 0; 
	totalBalance: number = 0;


constructor(public dialogRef: MatDialogRef<StudentProfileViewDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService,
	private studentFeeDepositeService:StudentFeeDepositeService) {
}

/**
 * On init
 */
ngOnInit() {
	debugger
	this.store.pipe(select(selectStudentsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	debugger
	this.student = this.data.student;
	this.createForm();
	this.getStudentFeesDetails();

}

getStudentFeesDetails(){
	this.student 

    this.getStudentFeeDepositeById();
    this.loadAllFeesDiscount();
  }

  getStudentFeeDepositeById(){
    debugger
    this.feesDepositeList = []
    this.studentFeeDepositeService.getStudentFeeDepositeById(this.student.studentSessionId).subscribe(res => {
      const data = res['data'];
      this.feesDepositeList = data['studentFeeDetails'];
      console.log(this.feesDepositeList)
      this.totalAmount= 0;
      this.totalDiscount= 0;
      this.totalFine= 0;
      this.totalPaid= 0; 
      this.totalBalance= 0;

      this.feesDepositeList.map(item=>{
        this.totalAmount += item.amount;
        this.totalDiscount += item.discount;
        this.totalFine += item.fine;
        this.totalPaid += item.paid;
        this.totalBalance += item.balance;

      })

    }, err => {
    });
}

loadAllFeesDiscount() {
	debugger
	this.feesDiscountList = []
this.studentFeeDepositeService.getStudentDiscountById(this.student.studentSessionId).subscribe(res => {
  const data1 = res['data'];
  this.feesDiscountList = data1;
  console.log(this.feesDiscountList)
}, err => {
});
}



/**
 * On destroy
 */
ngOnDestroy() {
	if (this.componentSubscriptions) {
		this.componentSubscriptions.unsubscribe();
	}
}
createForm() {
    this.documentForm = this.fb.group({
		title: [this.title, ''],
		document: [this.document, ],
	});
}



/**
 * Returns page title
 */
getTitle(): string {
	if (this.student.id > 0) {
		return `Student'${this.student.id}'`;
	}

	return 'Student';
}
onSelect(event) {
	console.log(event);
	this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
	console.log(event);
	this.files.splice(this.files.indexOf(event), 1);
  }
uploadDoc(){
this.formShow = true;
}
downloadDoc(){

}
deleteDoc(){

}

onSubmit(){

	this.formShow = false
}

tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
	console.log('tabChangeEvent => ', tabChangeEvent); 
	if(tabChangeEvent.tab.textLabel === 'Documents'){
		this.formShow = false
	}
}
}

