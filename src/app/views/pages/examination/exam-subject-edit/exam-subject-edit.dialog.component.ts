// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExamSubjectModel, selectExamSubjectActionLoading, ExamSubjectUpdated, ExamSubjectOnServerCreated, selectLastCreatedExamSubjectId, ExamSubjectService, ExamModel, ExamGroupModel } from '../../../../core/examination';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { StaffDtoModel } from 'src/app/core/academics/_models/staffDto.model';
import { selectAdmissionEnquirysActionLoading } from 'src/app/core/front-office';
import { SubjectDtoModel, SubjectService } from 'src/app/core/academics';
import { ExamSubjectDtoModel } from 'src/app/core/examination/_models/exam-subject-dto.model';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-exam-subject-edit-dialog',
	templateUrl: './exam-subject-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ExamSubjectDialogComponent implements OnInit, OnDestroy {

	// Public properties
	examSubject: ExamSubjectModel;
	examSubjectForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	subjectList: SubjectDtoModel[] = [];

	///
	examSubjectsData: ExamSubjectModel;
	showTimetableData: boolean = false;
	exam: ExamModel;
	examGroupDetail: ExamGroupModel;
	constructor(public dialogRef: MatDialogRef<ExamSubjectDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private examSubjectService: ExamSubjectService,
		private subjectService: SubjectService,
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {

		//All Get Call
		debugger;
		this.loadAllSubject();
		this.store.pipe(select(selectExamSubjectActionLoading)).subscribe(res => this.viewLoading = res);
		 this.examSubject = new ExamSubjectModel();
		 this.examSubject.clear(); 
		 this.examSubject
		this.exam = this.data.exam;
		this.examGroupDetail = this.data.examGroupDetail;
		this.createForm();
	}


	loadAllSubject() {
		debugger
		this.subjectService.getAllSubjects().subscribe(res => {
			const data = res['data'];
			this.subjectList = data['content'];
			console.log(this.subjectList)


		}, err => {
		});
	}

	onSubjectSelectChange(subjectId, index) {
		var subjectObj = this.subjectList.find(x => x.id === subjectId);
		let itemArray = this.examSubjectForm.get('items') as FormArray;
		itemArray.controls[index].get('subjectName').setValue(subjectObj.name);

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

		this.examSubjectForm = this.fb.group({
			items: this.fb.array([ this.createItemRow()]),
		});


	}

	createItemRow() {
		return this.fb.group({
			creditHours: [this.examSubject.creditHours,],
			dateFrom: [this.typesUtilsService.getDateFromString(this.examSubject.dateFrom), Validators.compose([Validators.nullValidator])],
			dateTo: [this.typesUtilsService.getDateFromString(this.examSubject.dateTo), Validators.compose([Validators.nullValidator])],
			duration: [this.examSubject.duration,],
			examId: [this.exam.id,],
			examSubjectId: [this.examSubject.examSubjectId,],
			maxMarks: [this.examSubject.maxMarks,],
			minMarks: [this.examSubject.minMarks,],
			roomNo: [this.examSubject.roomNo,],
			subjectId: [this.examSubject.subjectId,],
			subjectName: [this.examSubject.subjectName,],
			timeFrom: [this.examSubject.timeFrom,]

		});
	}




	addItemRow() {
		let itemArray = this.examSubjectForm.get('items') as FormArray;
		itemArray.push(this.createItemRow());
	}

	removeItemRow(index) {
		debugger
			let itemArray = this.examSubjectForm[index].get('items') as FormArray;
			itemArray.removeAt(index);
	}

	
	/**
	 * Returns page title
	 */
	getTitle(): string {
		// if (this.examSubject.id > 0) {
		// 	return `Edit Exam Subject '${this.examSubject.id}'`;
		// }

		return 'New Exam Subject';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.examSubjectForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared examSubject
	 */
	prepareexamSubject(): ExamSubjectDtoModel {
		const controls = this.examSubjectForm.controls;
		const _examSubject = [];
	
		 
		controls.items.value.map(items=>{


			
			const _Subject = new ExamSubjectModel();

			_Subject.creditHours = items.creditHours;
			const _dateFrom = items.dateFrom;
				if (_dateFrom) {
					_Subject.dateFrom = this.typesUtilsService.dateFormat(_dateFrom);
				} else {
					_Subject.dateFrom = '';
				}
			const _dateTo = items.dateTo;
				if (_dateTo) {
					_Subject.dateTo = this.typesUtilsService.dateFormat(_dateTo);
				} else {
					_Subject.dateTo = '';
				}	


				_Subject.duration = items.duration;
				_Subject.examId = items.examId;
				_Subject.examSubjectId = items.examSubjectId;
				_Subject.maxMarks = items.maxMarks;
				_Subject.minMarks = items.minMarks;

				_Subject.roomNo = items.roomNo;
				_Subject.subjectId = items.subjectId;
				_Subject.subjectName = items.subjectName;
				_Subject.timeFrom = items.timeFrom;
			
				
			_examSubject.push(_Subject)

		})
		return _examSubject;
	}

	

	/**
	 * On Submit
	 */
	onSubmit() {
		debugger
		this.hasFormErrors = false;
		const controls = this.examSubjectForm.controls;
		/** check form */
		if (this.examSubjectForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		
		const editedexamSubject = this.prepareexamSubject();
		// if (editedexamSubject.id > 0) {
		// 	this.updateExamSubject(editedexamSubject);
		// } else {
			this.createExamSubject(editedexamSubject);
		// }



	}

	// this.updateExamSubject(editedexamSubject);



	/**
	 * Update examSubject
	 *
	 * @param _examSubject: ExamSubjectModel
	 */
	// updateExamSubject(_examSubject: ExamSubjectModel) {
	// 	const updateExamSubject: Update<ExamSubjectModel> = {
	// 		id: _examSubject.id,
	// 		changes: _examSubject
	// 	};
	// 	this.store.dispatch(new ExamSubjectUpdated({
	// 		partialExamSubject: updateExamSubject,
	// 		examSubject: _examSubject
	// 	}));



	// 	// Remove this line
	// 	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _examSubject, isEdit: true }));
	// 	// Uncomment this line
	// 	// this.dialogRef.close({ _examSubject, isEdit: true }
	// }

	/**
	 * Create examSubject
	 *
	 * @param _examSubject: ExamSubjectModel
	 */
	createExamSubject(_examSubject: ExamSubjectDtoModel) {
		// this.store.dispatch(new ExamSubjectOnServerCreated({ examSubject: _examSubject }));
		// this.componentSubscriptions = this.store.pipe(
		// 	select(selectLastCreatedExamSubjectId),
		// 	delay(1000), // Remove this line
		// ).subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}

		// 	this.dialogRef.close({ _examSubject, isEdit: false });
		// });
		this.examSubjectService.createExamSubject(_examSubject).subscribe(res => {
			this.dialogRef.close({ _examSubject, isEdit: false });
		}, err => {


		})

	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	_keyPress(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();

		}
	}
}

