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
import { LibraryStudentMemberModel, selectLibraryStudentMembersActionLoading, LibraryStudentMemberUpdated, LibraryStudentMemberOnServerCreated, selectLastCreatedLibraryStudentMemberId, LibraryStudentMemberService } from '../../../../core/library';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-library-student-member-edit-dialog',
	templateUrl: './library-student-member-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class LibraryStudentMemberEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	libraryStudentMember: LibraryStudentMemberModel;
	libraryStudentMemberForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

classList=[]
	constructor(public dialogRef: MatDialogRef<LibraryStudentMemberEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private libraryStudentMemberService:LibraryStudentMemberService
		) {
	}

	/**
	 * On init
	 */
	ngOnInit() {


		this.store.pipe(select(selectLibraryStudentMembersActionLoading)).subscribe(res => this.viewLoading = res);
		
		this.libraryStudentMember = this.data.libraryStudentMember;
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
		this.libraryStudentMemberForm = this.fb.group({
			admissionNo: [this.libraryStudentMember.admissionNo,''],
			classes: [this.libraryStudentMember.classes, ''],
			dob: [this.typesUtilsService.getDateFromString(this.libraryStudentMember.dob), Validators.compose([Validators.nullValidator])],
			fatherName: [this.libraryStudentMember.fatherName, ''],
			firstName: [this.libraryStudentMember.firstName, ''],
			gender: [this.libraryStudentMember.gender, ''],
			isActive: [this.libraryStudentMember.isActive, ''],
			lastName: [this.libraryStudentMember.lastName, ''],
			libraryCardNo: [this.libraryStudentMember.libraryCardNo, Validators.required],
			memberId: [this.libraryStudentMember.memberId, 0],
			mobileno: [this.libraryStudentMember.mobileno, ''],
			section: [this.libraryStudentMember.section, ''],
			sessionID: [this.libraryStudentMember.sessionID, 0],
			studentId: [this.libraryStudentMember.studentId, 0],
		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		// if (this.libraryStudentMember.studentId > 0) {
		// 	return `Edit Library Student Member '${this.libraryStudentMember.firstName}'`;
		// }

		return 'New Library Student Member';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.libraryStudentMemberForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared libraryStudentMember
	 */
	preparelibraryStudentMember(): LibraryStudentMemberModel {
		const controls = this.libraryStudentMemberForm.controls;
		const _libraryStudentMember = new LibraryStudentMemberModel();
		_libraryStudentMember.studentId = this.libraryStudentMember.studentId;

		_libraryStudentMember.admissionNo = controls.admissionNo.value;
		_libraryStudentMember.classes = controls.classes.value;
		_libraryStudentMember.fatherName = controls.fatherName.value;
		_libraryStudentMember.firstName = controls.firstName.value;
		_libraryStudentMember.gender = controls.gender.value;
		_libraryStudentMember.sessionID = controls.sessionID.value;
		_libraryStudentMember.lastName = controls.lastName.value;
		_libraryStudentMember.libraryCardNo = controls.libraryCardNo.value;
		_libraryStudentMember.memberId = controls.memberId.value;
		const _dob = controls.dob.value;
		if (_dob) {
			_libraryStudentMember.dob = this.typesUtilsService.dateFormat(_dob);
		} else {
			_libraryStudentMember.dob = '';
		}
		_libraryStudentMember.mobileno = controls.mobileno.value;
		_libraryStudentMember.section = controls.section.value;
		_libraryStudentMember.isActive='yes'
		return _libraryStudentMember;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.libraryStudentMemberForm.controls;
		/** check form */
		if (this.libraryStudentMemberForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedlibraryStudentMember = this.preparelibraryStudentMember();
		// if (editedlibraryStudentMember.studentId > 0) {
		// 	this.updateLibraryStudentMember(editedlibraryStudentMember);
		// } else {
			this.createLibraryStudentMember(editedlibraryStudentMember);
		// }


		
	}

	/**
	 * Update libraryStudentMember
	 *
	 * @param _libraryStudentMember: LibraryStudentMemberModel
	 */
	updateLibraryStudentMember(_libraryStudentMember: LibraryStudentMemberModel) {
		const updateLibraryStudentMember: Update<LibraryStudentMemberModel> = {
			id: _libraryStudentMember.studentId,
			changes: _libraryStudentMember
		};
		this.store.dispatch(new LibraryStudentMemberUpdated({
			partialLibraryStudentMember: updateLibraryStudentMember,
			libraryStudentMember: _libraryStudentMember
		}));

		

		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _libraryStudentMember, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _libraryStudentMember, isEdit: true }
	}

	/**
	 * Create LibraryStudentMember
	 *
	 * @param _libraryStudentMember: LibraryStudentMemberModel
	 */
	createLibraryStudentMember(_libraryStudentMember: LibraryStudentMemberModel) {
		this.store.dispatch(new LibraryStudentMemberOnServerCreated({ libraryStudentMember: _libraryStudentMember }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedLibraryStudentMemberId),
			delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _libraryStudentMember, isEdit: false });
		});

		
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

