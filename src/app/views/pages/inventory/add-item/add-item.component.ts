import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AddItemsDataSource, AddItemModel,selectAddItemsActionLoading, AddItemService,  ItemCategoryModel, ItemCategoryService } from 'src/app/core/inventory';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService  } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { AddItemsPageRequested, OneAddItemDeleted, ManyAddItemsDeleted, AddItemsStatusUpdated, AddItemUpdated, AddItemOnServerCreated, selectLastCreatedAddItemId } from '../../../../core/inventory';


@Component({
  selector: 'kt-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

   // Table fields
dataSource: AddItemsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);



displayedColumns = ['id', 'name', 'itemCategory', 'unit', 'quantity', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<AddItemModel>(true, []);
addItemsResult: AddItemModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
addItem: AddItemModel;
addItemForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

itemCategoryList: ItemCategoryModel[] = [];
searchType:any

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
    private addItemService:AddItemService,
    private itemCategoryService:ItemCategoryService,
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
			tap(() => this.loadAddItemList())
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
				this.loadAddItemList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new AddItemsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.addItemsResult = res;
			console.log()
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadAddItemList();
		}); // Remove this line, just loading imitation

this.addAddItem();
this.loadAllItemCategory();

  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
  loadAllItemCategory() {
		debugger
		this.itemCategoryService.getAllItemCategorys().subscribe(res => {
			const data = res['data'];
			this.itemCategoryList = data['content'];
			console.log(this.itemCategoryList)
		}, err => {
		});
  }
  
  onItemCategorySelectChange(itemCategoryId){
    this.itemCategoryList.map(item =>{
      if(item.id == itemCategoryId){
        this.addItemForm.get('itemCategory').setValue(item.itemCategory);
      }
    })
  }
	/**
	 * Load AddItems List from service through data-source
	 */
	loadAddItemList() {
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
		this.store.dispatch(new AddItemsPageRequested({ page: queryParams}));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.AddItem = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete AddItem
	 *
	 * @param _item: AddItemModel
	 */
	deleteAddItem(_item: AddItemModel) {

		const _title = 'AddItem';
		const _description = 'Are you sure to permanently delete selected AddItem?';
		const _waitDesciption = 'AddItem is deleting...';
		const _deleteMessage = ' Selected AddItem has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneAddItemDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadAddItemList();
		});
		

	}

	/**
	 * Show add AddItem dialog
	 */
	addAddItem() {
		this.addItem=new AddItemModel();
		this.addItem.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit AddItem dialog and save after success close result
	 * @param additem: AddItemModel
	 */
	editAddItem(additem: AddItemModel) {
		
		this.addItem=additem;
		this.createForm();

	}



createForm() {
	debugger;
	this.addItemForm = this.fb.group({
   
    // description: string;
    // id: number;
    // isActive: string;
    // itemCategory: string;
    // itemCategoryId: number;
    // itemPhoto: string;
    // itemStore: string;
    // itemStoreId: number;
    // itemSupplier: string;
    // itemSupplierId: number;
    // name: string;
    // quantity: number;
    // unit: string

    description: [this.addItem.description, ],
    isActive: [this.addItem.isActive, ],
    itemCategory: [this.addItem.itemCategory, Validators.required],
    itemCategoryId: [this.addItem.itemCategoryId, Validators.required],
    itemPhoto: [this.addItem.itemPhoto, ],
    itemStore: [this.addItem.itemStore, ],
    itemStoreId: [this.addItem.itemStoreId, ],
    itemSupplier: [this.addItem.itemSupplier, ],
    itemSupplierId: [this.addItem.itemSupplierId, ],
    name: [this.addItem.name, Validators.required],
    quantity: [this.addItem.quantity, ],
    unit: [this.addItem.unit, Validators.required],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.addItemForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared additem
 */
prepareAddItem(): AddItemModel {
	const controls = this.addItemForm.controls;
	const _addItem = new AddItemModel();
  _addItem.id = this.addItem.id;
  
    // description: string;
    // id: number;
    // isActive: string;
    // itemCategory: string;
    // itemCategoryId: number;
    // itemPhoto: string;
    // itemStore: string;
    // itemStoreId: number;
    // itemSupplier: string;
    // itemSupplierId: number;
    // name: string;
    // quantity: number;
    // unit: string


 
  _addItem.description = controls.description.value;
  if(_addItem.id>0){
	_addItem.isActive = controls.isActive.value;
}else{
	_addItem.isActive = 'yes';
}
  _addItem.itemCategory = controls.itemCategory.value;
  _addItem.itemCategoryId = controls.itemCategoryId.value;
  _addItem.itemPhoto = controls.itemPhoto.value;
  _addItem.itemStore = controls.itemStore.value;
  _addItem.itemStoreId = controls.itemStoreId.value;
  _addItem.itemSupplier = controls.itemSupplier.value;
	_addItem.itemSupplierId = controls.itemSupplierId.value;
  _addItem.name = controls.name.value;
  _addItem.quantity = controls.quantity.value;
  _addItem.unit = controls.unit.value;


	return _addItem;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.addItemForm.controls;
	/** check form */
	if (this.addItemForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedAddItem = this.prepareAddItem();
	if (editedAddItem.id > 0) {
		this.updateAddItem(editedAddItem);
	} else {
		this.createAddItem(editedAddItem);
	}

	const	_saveMessage= editedAddItem.id > 0 ? 'AddItem  has been updated' : 'AddItem has been created';
		
	const _messageType = editedAddItem.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadAddItemList();
		this.addItemForm.reset();
		this.addAddItem();
		// this.additem.clear();
		// this.createForm();

}
onCancel(){
	this.addItemForm.reset();
	this.addAddItem();
	// this.addItem.clear();
	// this.createForm();
}
/**
 * Update AddItem
 *
 * @param _addItem: AddItemModel
 */
updateAddItem(_addItem: AddItemModel) {
	const updateAddItem: Update<AddItemModel> = {
		id: _addItem.id,
		changes: _addItem
	};
	this.store.dispatch(new AddItemUpdated({
		partialAddItem: updateAddItem,
		addItem: _addItem
	}));


}

/**
 * Create AddItem
 *
 * @param _addItem: AddItemModel
 */
createAddItem(_addItem:AddItemModel) {
	this.store.dispatch(new AddItemOnServerCreated({ addItem: _addItem }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedAddItemId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _additem, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}
onSelect(event) {
	console.log(event);
	this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
	console.log(event);
	this.files.splice(this.files.indexOf(event), 1);
  }
  _keyPress(event: any) {
	const pattern = /[0-9]/;
	let inputChar = String.fromCharCode(event.charCode);
	if (!pattern.test(inputChar)) {
		event.preventDefault();

	}
}
}
