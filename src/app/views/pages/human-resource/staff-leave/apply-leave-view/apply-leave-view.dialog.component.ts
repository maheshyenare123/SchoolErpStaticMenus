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
import { StaffLeaveRequestModel, selectStaffLeaveRequestsActionLoading, StaffLeaveRequestUpdated, selectLastCreatedStaffLeaveRequestId, StaffLeaveRequestOnServerCreated } from '../../../../../core/human-resource';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-apply-leave-view-dialog',
	templateUrl: './apply-leave-view.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ApplyLeaveViewDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
staffLeaveRequest: StaffLeaveRequestModel;
staffLeaveRequestForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

constructor(public dialogRef: MatDialogRef<ApplyLeaveViewDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService) {
}

/**
 * On init
 */
ngOnInit() {
	this.store.pipe(select(selectStaffLeaveRequestsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	this.staffLeaveRequest = this.data.staffLeaveRequest;

}

/**
 * On destroy
 */
ngOnDestroy() {
	if (this.componentSubscriptions) {
		this.componentSubscriptions.unsubscribe();
	}
}

documentFile(){

}
/**
 * Returns page title
 */
getTitle(): string {
return 'Leave Details';
}


}

