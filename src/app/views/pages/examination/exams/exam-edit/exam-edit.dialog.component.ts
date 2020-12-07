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
import { ExamModel, selectExamsActionLoading, ExamUpdated, ExamOnServerCreated, selectLastCreatedExamId, ExamGroupModel } from '../../../../../core/examination';
import { Constants } from 'src/app/core/api_url';
// // Services and Models



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-exam-edit-dialog',
	templateUrl: './exam-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ExamEditDialogComponent implements OnInit, OnDestroy {
	
	
	// Public properties
exam: ExamModel;
examForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
	examGroupDetail: ExamGroupModel;

constructor(public dialogRef: MatDialogRef<ExamEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService) {
}

/**
 * On init
 */
ngOnInit() {
	debugger
	this.store.pipe(select(selectExamsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	this.exam = this.data.exam;
	this.examGroupDetail = this.data.examGroupDetail
	this.createForm();
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
	this.examForm = this.fb.group({

		
	dateFrom: [this.typesUtilsService.getDateFromString(this.exam.dateFrom), Validators.compose([Validators.nullValidator])],
	dateTo: [this.typesUtilsService.getDateFromString(this.exam.dateTo), Validators.compose([Validators.nullValidator])],

	description: [this.exam.description,],
	examGroupId: [this.exam.examGroupId,],
	examGroupName: [this.exam.examGroupName,],
	isPublish: [this.exam.isPublish, ],
	name: [this.exam.name,],
	sessionName: [this.exam.sessionName,],
	status: [this.exam.status,],
	subjectCount: [this.exam.subjectCount,],

	});
}

/**
 * Returns page title
 */
getTitle(): string {
	if (this.exam.id > 0) {
		return `Edit Exam '${this.exam.name}'`;
	}

	return 'New Exam';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.examForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared exam
 */
prepareexam(): ExamModel {
	const controls = this.examForm.controls;
	const _exam = new ExamModel();
	_exam.id = this.exam.id;

	const _dateFrom = controls.dateFrom.value;
		if (_dateFrom) {
			_exam.dateFrom = this.typesUtilsService.dateFormat(_dateFrom);
		} else {
			_exam.dateFrom = '';
		}
	const _dateTo = controls.dateTo.value;
		if (_dateTo) {
			_exam.dateTo = this.typesUtilsService.dateFormat(_dateTo);
		} else {
			_exam.dateTo = '';
		}	
	_exam.description = controls.description.value;
	if(_exam.id>0){
		_exam.examGroupId = controls.examGroupId.value;
		_exam.examGroupName = controls.examGroupName.value;
	  }else{
		_exam.examGroupId = this.examGroupDetail.id;
		_exam.examGroupName = this.examGroupDetail.name;
	  }
	
	_exam.isPublish = controls.isPublish.value;
	_exam.name = controls.name.value;
	_exam.sessionName = controls.sessionName.value;
	_exam.status = controls.status.value;
	_exam.subjectCount = controls.subjectCount.value;
	return _exam;
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.examForm.controls;
	/** check form */
	if (this.examForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedexam = this.prepareexam();
	if (editedexam.id > 0) {
		this.updateExam(editedexam);
	} else {
		this.createExam(editedexam);
	}
}

/**
 * Update exam
 *
 * @param _exam: ExamModel
 */
updateExam(_exam: ExamModel) {
	const updateexam: Update<ExamModel> = {
		id: _exam.id,
		changes: _exam
	};
	this.store.dispatch(new ExamUpdated({
		partialExam: updateexam,
		exam: _exam
	}));

	// integrate exam  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _exam, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _exam, isEdit: true }
}

/**
 * Create exam
 *
 * @param _exam: ExamModel
 */
createExam(_exam: ExamModel) {
	this.store.dispatch(new ExamOnServerCreated({ exam: _exam }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedExamId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _exam, isEdit: false });
	});

	// integrate exam  create api
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

