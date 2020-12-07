
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FeesRemindersDataSource, FeesReminderModel,selectFeesRemindersActionLoading } from 'src/app/core/fees-collection';
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
import { FeesRemindersPageRequested, OneFeesReminderDeleted, ManyFeesRemindersDeleted, FeesRemindersStatusUpdated, FeesReminderUpdated, FeesReminderOnServerCreated, selectLastCreatedFeesReminderId } from '../../../../core/fees-collection';


@Component({
  selector: 'kt-fees-reminder',
  templateUrl: './fees-reminder.component.html',
  styleUrls: ['./fees-reminder.component.scss']
})
export class FeesReminderComponent implements OnInit {

   // Table fields
dataSource: FeesRemindersDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['select', 'reminderType', 'days',];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<FeesReminderModel>(true, []);
feesRemindersResult: FeesReminderModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
feesReminder: FeesReminderModel;
feesReminderForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;




  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService) { }

  ngOnInit() {

	debugger;
	
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadFeesReminderList())
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
				this.loadFeesReminderList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new FeesRemindersDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.feesRemindersResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadFeesReminderList();
		}); // Remove this line, just loading imitation

this.addFeesReminder();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load FeesReminders List from service through data-source
	 */
	loadFeesReminderList() {
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
		this.store.dispatch(new FeesRemindersPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.FeesReminder = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete FeesReminder
	 *
	 * @param _item: FeesReminderModel
	 */
	deleteFeesReminder(_item: FeesReminderModel) {

		const _title = 'FeesReminder';
		const _description = 'Are you sure to permanently delete selected FeesReminder?';
		const _waitDesciption = 'FeesReminder is deleting...';
		const _deleteMessage = ' Selected FeesReminder has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneFeesReminderDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadFeesReminderList();
		});
		

	}

	/**
	 * Show add FeesReminder dialog
	 */
	addFeesReminder() {
		this.feesReminder=new FeesReminderModel();
		this.feesReminder.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit FeesReminder dialog and save after success close result
	 * @param feesReminder: FeesReminderModel
	 */
	editFeesReminder(feesReminder: FeesReminderModel) {
		
		this.feesReminder=feesReminder;
		this.createForm();

	}



createForm() {
	debugger;
	this.feesReminderForm = this.fb.group({
    type: [this.feesReminder.type, Validators.required],
    days: [this.feesReminder.days, Validators.required],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.feesReminderForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared feesReminder
 */
prepareFeesReminder(): FeesReminderModel {
	const controls = this.feesReminderForm.controls;
	const _feesReminder = new FeesReminderModel();
	_feesReminder.id = this.feesReminder.id;
  _feesReminder.type = controls.type.value;
  _feesReminder.days = controls.days.value;
	_feesReminder.isActive='yes';
	return _feesReminder;
}

/**
 * On Submit
 */

onSave(){
//checked item list


}




onSubmit() {
	this.hasFormErrors = false;
	const controls = this.feesReminderForm.controls;
	/** check form */
	if (this.feesReminderForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedFeesReminder = this.prepareFeesReminder();
	if (editedFeesReminder.id > 0) {
		this.updateFeesReminder(editedFeesReminder);
	} else {
		this.createFeesReminder(editedFeesReminder);
	}

	const	_saveMessage= editedFeesReminder.id > 0 ? 'FeesReminder  has been updated' : 'FeesReminder has been created';
		
	const _messageType = editedFeesReminder.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadFeesReminderList();
		this.feesReminderForm.reset();
		this.addFeesReminder();
		// this.feesReminder.clear();
		// this.createForm();

}
onCancel(){
	this.feesReminderForm.reset();
	this.addFeesReminder();
	// this.FeesReminder.clear();
	// this.createForm();
}
/**
 * Update FeesReminder
 *
 * @param _feesReminder: FeesReminderModel
 */
updateFeesReminder(_feesReminder: FeesReminderModel) {
	const updateFeesReminder: Update<FeesReminderModel> = {
		id: _feesReminder.id,
		changes: _feesReminder
	};
	this.store.dispatch(new FeesReminderUpdated({
		partialFeesReminder: updateFeesReminder,
		feesReminder: _feesReminder
	}));


}

/**
 * Create FeesReminder
 *
 * @param _feesReminder: FeesReminderModel
 */
createFeesReminder(_feesReminder:FeesReminderModel) {
	this.store.dispatch(new FeesReminderOnServerCreated({ feesReminder: _feesReminder }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedFeesReminderId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _feesReminder, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}



