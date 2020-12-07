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
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VisitorBookModel, selectVisitorBooksActionLoading, VisitorBookUpdated, selectLastCreatedVisitorBookId, VisitorBookOnServerCreated, VisitorPurposeService, VisitorPurposeModel } from '../../../../../core/front-office';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-visitor-book-edit-dialog',
	templateUrl: './visitor-book-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class VisitorBookEditDialogComponent implements OnInit, OnDestroy {
// Public properties
visitorsBook: VisitorBookModel;
visitorsBookForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
	currentTime: string;

	visitorPuposeList:VisitorPurposeModel[]=[];
constructor(public dialogRef: MatDialogRef<VisitorBookEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService,
	private purposeService:VisitorPurposeService,) {
}

/**
 * On init
 */
ngOnInit() {

	this.loadAllVisitorPurposes();
	this.store.pipe(select(selectVisitorBooksActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	debugger
	this.visitorsBook = this.data.visitorsBook;
	this.createForm();
	// this.showTime();
	
}
loadAllVisitorPurposes() {
	debugger
	this.purposeService.getAllVisitorPurposes().subscribe(res => {
		const data=res['data'];
		this.visitorPuposeList=data['content'];
	}, err => {
	});
}
// showTime(){
// 	debugger
//     setInterval(() => {
// 		var now = new Date();
// 		now.setHours(now.getHours());
// 		var isPM = now.getHours() >= 12;
// 		var m = now.getMinutes()
// 		var isMidday = now.getHours() == 12;
// 		var result = document.querySelector('#result');
		
		
// 		var time = [now.getHours() - (isPM && !isMidday ? 12 : 0), 
// 					(m < 10) ? "0" + m : m ].join(':') +
// 				   (isPM ? ' pm' : ' am');
// 				   this.currentTime = time;
// 				   this.visitorsBook.inTime =  this.currentTime;
// 				   this.visitorsBook.outTime =  this.currentTime;
// 				   console.log(this.currentTime)
// 		result.innerHTML = 'the current time plus two hours = '+ time;
		
//     },1000)
    
//   }

/**
 * On destroy
 */
ngOnDestroy() {
	if (this.componentSubscriptions) {
		this.componentSubscriptions.unsubscribe();
	}
}

createForm() {
	this.visitorsBookForm = this.fb.group({
		// contact: string;
		// date: string;
		// email: string;
		// id: number;
		// idProof: string;
		// image: string;
		// inTime: string;
		// isActive: string;
		// name: string;
		// noOfPepple: number;
		// note: string;
		// outTime: string;
		// purpose: string;
		// source: string;
		contact: [this.visitorsBook.contact,[Validators.required,
			Validators.pattern("^[0-9]*$"),
			Validators.maxLength(10)]],
		date: [this.typesUtilsService.getDateFromString(this.visitorsBook.date), Validators.compose([Validators.nullValidator])],
		email: [this.visitorsBook.email,Validators.compose([Validators.email])],
		// Validators.compose([Validators.required, Validators.email])
		idProof: [this.visitorsBook.idProof, ''],
		image: [this.visitorsBook.image, ''],
		inTime: [this.visitorsBook.inTime, '' ],
		isActive: [this.visitorsBook.isActive, ''],
		name: [this.visitorsBook.name, Validators.required],
		noOfPepple: [this.visitorsBook.noOfPepple, [Validators.pattern("^[0-9]*$"),
			Validators.maxLength(10)]],
		note: [this.visitorsBook.note, ''],
		outTime: [this.visitorsBook.outTime, ''],
		purpose: [this.visitorsBook.purpose, Validators.required],
		source: [this.visitorsBook.source, ''],
		

	});
	console.log(this.visitorsBookForm);
}

/**
 * Returns page title
 */
getTitle(): string {
	if (this.visitorsBook.id > 0) {
		return `Edit visitorsBook '${this.visitorsBook.name}'`;
	}

	return 'New visitorsBook';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.visitorsBookForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared visitorsBook
 */
preparevisitorsBook(): VisitorBookModel {
	const controls = this.visitorsBookForm.controls;
	const _visitorsBook = new VisitorBookModel();
	_visitorsBook.id = this.visitorsBook.id;

if(_visitorsBook.id>0){
	_visitorsBook.isActive = controls.isActive.value;
}else{
	_visitorsBook.isActive = 'yes'
}

	_visitorsBook.contact = controls.contact.value;
	const _date = controls.date.value;
	if (_date) {
		_visitorsBook.date = this.typesUtilsService.dateFormat(_date);
		
	} else {
		_visitorsBook.date = '';
	}
	_visitorsBook.email = controls.email.value;
	_visitorsBook.idProof = controls.idProof.value;
	_visitorsBook.image = controls.image.value;
	_visitorsBook.inTime =  controls.inTime.value;
	// if (_intime) {
	// 	_visitorsBook.inTime = this.typesUtilsService.dateFormat(_intime);
	// } else {
	// 	_visitorsBook.inTime = '';
	// }
	
	_visitorsBook.name = controls.name.value;
	_visitorsBook.noOfPepple = controls.noOfPepple.value;
	_visitorsBook.note = controls.note.value;
	_visitorsBook.outTime = controls.outTime.value;
	// if (_outtime) {
	// 	_visitorsBook.outTime = this.typesUtilsService.dateFormat(_outtime);
	// } else {
	// 	_visitorsBook.outTime = '';
	// }
	_visitorsBook.purpose = controls.purpose.value;
	_visitorsBook.source = controls.source.value;
	
	// _visitorsBook.isActive='yes'
	return _visitorsBook;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.visitorsBookForm.controls;
	/** check form */
	if (this.visitorsBookForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedvisitorsBook = this.preparevisitorsBook();
	if (editedvisitorsBook.id > 0) {
		this.updateVisitorsBook(editedvisitorsBook);
	} else {
		this.createVisitorsBook(editedvisitorsBook);
	}
}

/**
 * Update visitorsBook
 *
 * @param _visitorsBook: VisitorBookModel
 */
updateVisitorsBook(_visitorsBook: VisitorBookModel) {
	const updateVisitorsBook: Update<VisitorBookModel> = {
		id: _visitorsBook.id,
		changes: _visitorsBook
	};
	this.store.dispatch(new VisitorBookUpdated({
		partialVisitorBook: updateVisitorsBook,
		visitorBook: _visitorsBook
	}));

	// integrate visitorsBook  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _visitorsBook, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _visitorsBook, isEdit: true }
}

/**
 * Create visitorsBook
 *
 * @param _visitorsBook: VisitorBookModel
 */
createVisitorsBook(_visitorsBook: VisitorBookModel) {
	this.store.dispatch(new VisitorBookOnServerCreated({ visitorBook: _visitorsBook }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedVisitorBookId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _visitorsBook, isEdit: false });
	});

	// integrate visitorsBook  create api
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

