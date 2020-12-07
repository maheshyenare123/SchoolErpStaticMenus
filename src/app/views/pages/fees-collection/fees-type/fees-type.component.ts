
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FeesTypesDataSource, FeesTypeModel,selectFeesTypesActionLoading } from 'src/app/core/fees-collection';
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
import { FeesTypesPageRequested, OneFeesTypeDeleted, ManyFeesTypesDeleted, FeesTypesStatusUpdated, FeesTypeUpdated, FeesTypeOnServerCreated, selectLastCreatedFeesTypeId } from '../../../../core/fees-collection';


@Component({
  selector: 'kt-fees-type',
  templateUrl: './fees-type.component.html',
  styleUrls: ['./fees-type.component.scss']
})
export class FeesTypeComponent implements OnInit {

  // Table fields
dataSource: FeesTypesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'feesType', 'feesCode', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<FeesTypeModel>(true, []);
feesTypesResult: FeesTypeModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
feesType: FeesTypeModel;
feesTypeForm: FormGroup;
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
			tap(() => this.loadFeesTypeList())
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
				this.loadFeesTypeList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new FeesTypesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.feesTypesResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadFeesTypeList();
		}); // Remove this line, just loading imitation

this.addFeesType();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load FeesTypes List from service through data-source
	 */
	loadFeesTypeList() {
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
		this.store.dispatch(new FeesTypesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.feesType = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete FeesType
	 *
	 * @param _item: FeesTypeModel
	 */
	deleteFeesType(_item: FeesTypeModel) {

		const _title = 'FeesType';
		const _description = 'Are you sure to permanently delete selected FeesType?';
		const _waitDesciption = 'FeesType is deleting...';
		const _deleteMessage = ' Selected FeesType has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneFeesTypeDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadFeesTypeList();
		});
		

	}

	/**
	 * Show add FeesType dialog
	 */
	addFeesType() {
		this.feesType=new FeesTypeModel();
		this.feesType.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit FeesType dialog and save after success close result
	 * @param feesType: FeesTypeModel
	 */
	editFeesType(feesType: FeesTypeModel) {
		
		this.feesType=feesType;
		this.createForm();

	}



createForm() {
	debugger;
	this.feesTypeForm = this.fb.group({
    type: [this.feesType.type, Validators.required],
    code: [this.feesType.code, Validators.required],
		description: [this.feesType.description, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.feesTypeForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared feesType
 */
prepareFeesType(): FeesTypeModel {
	const controls = this.feesTypeForm.controls;
	const _feesType = new FeesTypeModel();
	_feesType.id = this.feesType.id;
  _feesType.type = controls.type.value;
  _feesType.code = controls.code.value;
	_feesType.description = controls.description.value;
	_feesType.isActive='yes';
	return _feesType;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.feesTypeForm.controls;
	/** check form */
	if (this.feesTypeForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedFeesType = this.prepareFeesType();
	if (editedFeesType.id > 0) {
		this.updateFeesType(editedFeesType);
	} else {
		this.createFeesType(editedFeesType);
	}

	const	_saveMessage= editedFeesType.id > 0 ? 'FeesType  has been updated' : 'FeesType has been created';
		
	const _messageType = editedFeesType.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadFeesTypeList();
		this.feesTypeForm.reset();
		this.addFeesType();
		// this.feesType.clear();
		// this.createForm();

}
onCancel(){
	this.feesTypeForm.reset();
	this.addFeesType();
	// this.feesType.clear();
	// this.createForm();
}
/**
 * Update FeesType
 *
 * @param _feesType: FeesTypeModel
 */
updateFeesType(_feesType: FeesTypeModel) {
	const updateFeesType: Update<FeesTypeModel> = {
		id: _feesType.id,
		changes: _feesType
	};
	this.store.dispatch(new FeesTypeUpdated({
		partialFeesType: updateFeesType,
		feesType: _feesType
	}));


}

/**
 * Create FeesType
 *
 * @param _feesType: FeesTypeModel
 */
createFeesType(_feesType:FeesTypeModel) {
	this.store.dispatch(new FeesTypeOnServerCreated({ feesType: _feesType }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedFeesTypeId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _feesType, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}


