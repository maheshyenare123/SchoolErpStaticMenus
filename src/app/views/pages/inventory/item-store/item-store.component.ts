import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ItemStoresDataSource, ItemStoreModel,selectItemStoresActionLoading, } from 'src/app/core/inventory';
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
import { ItemStoresPageRequested, OneItemStoreDeleted, ManyItemStoresDeleted, ItemStoresStatusUpdated, ItemStoreUpdated, ItemStoreOnServerCreated, selectLastCreatedItemStoreId } from '../../../../core/inventory';


@Component({
  selector: 'kt-item-store',
  templateUrl: './item-store.component.html',
  styleUrls: ['./item-store.component.scss']
})
export class ItemStoreComponent implements OnInit {

  // Table fields
dataSource: ItemStoresDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'itemStore', 'code', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ItemStoreModel>(true, []);
itemStoresResult: ItemStoreModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
itemStore: ItemStoreModel;
itemStoreForm: FormGroup;
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
		private typesUtilsService: TypesUtilsService,
		
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
			tap(() => this.loadItemStoreList())
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
				this.loadItemStoreList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ItemStoresDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.itemStoresResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadItemStoreList();
		}); // Remove this line, just loading imitation

		this.addItemStore();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	
	/**
	 * Load ItemStores List from service through data-source
	 */
	loadItemStoreList() {
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
		this.store.dispatch(new ItemStoresPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.ItemStore = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete ItemStore
	 *
	 * @param _item: ItemStoreModel
	 */
	deleteItemStore(_item: ItemStoreModel) {

		const _title = 'ItemStore';
		const _description = 'Are you sure to permanently delete selected ItemStore?';
		const _waitDesciption = 'ItemStore is deleting...';
		const _deleteMessage = ' Selected ItemStore has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneItemStoreDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadItemStoreList();
		});
		

	}

	/**
	 * Show add ItemStore dialog
	 */
	addItemStore() {
		this.itemStore=new ItemStoreModel();
		this.itemStore.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit ItemStore dialog and save after success close result
	 * @param itemStore: ItemStoreModel
	 */
	editItemStore(itemStore: ItemStoreModel) {
		
		this.itemStore=itemStore;
		this.createForm();

	}



createForm() {
	debugger;
	this.itemStoreForm = this.fb.group({
    itemStore: [this.itemStore.itemStore, Validators.required],
    code: [this.itemStore.code, ],
    description: [this.itemStore.description, ],
    isActive: [this.itemStore.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.itemStoreForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared itemStore
 */
prepareItemStore(): ItemStoreModel {
	const controls = this.itemStoreForm.controls;
	const _itemStore = new ItemStoreModel();
  _itemStore.id = this.itemStore.id;
  _itemStore.itemStore = controls.itemStore.value;
  _itemStore.code = controls.code.value;
	_itemStore.description = controls.description.value;
	if(_itemStore.id>0){
		_itemStore.isActive = controls.isActive.value;
	}else{
		_itemStore.isActive = 'yes';
	}
	return _itemStore;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.itemStoreForm.controls;
	/** check form */
	if (this.itemStoreForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedItemStore = this.prepareItemStore();
	if (editedItemStore.id > 0) {
		this.updateItemStore(editedItemStore);
	} else {
		this.createItemStore(editedItemStore);
	}

	const	_saveMessage= editedItemStore.id > 0 ? 'ItemStore  has been updated' : 'ItemStore has been created';
		
	const _messageType = editedItemStore.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadItemStoreList();
		this.itemStoreForm.reset();
		this.addItemStore();
		// this.itemStore.clear();
		// this.createForm();

}
onCancel(){
	this.itemStoreForm.reset();
	this.addItemStore();
	// this.itemStore.clear();
	// this.createForm();
}
/**
 * Update ItemStore
 *
 * @param _itemStore: ItemStoreModel
 */
updateItemStore(_itemStore: ItemStoreModel) {
	const updateItemStore: Update<ItemStoreModel> = {
		id: _itemStore.id,
		changes: _itemStore
	};
	this.store.dispatch(new ItemStoreUpdated({
		partialItemStore: updateItemStore,
		itemStore: _itemStore
	}));


}

/**
 * Create ItemStore
 *
 * @param _itemStore: ItemStoreModel
 */
createItemStore(_itemStore:ItemStoreModel) {
	this.store.dispatch(new ItemStoreOnServerCreated({ itemStore: _itemStore }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedItemStoreId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _itemStore, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}

