
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StaffDesignationsDataSource, StaffDesignationModel,selectStaffDesignationsActionLoading } from 'src/app/core/human-resource';
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
import { StaffDesignationsPageRequested, OneStaffDesignationDeleted, ManyStaffDesignationsDeleted, StaffDesignationsStatusUpdated, StaffDesignationUpdated, StaffDesignationOnServerCreated, selectLastCreatedStaffDesignationId } from '../../../../core/human-resource';


@Component({
  selector: 'kt-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit {

   // Table fields
dataSource: StaffDesignationsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'designation', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<StaffDesignationModel>(true, []);
staffDesignationsResult: StaffDesignationModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
staffDesignation: StaffDesignationModel;
staffDesignationForm: FormGroup;
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
			tap(() => this.loadStaffDesignationList())
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
				this.loadStaffDesignationList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new StaffDesignationsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.staffDesignationsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadStaffDesignationList();
		}); // Remove this line, just loading imitation

this.addStaffDesignation();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load StaffDesignations List from service through data-source
	 */
	loadStaffDesignationList() {
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
		this.store.dispatch(new StaffDesignationsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.designation = searchText;
		if (!searchText) {
			return filter;
		}
		filter.designation = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete StaffDesignation
	 *
	 * @param _item: StaffDesignationModel
	 */
	deleteStaffDesignation(_item: StaffDesignationModel) {

		const _title = 'Staff Designation';
		const _description = 'Are you sure to permanently delete selected Staff Designation?';
		const _waitDesciption = 'Staff Designation is deleting...';
		const _deleteMessage = ' Selected Staff Designation has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneStaffDesignationDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadStaffDesignationList();
		});
		

	}

	/**
	 * Show add StaffDesignation dialog
	 */
	addStaffDesignation() {
		this.staffDesignation=new StaffDesignationModel();
		this.staffDesignation.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit StaffDesignation dialog and save after success close result
	 * @param staffDesignation: StaffDesignationModel
	 */
	editStaffDesignation(staffDesignation: StaffDesignationModel) {
		
		this.staffDesignation=staffDesignation;
		this.createForm();

	}



createForm() {
	debugger;
	this.staffDesignationForm = this.fb.group({
		designation: [this.staffDesignation.designation, Validators.required],
		isActive: [this.staffDesignation.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.staffDesignationForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared StaffDesignation
 */
prepareStaffDesignation(): StaffDesignationModel {
	const controls = this.staffDesignationForm.controls;
	const _staffDesignation = new StaffDesignationModel();
	_staffDesignation.id = this.staffDesignation.id;
	_staffDesignation.designation = controls.designation.value;
	_staffDesignation.isActive='yes';
	return _staffDesignation;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.staffDesignationForm.controls;
	/** check form */
	if (this.staffDesignationForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedStaffDesignation = this.prepareStaffDesignation();
	if (editedStaffDesignation.id > 0) {
		this.updateStaffDesignation(editedStaffDesignation);
	} else {
		this.createStaffDesignation(editedStaffDesignation);
	}

	const	_saveMessage= editedStaffDesignation.id > 0 ? 'Staff Designation  has been updated' : 'Staff Designation has been created';
		
	const _messageType = editedStaffDesignation.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadStaffDesignationList();
		this.staffDesignationForm.reset();
		this.addStaffDesignation();
		// this.staffDesignation.clear();
		// this.createForm();

}
onCancel(){
	this.staffDesignationForm.reset();
	this.addStaffDesignation();
	// this.staffDesignation.clear();
	// this.createForm();
}
/**
 * Update StaffDesignation
 *
 * @param _staffDesignation: StaffDesignationModel
 */
updateStaffDesignation(_staffDesignation: StaffDesignationModel) {
	const updateStaffDesignation: Update<StaffDesignationModel> = {
		id: _staffDesignation.id,
		changes: _staffDesignation
	};
	this.store.dispatch(new StaffDesignationUpdated({
		partialStaffDesignation: updateStaffDesignation,
	staffDesignation: _staffDesignation
	}));


}

/**
 * Create StaffDesignation
 *
 * @param _staffDesignation: StaffDesignationModel
 */
createStaffDesignation(_staffDesignation:StaffDesignationModel) {
	this.store.dispatch(new StaffDesignationOnServerCreated({ staffDesignation: _staffDesignation }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedStaffDesignationId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _staffDesignation, isEdit: false });
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

