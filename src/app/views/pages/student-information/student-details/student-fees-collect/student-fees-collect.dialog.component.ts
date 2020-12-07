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



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-student-fees-collect-dialog',
	templateUrl: './student-fees-collect.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class StudentFeesCollectDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
student: StudentDtoModel;
searchFormData :any;
documentForm: FormGroup;

hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;

	title: any;
	document: any;
	formShow: boolean= false;

constructor(public dialogRef: MatDialogRef<StudentFeesCollectDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService) {
}

/**
 * On init
 */
ngOnInit() {
	this.store.pipe(select(selectStudentsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	debugger
	this.student = this.data.student;
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
		return `Student Fees Collect'${this.student.id}'`;
	}

	return 'Student Fees Collect';
}

}

