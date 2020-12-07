
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { VisitorPurposesDataSource, VisitorPurposeModel,selectVisitorPurposesActionLoading } from 'src/app/core/front-office';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { VisitorPurposesPageRequested, OneVisitorPurposeDeleted, ManyVisitorPurposesDeleted, VisitorPurposesStatusUpdated, VisitorPurposeUpdated, VisitorPurposeOnServerCreated, selectLastCreatedVisitorPurposeId } from '../../../../../core/front-office';


@Component({
  selector: 'kt-purpose',
  templateUrl: './purpose.component.html',
  styleUrls: ['./purpose.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurposeComponent implements OnInit {

 // Table fields
dataSource: VisitorPurposesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'visitorsPurpose', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<VisitorPurposeModel>(true, []);
visitorPurposesResult: VisitorPurposeModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
visitorPurpose: VisitorPurposeModel;
visitorPurposeForm: FormGroup;
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
			tap(() => this.loadVisitorPurposeList())
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
				this.loadVisitorPurposeList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new VisitorPurposesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.visitorPurposesResult = res;
			if(this.visitorPurposesResult.length==0)this.dataSource.hasItems=false;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadVisitorPurposeList();
		}); // Remove this line, just loading imitation

this.addVisitorPurpose();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load visitorPurposes List from service through data-source
	 */
	loadVisitorPurposeList() {
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
		this.store.dispatch(new VisitorPurposesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.visitorsPurpose = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete visitorPurpose
	 *
	 * @param _item: VisitorPurposeModel
	 */
	deleteVisitorPurpose(_item: VisitorPurposeModel) {

		const _title = 'Purpose';
		const _description = 'Are you sure to permanently delete selected purpose?';
		const _waitDesciption = 'Purpose is deleting...';
		const _deleteMessage = ' Selected purpose has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneVisitorPurposeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadVisitorPurposeList();
		});
		

	}

	/**
	 * Show add visitorPurpose dialog
	 */
	addVisitorPurpose() {
		this.visitorPurpose=new VisitorPurposeModel();
		this.visitorPurpose.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit visitorPurpose dialog and save after success close result
	 * @param visitorPurpose: VisitorPurposeModel
	 */
	editVisitorPurpose(visitorPurpose: VisitorPurposeModel) {
		
		this.visitorPurpose=visitorPurpose;
		this.createForm();

	}



createForm() {
	debugger;
	this.visitorPurposeForm = this.fb.group({
		visitorsPurpose: [this.visitorPurpose.visitorsPurpose, Validators.required],
		description: [this.visitorPurpose.description, ],
		isActive: [this.visitorPurpose.isActive, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.visitorPurposeForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared visitorPurpose
 */
prepareVisitorPurpose(): VisitorPurposeModel {
	const controls = this.visitorPurposeForm.controls;
	const _visitorPurpose = new VisitorPurposeModel();
	_visitorPurpose.id = this.visitorPurpose.id;
	_visitorPurpose.visitorsPurpose = controls.visitorsPurpose.value;
	_visitorPurpose.description = controls.description.value;
		if(_visitorPurpose.id>0){
	_visitorPurpose.isActive = controls.isActive.value;
}else{
	_visitorPurpose.isActive = 'yes';
}
	return _visitorPurpose;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.visitorPurposeForm.controls;
	/** check form */
	if (this.visitorPurposeForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedVisitorPurpose = this.prepareVisitorPurpose();
	if (editedVisitorPurpose.id > 0) {
		this.updateVisitorPurpose(editedVisitorPurpose);
	} else {
		this.createVisitorPurpose(editedVisitorPurpose);
	}
	this.loadVisitorPurposeList();
	const	_saveMessage= editedVisitorPurpose.id > 0 ? 'Purpose  has been updated' : 'Purpose has been created';
		
	const _messageType = editedVisitorPurpose.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
		this.visitorPurposeForm.reset();

		this.addVisitorPurpose();
		// this.visitorPurpose.clear();
		// this.createForm();

}
onCancel(){
	this.visitorPurposeForm.reset();
	this.addVisitorPurpose();
	// this.visitorPurpose.clear();
	// this.createForm();
}
/**
 * Update visitorPurpose
 *
 * @param _visitorPurpose: VisitorPurposeModel
 */
updateVisitorPurpose(_visitorPurpose: VisitorPurposeModel) {
	const updateVisitorPurpose: Update<VisitorPurposeModel> = {
		id: _visitorPurpose.id,
		changes: _visitorPurpose
	};
	this.store.dispatch(new VisitorPurposeUpdated({
		partialVisitorPurpose: updateVisitorPurpose,
		visitorPurpose: _visitorPurpose
	}));


}

/**
 * Create visitorPurpose
 *
 * @param _visitorPurpose: VisitorPurposeModel
 */
createVisitorPurpose(_visitorPurpose:VisitorPurposeModel) {
	this.store.dispatch(new VisitorPurposeOnServerCreated({ visitorPurpose: _visitorPurpose }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedVisitorPurposeId),
		// delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _visitorPurpose, isEdit: false });
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