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
import { LibraryStaffMemberModel, selectLibraryStaffMembersActionLoading, LibraryStaffMemberUpdated, LibraryStaffMemberOnServerCreated, selectLastCreatedLibraryStaffMemberId, LibraryStaffMemberService } from '../../../../core/library';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-library-staff-member-edit-dialog',
	templateUrl: './library-staff-member-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class LibraryStaffMemberEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	libraryStaffMember: LibraryStaffMemberModel;
	libraryStaffMemberForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

classList=[]
	constructor(public dialogRef: MatDialogRef<LibraryStaffMemberEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private libraryStaffMemberService:LibraryStaffMemberService
		) {
	}

	/**
	 * On init
	 */
	ngOnInit() {


		this.store.pipe(select(selectLibraryStaffMembersActionLoading)).subscribe(res => this.viewLoading = res);
		
		this.libraryStaffMember = this.data.libraryStaffMember;
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
		this.libraryStaffMemberForm = this.fb.group({
			name:[this.libraryStaffMember.name, Validators.required],
			email: [this.libraryStaffMember.email,''],
			dob: [this.typesUtilsService.getDateFromString(this.libraryStaffMember.dob), Validators.compose([Validators.nullValidator])],
			gender: [this.libraryStaffMember.gender, ''],
			// isActive: [this.libraryStaffMember.isActive, ''],
			libraryCardNo: [this.libraryStaffMember.libraryCardNo, Validators.required],
			memberId: [this.libraryStaffMember.memberId, 0],
			mobileno: [this.libraryStaffMember.mobileno, ''],
			
		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		// if (this.libraryStaffMember.staffId > 0) {
		// 	return `Edit Library Staff Member '${this.libraryStaffMember.name}'`;
		// }

		return 'New Library Staff Member';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.libraryStaffMemberForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared libraryStaffMember
	 */
	preparelibraryStaffMember(): LibraryStaffMemberModel {
		const controls = this.libraryStaffMemberForm.controls;
		const _libraryStaffMember = new LibraryStaffMemberModel();
		_libraryStaffMember.id = this.libraryStaffMember.id;
	
		_libraryStaffMember.name = controls.name.value;
		_libraryStaffMember.email = controls.email.value;

		_libraryStaffMember.gender = controls.gender.value;
		_libraryStaffMember.libraryCardNo = controls.libraryCardNo.value;
		_libraryStaffMember.memberId = controls.memberId.value;
		_libraryStaffMember.mobileno = controls.mobileno.value;
		
		
		const _dob = controls.dob.value;
		if (_dob) {
			_libraryStaffMember.dob = this.typesUtilsService.dateFormat(_dob);
		} else {
			_libraryStaffMember.dob = '';
		}

		_libraryStaffMember.isActive='yes'
		return _libraryStaffMember;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.libraryStaffMemberForm.controls;
		/** check form */
		if (this.libraryStaffMemberForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedlibraryStaffMember = this.preparelibraryStaffMember();
		// if (editedlibraryStaffMember.staffId > 0) {
		// 	this.updateLibraryStaffMember(editedlibraryStaffMember);
		// } else {
			this.createLibraryStaffMember(editedlibraryStaffMember);
		// }


		
	}

	/**
	 * Update libraryStaffMember
	 *
	 * @param _libraryStaffMember: LibraryStaffMemberModel
	 */
	updateLibraryStaffMember(_libraryStaffMember: LibraryStaffMemberModel) {
		const updateLibraryStaffMember: Update<LibraryStaffMemberModel> = {
			id: _libraryStaffMember.id,
			changes: _libraryStaffMember
		};
		this.store.dispatch(new LibraryStaffMemberUpdated({
			partialLibraryStaffMember: updateLibraryStaffMember,
			libraryStaffMember: _libraryStaffMember
		}));

		

		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _libraryStaffMember, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _LibraryStaffMember, isEdit: true }
	}

	/**
	 * Create LibraryStaffMember
	 *
	 * @param _libraryStaffMember: LibraryStaffMemberModel
	 */
	createLibraryStaffMember(_libraryStaffMember: LibraryStaffMemberModel) {
		this.store.dispatch(new LibraryStaffMemberOnServerCreated({ libraryStaffMember: _libraryStaffMember }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedLibraryStaffMemberId),
			delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _libraryStaffMember, isEdit: false });
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

