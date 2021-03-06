
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DisableReasonsDataSource, DisableReasonModel,selectDisableReasonsActionLoading } from 'src/app/core/student-information';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { DisableReasonsPageRequested, OneDisableReasonDeleted, ManyDisableReasonsDeleted, DisableReasonsStatusUpdated, DisableReasonUpdated, DisableReasonOnServerCreated, selectLastCreatedDisableReasonId } from '../../../../core/student-information';


@Component({
  selector: 'kt-disable-reason',
  templateUrl: './disable-reason.component.html',
  styleUrls: ['./disable-reason.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisableReasonComponent implements OnInit {

 // Table fields
dataSource: DisableReasonsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'disableReason', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<DisableReasonModel>(true, []);
disableReasonsResult: DisableReasonModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
disableReason: DisableReasonModel;
disableReasonForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;




  constructor(
    public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
    private typesUtilsService: TypesUtilsService
    ) { }

  ngOnInit() {

	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadDisableReasonList())
		)
		.subscribe();
		this.subscriptions.push(paginatorSubscriptions);

		// Filtration, bind to searchInput
		const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
			// tslint:disable-next-line:max-line-length
			debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
			distinctUntilChanged(), // This operator will eliminate duplicate values
			tap(() => {
				this.paginator.pageIndex = 0;
				this.loadDisableReasonList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new DisableReasonsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.disableReasonsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadDisableReasonList();
		}); // Remove this line, just loading imitation

this.addDisableReason();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load disableReasons List from service through data-source
	 */
	loadDisableReasonList() {
		debugger;
		this.selection.clear();
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			this.paginator.pageIndex,
			this.paginator.pageSize
		);
		// Call request from server
		this.store.dispatch(new DisableReasonsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.disableReason = searchText;
		if (!searchText) {
			return filter;
		}

		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete disableReason
	 *
	 * @param _item: DisableReasonModel
	 */
	deleteDisableReason(_item: DisableReasonModel) {

		const _title = 'Disabled Reason';
		const _description = 'Are you sure to permanently delete selected Disabled Reason?';
		const _waitDesciption = 'Disabled Reason is deleting...';
		const _deleteMessage = ' Selected Disabled Reason has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneDisableReasonDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadDisableReasonList();
		});
		

	}

	/**
	 * Show add DisableReason dialog
	 */
	addDisableReason() {
		this.disableReason=new DisableReasonModel();
		this.disableReason.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit DisableReason dialog and save after success close result
	 * @param disableReason: DisableReasonModel
	 */
	editDisableReason(disableReason: DisableReasonModel) {
		
		this.disableReason=disableReason;
		this.createForm();

	}



createForm() {
	debugger;
	this.disableReasonForm = this.fb.group({
		reason: [this.disableReason.reason, Validators.required],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.disableReasonForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared disableReason
 */
prepareDisableReason(): DisableReasonModel {
	const controls = this.disableReasonForm.controls;
	const _disableReason = new DisableReasonModel();
	_disableReason.id = this.disableReason.id;
	if(_disableReason.id>0){
		_disableReason.isActive =this.disableReason.isActive;
	}else{
		_disableReason.isActive ='yes'; 	
	}
	_disableReason.reason = controls.reason.value;

	return _disableReason;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.disableReasonForm.controls;
	/** check form */
	if (this.disableReasonForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedDisableReason = this.prepareDisableReason();
	if (editedDisableReason.id > 0) {
		this.updateDisableReason(editedDisableReason);
	} else {
		this.createDisableReason(editedDisableReason);
	}

	const	_saveMessage= editedDisableReason.id > 0 ? 'Disabled Reason  has been updated' : 'Disabled Reason has been created';
		
	const _messageType = editedDisableReason.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadDisableReasonList();
		this.disableReasonForm.reset();
		// this.disableReason.clear();
		// this.createForm();
		this.addDisableReason();

}
onCancel(){
	this.disableReasonForm.reset();
	// this.disableReason.clear();
	// this.createForm();
	this.addDisableReason();
}
/**
 * Update DisableReason
 *
 * @param _disableReason: DisableReasonModel
 */
updateDisableReason(_disableReason: DisableReasonModel) {
	const updateDisableReason: Update<DisableReasonModel> = {
		id: _disableReason.id,
		changes: _disableReason
	};
	this.store.dispatch(new DisableReasonUpdated({
		partialDisableReason: updateDisableReason,
		disableReason: _disableReason
	}));


}

/**
 * Create DisableReason
 *
 * @param _disableReason: DisableReasonModel
 */
createDisableReason(_disableReason:DisableReasonModel) {
	this.store.dispatch(new DisableReasonOnServerCreated({ disableReason: _disableReason }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedDisableReasonId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _disableReason, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
// export class NgbdTimepickerSteps {
//     time: NgbTimeStruct = {hour: 13, minute: 30, second: 0};
//     hourStep = 1;
//     minuteStep = 15;
//     secondStep = 30;
// }