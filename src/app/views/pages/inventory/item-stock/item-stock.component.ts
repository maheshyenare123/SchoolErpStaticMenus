import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ItemStocksDataSource, ItemStockModel,selectItemStocksActionLoading, ItemStockService,  ItemCategoryModel, ItemCategoryService, AddItemService, AddItemModel, ItemSupplierService, ItemSupplierModel, ItemStoreService, ItemStoreModel } from 'src/app/core/inventory';
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
import { ItemStocksPageRequested, OneItemStockDeleted, ManyItemStocksDeleted, ItemStocksStatusUpdated, ItemStockUpdated, ItemStockOnServerCreated, selectLastCreatedItemStockId } from '../../../../core/inventory';


@Component({
  selector: 'kt-item-stock',
  templateUrl: './item-stock.component.html',
  styleUrls: ['./item-stock.component.scss']
})
export class ItemStockComponent implements OnInit {

 // Table fields
dataSource: ItemStocksDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);


displayedColumns = ['id', 'itemName', 'itemCategory', 'itemSupplier', 'itemStore', 'quantity', 'purchasePrice', 'date', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ItemStockModel>(true, []);
itemStocksResult: ItemStockModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
itemStock: ItemStockModel;
itemStockForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

itemCategoryList: ItemCategoryModel[] = [];
itemList:AddItemModel[] = [];
itemSupplierList:ItemSupplierModel[] = [];
itemStoreList:ItemStoreModel[] = [];
searchType:any

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
    private itemStockService:ItemStockService,
    private itemCategoryService:ItemCategoryService,
    private addItemService:AddItemService,
    private itemSupplierService:ItemSupplierService,
    private itemStoreService:ItemStoreService
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
			tap(() => this.loadItemStockList())
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
				this.loadItemStockList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ItemStocksDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.itemStocksResult = res;
			console.log()
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadItemStockList();
		}); // Remove this line, just loading imitation

this.addItemStock();
this.loadAllItemCategory();
this.loadAllSupplier();
this.loadAllStore();
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
    this.loadAllItemsByItemCategoryId(itemCategoryId)
    this.itemCategoryList.map(item =>{
      if(item.id == itemCategoryId){
        this.itemStockForm.get('itemCategory').setValue(item.itemCategory);
      }
    })
  }

  loadAllItemsByItemCategoryId(id:number) {
    debugger
    this.addItemService.getAllItemsByItemCategoryId(id).subscribe(res => {
  
      this.itemList = res['data'];
      console.log(this.itemList)
    }, err => {
    });
  }

  onItemSelectChange(itemId){
    this.itemList.map(item =>{
      if(item.id == itemId){
        this.itemStockForm.get('itemName').setValue(item.name);
      }
    })
  }

  loadAllSupplier() {
		debugger
		this.itemSupplierService.getAllItemSuppliers().subscribe(res => {
			const data = res['data'];
			this.itemSupplierList = data['content'];
			console.log(this.itemSupplierList)
		}, err => {
		});
  }

  onItemSupplierSelectChange(itemSupplierId){
    this.itemSupplierList.map(item =>{
      if(item.id == itemSupplierId){
        this.itemStockForm.get('itemSupplier').setValue(item.itemSupplier);
      }
    })
  }
  loadAllStore(){
		debugger
		this.itemStoreService.getAllItemStores().subscribe(res => {
			const data = res['data'];
			this.itemStoreList = data['content'];
			console.log(this.itemStoreList)
		}, err => {
		});
  }
  onItemStoreSelectChange(itemStoreId){
    this.itemStoreList.map(item =>{
      if(item.id == itemStoreId){
        this.itemStockForm.get('itemStore').setValue(item.itemStore);
      }
    })
  }
	/**
	 * Load ItemStocks List from service through data-source
	 */
	loadItemStockList() {
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
		this.store.dispatch(new ItemStocksPageRequested({ page: queryParams}));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.ItemStock = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete ItemStock
	 *
	 * @param _item: ItemStockModel
	 */
	deleteItemStock(_item: ItemStockModel) {

		const _title = 'ItemStock';
		const _description = 'Are you sure to permanently delete selected ItemStock?';
		const _waitDesciption = 'ItemStock is deleting...';
		const _deleteMessage = ' Selected ItemStock has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneItemStockDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadItemStockList();
		});
		

	}

	/**
	 * Show add ItemStock dialog
	 */
	addItemStock() {
		this.itemStock=new ItemStockModel();
		this.itemStock.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit ItemStock dialog and save after success close result
	 * @param itemstock: ItemStockModel
	 */
	editItemStock(itemstock: ItemStockModel) {
		
		this.itemStock=itemstock;
		this.createForm();

	}



createForm() {
	debugger;
	this.itemStockForm = this.fb.group({
   
    // attachment: string;
    // date: string;
    // description: string;
    // id: 0;
    // isActive: string;
    // itemId: 0;
    // itemName: string;
    // itemPhoto: string;
    // itemStore: string;
    // itemStoreId: 0;
    // itemSupplier: string;
    // itemSupplierId: 0;
    // purchasePrice: string;
    // quantity: 0;
    // symbol: string
    attachment: [this.itemStock.attachment, ],
    date: [this.typesUtilsService.getDateFromString(this.itemStock.date), Validators.compose([Validators.nullValidator])],
    description: [this.itemStock.description, ],
    isActive: [this.itemStock.isActive, ],
    itemId: [this.itemStock.itemId, ],
    itemName: [this.itemStock.itemName, ],
    itemCategory: [this.itemStock.itemCategory, Validators.required],
    itemCategoryId: [this.itemStock.itemCategoryId, Validators.required],
    itemPhoto: [this.itemStock.itemPhoto, ],
    itemStore: [this.itemStock.itemStore, ],
    itemStoreId: [this.itemStock.itemStoreId, ],
    itemSupplier: [this.itemStock.itemSupplier, ],
    itemSupplierId: [this.itemStock.itemSupplierId, ],
    purchasePrice: [this.itemStock.purchasePrice, Validators.required],
    quantity: [this.itemStock.quantity, ],
    symbol: [this.itemStock.symbol, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.itemStockForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared itemstock
 */
prepareItemStock(): ItemStockModel {
	const controls = this.itemStockForm.controls;
	const _itemStock = new ItemStockModel();
  _itemStock.id = this.itemStock.id;
  
  _itemStock.attachment = controls.attachment.value;
  const _date = controls.date.value;
  if (_date) {
    _itemStock.date = this.typesUtilsService.dateFormat(_date);
  } else {
    _itemStock.date = '';
  }
 
  _itemStock.description = controls.description.value;
  if(_itemStock.id>0){
		_itemStock.isActive = controls.isActive.value;
	}else{
		_itemStock.isActive = 'yes';
	}
  _itemStock.itemName = controls.itemName.value;
  _itemStock.itemId = controls.itemId.value;
  _itemStock.itemCategory = controls.itemCategory.value;
  _itemStock.itemCategoryId = controls.itemCategoryId.value;
  _itemStock.itemPhoto = controls.itemPhoto.value;
  _itemStock.itemStore = controls.itemStore.value;
  _itemStock.itemStoreId = controls.itemStoreId.value;
  _itemStock.itemSupplier = controls.itemSupplier.value;
	_itemStock.itemSupplierId = controls.itemSupplierId.value;
  _itemStock.purchasePrice = controls.purchasePrice.value;
  _itemStock.quantity = controls.quantity.value;
  _itemStock.symbol = controls.symbol.value;


	return _itemStock;
}

/**
 * On Submit
 */
onSubmit() {
  debugger
	this.hasFormErrors = false;
	const controls = this.itemStockForm.controls;
	/** check form */
	if (this.itemStockForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedItemStock = this.prepareItemStock();
	if (editedItemStock.id > 0) {
		this.updateItemStock(editedItemStock);
	} else {
		this.createItemStock(editedItemStock);
	}

	const	_saveMessage= editedItemStock.id > 0 ? 'ItemStock  has been updated' : 'ItemStock has been created';
		
	const _messageType = editedItemStock.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadItemStockList();
		this.itemStockForm.reset();
		this.addItemStock();
		// this.itemstock.clear();
		// this.createForm();

}
onCancel(){
	this.itemStockForm.reset();
	this.addItemStock();
	// this.itemStock.clear();
	// this.createForm();
}
/**
 * Update ItemStock
 *
 * @param _itemStock: ItemStockModel
 */
updateItemStock(_itemStock: ItemStockModel) {
	const updateItemStock: Update<ItemStockModel> = {
		id: _itemStock.id,
		changes: _itemStock
	};
	this.store.dispatch(new ItemStockUpdated({
		partialItemStock: updateItemStock,
		itemStock: _itemStock
	}));


}

/**
 * Create ItemStock
 *
 * @param _itemStock: ItemStockModel
 */
createItemStock(_itemStock:ItemStockModel) {
	this.store.dispatch(new ItemStockOnServerCreated({ itemStock: _itemStock }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedItemStockId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _itemstock, isEdit: false });
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
