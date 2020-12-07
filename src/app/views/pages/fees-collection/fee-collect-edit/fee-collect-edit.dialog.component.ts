// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentFeeDepositeModel, selectStudentFeeDepositesActionLoading, StudentFeeDepositeUpdated, selectLastCreatedStudentFeeDepositeId, StudentFeeDepositeOnServerCreated, StudentFeeDepositeService, StudentFeeAmountDetailsService, selectLastCreatedStudentFeeAmountDetailsId, StudentFeeAmountDetailsOnServerCreated, StudentFeeAmountDetailsUpdated } from '../../../../core/fees-collection';
import { StudentDtoModel, StudentService } from 'src/app/core/student-information';
import { SectionDtoModel, StudentClassModel, SectionService, StudentClassService } from 'src/app/core/academics';
import { StudentModel } from 'src/app/core/Models/student.model';
import { StudentFeeAmountDetailsModel } from 'src/app/core/fees-collection/_models/student-fee-amount-details.model';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-fee-collect-edit-dialog',
	templateUrl: './fee-collect-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class FeeCollectEditDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
studentFeeDeposite: StudentFeeDepositeModel;
studentFeeAmountDetails: StudentFeeAmountDetailsModel;
studentFeeAmountDetailsForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
studentList: StudentDtoModel[] = [];
	feesDiscountList: any[];
	student: StudentModel;
	errormsg: string;

constructor(public dialogRef: MatDialogRef<FeeCollectEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService,
	private studentClassService: StudentClassService,
	private sectionService: SectionService,
	private studentService: StudentService,
	private studentFeeDepositeService:StudentFeeDepositeService,
	private studentFeeAmountDetailsService:StudentFeeAmountDetailsService) {
}

/**
 * On init
 */
ngOnInit() {
	debugger
	this.store.pipe(select(selectStudentFeeDepositesActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	const studentFeeAmountDetails = new StudentFeeAmountDetailsModel();
	studentFeeAmountDetails.clear(); // Set all defaults fields
	this.studentFeeDeposite = this.data.studentFeeDeposite;

		this.studentFeeAmountDetails = studentFeeAmountDetails
		this.studentFeeAmountDetails.amount = this.studentFeeDeposite.balance;
		this.studentFeeAmountDetails.amountFine = this.studentFeeDeposite.fine;
		this.studentFeeAmountDetails.paymentMode = 'Cash';
		this.studentFeeAmountDetails.feeMastersId = this.studentFeeDeposite.feeMastersId;
		this.studentFeeAmountDetails.studentFeeMasterId = this.studentFeeDeposite.studentFeeMasterId;
	

	this.student =  this.data.student
	console.log(this.studentFeeDeposite)
	this.createForm();
}
	//get All Class List

	
  


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
	onFeesDiscountChange(id){
		this.feesDiscountList.map(item=>{
			if(item.id == id){
				let amount = this.studentFeeAmountDetailsForm.get("amount").value - item.feesDiscountAmount;
				this.studentFeeAmountDetailsForm.get("amount").setValue(amount)
				this.studentFeeAmountDetailsForm.get("amountDiscount").setValue(item.feesDiscountAmount)
			}
		}) 
	}
	amountEnter($event){
		this.errormsg ="";

	}

	loadAllClasses() {
		debugger
		this.studentClassService.getAllStudentClasss().subscribe(res => {
			const data = res['data'];
			this.classList = data['content'];
			console.log(this.classList)
		}, err => {
		});
	}
	loadAllSectionsByClassId(id:number) {
		debugger
		this.sectionService.getAllSections().subscribe(res => {
			const data = res['data'];
			this.sectionList = data['content'];
			console.log(this.sectionList)
			
		}, err => {
		});
	}

	loadAllStudent() {
		debugger
		this.studentService.getAllStudents().subscribe(res => {
			const data = res['data'];
			this.studentList = data['content'];
			console.log(this.studentList)
		
		
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
	// amount: number;
    // amountDiscount: number;
    // amountFine: number;
    // date: string;
    // description: string;
    // feeMastersId: number;
    // paymentMode: string;
    // studentFeeMasterId: number;
	if(this.data.type == 'single'){
		this.studentFeeAmountDetailsForm = this.fb.group({

			amount: [this.studentFeeAmountDetails.amount,],
			amountDiscount: [this.studentFeeAmountDetails.amountDiscount,],
			amountFine: [this.studentFeeAmountDetails.amountFine,],
			date: [this.typesUtilsService.getDateFromString(this.studentFeeAmountDetails.date), Validators.compose([Validators.nullValidator])],
			description: [this.studentFeeAmountDetails.description,],
			feeMastersId: [this.studentFeeAmountDetails.feeMastersId,],
			paymentMode: [this.studentFeeAmountDetails.paymentMode,],
			studentFeeMasterId: [this.studentFeeAmountDetails.studentFeeMasterId,]
			});
	}

	if(this.data.type == 'All'){
		this.studentFeeAmountDetailsForm = this.fb.group({

			amount: [this.studentFeeAmountDetails.amount,],
			amountDiscount: [this.studentFeeAmountDetails.amountDiscount,],
			amountFine: [this.studentFeeAmountDetails.amountFine,],
			date: [this.typesUtilsService.getDateFromString(this.studentFeeAmountDetails.date), Validators.compose([Validators.nullValidator])],
			description: [this.studentFeeAmountDetails.description,],
			feeMastersId: [this.studentFeeAmountDetails.feeMastersId,],
			paymentMode: [this.studentFeeAmountDetails.paymentMode,],
			studentFeeMasterId: [this.studentFeeAmountDetails.studentFeeMasterId,]
		
			});
	}

	
}

/**
 * Returns page title
 */
getTitle(): string {
	// if (this.studentFeeDeposite.id > 0) {
	// 	return `Edit Approve Leave '${this.studentFeeDeposite.studentSessionId}'`;
	// }

	return 'Collect Fee';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.studentFeeAmountDetailsForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared studentFeeAmountDetails
 */
preparestudentFeeAmountDetails(): StudentFeeAmountDetailsModel {
	const controls = this.studentFeeAmountDetailsForm.controls;
	const _studentFeeAmountDetails = new StudentFeeAmountDetailsModel();

		const _date = controls.date.value;
		if (_date) {
			_studentFeeAmountDetails.date = this.typesUtilsService.dateFormat(_date);
		} else {
			_studentFeeAmountDetails.date = '';
		}
		

	_studentFeeAmountDetails.amount = controls.amount.value;
	_studentFeeAmountDetails.amountDiscount = controls.amountDiscount.value;
	_studentFeeAmountDetails.amountFine = controls.amountFine.value;
	_studentFeeAmountDetails.description = controls.description.value;
	_studentFeeAmountDetails.feeMastersId = controls.feeMastersId.value;
	_studentFeeAmountDetails.paymentMode = controls.paymentMode.value;
	_studentFeeAmountDetails.studentFeeMasterId = controls.studentFeeMasterId.value;
	// amount: number;
    // amountDiscount: number;
    // amountFine: number;
    // date: string;
    // description: string;
    // feeMastersId: number;
    // paymentMode: string;
    // studentFeeMasterId: number;
	
	return _studentFeeAmountDetails;
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.studentFeeAmountDetailsForm.controls;
	/** check form */
	if (this.studentFeeAmountDetailsForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	
	if(this.studentFeeAmountDetailsForm.get("amount").value > this.studentFeeDeposite.amount){
		this.errormsg = "Deposit amount can not be grater than remaining";
		return
	}else{
		this.errormsg ="";
	}


	return
	const editedStudentFeeAmountDetails = this.preparestudentFeeAmountDetails();
	// if (editedStudentFeeAmountDetails.feeMastersId > 0) {
	// 	this.updateStudentFeeAmountDetails(editedStudentFeeAmountDetails);
	// } else {
		this.createStudentFeeAmountDetails(editedStudentFeeAmountDetails);
	// }
}

/**
 * Update studentFeeAmountDetails
 *
 * @param _studentFeeAmountDetails: StudentFeeAmountDetailsModel
 */
updateStudentFeeAmountDetails(_studentFeeAmountDetails: StudentFeeAmountDetailsModel) {
	const updateStudentFeeAmountDetails: Update<StudentFeeAmountDetailsModel> = {
		id: _studentFeeAmountDetails.feeMastersId,
		changes: _studentFeeAmountDetails
	};
	this.store.dispatch(new StudentFeeAmountDetailsUpdated({
		partialStudentFeeAmountDetails: updateStudentFeeAmountDetails,
		studentFeeAmountDetails: _studentFeeAmountDetails
	}));

	// integrate StudentFeeAmountDetails  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _studentFeeAmountDetails, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _studentFeeAmountDetails, isEdit: true }
}

/**
 * Create StudentFeeAmountDetails
 *
 * @param _studentFeeAmountDetails: StudentFeeAmountDetailsModel
 */
createStudentFeeAmountDetails(_studentFeeAmountDetails: StudentFeeAmountDetailsModel) {
	this.store.dispatch(new StudentFeeAmountDetailsOnServerCreated({ studentFeeAmountDetails: _studentFeeAmountDetails }));
	this.dialogRef.close({ _studentFeeAmountDetails, isEdit: false });
	// this.componentSubscriptions = this.store.pipe(
	// 	select(selectLastCreatedStudentFeeAmountDetailsId),
	// 	delay(1000), // Remove this line
	// ).subscribe(res => {
	// 	if (!res) {
	// 		return;
	// 	}

	// 	this.dialogRef.close({ _studentFeeAmountDetails, isEdit: false });
	// });

	// integrate studentFeeAmountDetails  create api
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

onSelect(event) {
	console.log(event);
	this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
	console.log(event);
	this.files.splice(this.files.indexOf(event), 1);
  }

  _keyPress(event: any) {
	const pattern = /[0-9]/;
	let inputChar = String.fromCharCode(event.charCode);
	if (!pattern.test(inputChar)) {
		event.preventDefault();

	}
}
}

