import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ItemCategorysDataSource, ItemCategoryModel,selectItemCategorysActionLoading, } from 'src/app/core/inventory';
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
import { ItemCategorysPageRequested, OneItemCategoryDeleted, ManyItemCategorysDeleted, ItemCategorysStatusUpdated, ItemCategoryUpdated, ItemCategoryOnServerCreated, selectLastCreatedItemCategoryId } from '../../../../core/inventory';


@Component({
  selector: 'kt-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.scss']
})
export class ItemCategoryComponent implements OnInit {

  // Table fields
dataSource: ItemCategorysDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'itemCategory', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ItemCategoryModel>(true, []);
itemCategorysResult: ItemCategoryModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
itemCategory: ItemCategoryModel;
itemCategoryForm: FormGroup;
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
			tap(() => this.loadItemCategoryList())
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
				this.loadItemCategoryList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ItemCategorysDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.itemCategorysResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadItemCategoryList();
		}); // Remove this line, just loading imitation

		this.addItemCategory();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	
	/**
	 * Load ItemCategorys List from service through data-source
	 */
	loadItemCategoryList() {
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
		this.store.dispatch(new ItemCategorysPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.ItemCategory = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete ItemCategory
	 *
	 * @param _item: ItemCategoryModel
	 */
	deleteItemCategory(_item: ItemCategoryModel) {

		const _title = 'ItemCategory';
		const _description = 'Are you sure to permanently delete selected ItemCategory?';
		const _waitDesciption = 'ItemCategory is deleting...';
		const _deleteMessage = ' Selected ItemCategory has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneItemCategoryDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadItemCategoryList();
		});
		

	}

	/**
	 * Show add ItemCategory dialog
	 */
	addItemCategory() {
		this.itemCategory=new ItemCategoryModel();
		this.itemCategory.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit ItemCategory dialog and save after success close result
	 * @param itemCategory: ItemCategoryModel
	 */
	editItemCategory(itemCategory: ItemCategoryModel) {
		
		this.itemCategory=itemCategory;
		this.createForm();

	}



createForm() {
	debugger;
	this.itemCategoryForm = this.fb.group({
   
    itemCategory: [this.itemCategory.itemCategory, Validators.required],
    description: [this.itemCategory.description, ],
    isActive: [this.itemCategory.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.itemCategoryForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared itemCategory
 */
prepareItemCategory(): ItemCategoryModel {
	const controls = this.itemCategoryForm.controls;
	const _itemCategory = new ItemCategoryModel();
	_itemCategory.id = this.itemCategory.id;
  _itemCategory.itemCategory = controls.itemCategory.value;
	_itemCategory.description = controls.description.value;
	if(_itemCategory.id>0){
		_itemCategory.isActive = controls.isActive.value;
	}else{
		_itemCategory.isActive = 'yes';
	}

	return _itemCategory;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.itemCategoryForm.controls;
	/** check form */
	if (this.itemCategoryForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedItemCategory = this.prepareItemCategory();
	if (editedItemCategory.id > 0) {
		this.updateItemCategory(editedItemCategory);
	} else {
		this.createItemCategory(editedItemCategory);
	}

	const	_saveMessage= editedItemCategory.id > 0 ? 'ItemCategory  has been updated' : 'ItemCategory has been created';
		
	const _messageType = editedItemCategory.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadItemCategoryList();
		this.itemCategoryForm.reset();
		this.addItemCategory();
		// this.itemCategory.clear();
		// this.createForm();

}
onCancel(){
	this.itemCategoryForm.reset();
	this.addItemCategory();
	// this.itemCategory.clear();
	// this.createForm();
}
/**
 * Update ItemCategory
 *
 * @param _itemCategory: ItemCategoryModel
 */
updateItemCategory(_itemCategory: ItemCategoryModel) {
	const updateItemCategory: Update<ItemCategoryModel> = {
		id: _itemCategory.id,
		changes: _itemCategory
	};
	this.store.dispatch(new ItemCategoryUpdated({
		partialItemCategory: updateItemCategory,
		itemCategory: _itemCategory
	}));


}

/**
 * Create ItemCategory
 *
 * @param _itemCategory: ItemCategoryModel
 */
createItemCategory(_itemCategory:ItemCategoryModel) {
	this.store.dispatch(new ItemCategoryOnServerCreated({ itemCategory: _itemCategory }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedItemCategoryId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _itemCategory, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
