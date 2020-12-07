
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FeesGroupsDataSource, FeesGroupModel,selectFeesGroupsActionLoading } from 'src/app/core/fees-collection';
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
import { FeesGroupsPageRequested, OneFeesGroupDeleted, ManyFeesGroupsDeleted, FeesGroupsStatusUpdated, FeesGroupUpdated, FeesGroupOnServerCreated, selectLastCreatedFeesGroupId } from '../../../../core/fees-collection';

@Component({
  selector: 'kt-fees-group',
  templateUrl: './fees-group.component.html',
  styleUrls: ['./fees-group.component.scss']
})
export class FeesGroupComponent implements OnInit {

 // Table fields
dataSource: FeesGroupsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'name', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<FeesGroupModel>(true, []);
feesGroupsResult: FeesGroupModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
feesGroup: FeesGroupModel;
feesGroupForm: FormGroup;
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
			tap(() => this.loadFeesGroupList())
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
				this.loadFeesGroupList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new FeesGroupsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.feesGroupsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadFeesGroupList();
		}); // Remove this line, just loading imitation

this.addFeesGroup();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load FeesGroups List from service through data-source
	 */
	loadFeesGroupList() {
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
		this.store.dispatch(new FeesGroupsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.feesGroup = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete FeesGroup
	 *
	 * @param _item: FeesGroupModel
	 */
	deleteFeesGroup(_item: FeesGroupModel) {

		const _title = 'FeesGroup';
		const _description = 'Are you sure to permanently delete selected FeesGroup?';
		const _waitDesciption = 'FeesGroup is deleting...';
		const _deleteMessage = ' Selected FeesGroup has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneFeesGroupDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadFeesGroupList();
		});
		

	}

	/**
	 * Show add FeesGroup dialog
	 */
	addFeesGroup() {
		this.feesGroup=new FeesGroupModel();
		this.feesGroup.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit FeesGroup dialog and save after success close result
	 * @param feesGroup: FeesGroupModel
	 */
	editFeesGroup(feesGroup: FeesGroupModel) {
		
		this.feesGroup=feesGroup;
		this.createForm();

	}



createForm() {
	debugger;
	this.feesGroupForm = this.fb.group({
    name: [this.feesGroup.name, Validators.required],
		description: [this.feesGroup.description, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.feesGroupForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared feesGroup
 */
prepareFeesGroup(): FeesGroupModel {
	const controls = this.feesGroupForm.controls;
	const _feesGroup = new FeesGroupModel();
	_feesGroup.id = this.feesGroup.id;
  _feesGroup.name = controls.name.value;
	_feesGroup.description = controls.description.value;
	_feesGroup.isActive='yes';
	return _feesGroup;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.feesGroupForm.controls;
	/** check form */
	if (this.feesGroupForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedFeesGroup = this.prepareFeesGroup();
	if (editedFeesGroup.id > 0) {
		this.updateFeesGroup(editedFeesGroup);
	} else {
		this.createFeesGroup(editedFeesGroup);
	}

	const	_saveMessage= editedFeesGroup.id > 0 ? 'FeesGroup  has been updated' : 'FeesGroup has been created';
		
	const _messageType = editedFeesGroup.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadFeesGroupList();
		this.feesGroupForm.reset();
		this.addFeesGroup();
		// this.feesGroup.clear();
		// this.createForm();

}
onCancel(){
	this.feesGroupForm.reset();
	this.addFeesGroup();
	// this.feesGroup.clear();
	// this.createForm();
}
/**
 * Update FeesGroup
 *
 * @param _feesGroup: FeesGroupModel
 */
updateFeesGroup(_feesGroup: FeesGroupModel) {
	const updateFeesGroup: Update<FeesGroupModel> = {
		id: _feesGroup.id,
		changes: _feesGroup
	};
	this.store.dispatch(new FeesGroupUpdated({
		partialFeesGroup: updateFeesGroup,
		feesGroup: _feesGroup
	}));


}

/**
 * Create FeesGroup
 *
 * @param _feesGroup: FeesGroupModel
 */
createFeesGroup(_feesGroup:FeesGroupModel) {
	this.store.dispatch(new FeesGroupOnServerCreated({ feesGroup: _feesGroup }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedFeesGroupId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _feesGroup, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}



