
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CategorysDataSource, CategoryDtoModel,selectCategorysActionLoading } from 'src/app/core/student-information';
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
import { CategorysPageRequested, OneCategoryDeleted, ManyCategorysDeleted, CategorysStatusUpdated, CategoryUpdated, CategoryOnServerCreated, selectLastCreatedCategoryId } from '../../../../core/student-information';



@Component({
  selector: 'kt-student-categories',
  templateUrl: './student-categories.component.html',
  styleUrls: ['./student-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentCategoriesComponent implements OnInit {

 // Table fields
dataSource: CategorysDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'category', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<CategoryDtoModel>(true, []);
categorysResult: CategoryDtoModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
category: CategoryDtoModel;
categoryForm: FormGroup;
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
			tap(() => this.loadCategoryList())
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
				this.loadCategoryList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new CategorysDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.categorysResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadCategoryList();
		}); // Remove this line, just loading imitation

this.addCategory();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Categorys List from service through data-source
	 */
	loadCategoryList() {
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
		this.store.dispatch(new CategorysPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.category = searchText;
		if (!searchText) {
			return filter;
		}

		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete category
	 *
	 * @param _item: CategoryDtoModel
	 */
	deleteCategory(_item: CategoryDtoModel) {

		const _title = 'Student Category';
		const _description = 'Are you sure to permanently delete selected Student Category?';
		const _waitDesciption = 'Student Category is deleting...';
		const _deleteMessage = ' Selected Student Category has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneCategoryDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadCategoryList();
		});
		

	}

	/**
	 * Show add Category dialog
	 */
	addCategory() {
		this.category=new CategoryDtoModel();
		this.category.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Category dialog and save after success close result
	 * @param category: CategoryDtoModel
	 */
	editCategory(category: CategoryDtoModel) {
		
		this.category=category;
		this.createForm();

	}



createForm() {
	debugger;
	this.categoryForm = this.fb.group({
		category: [this.category.category, Validators.required],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.categoryForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared category
 */
prepareCategory(): CategoryDtoModel {
	const controls = this.categoryForm.controls;
	const _category = new CategoryDtoModel();
	_category.id = this.category.id;
	if(_category.id>0 ){
		_category.isActive=this.category.isActive;
	}else{
		_category.isActive='yes';
	}

	_category.category = controls.category.value;


	return _category;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.categoryForm.controls;
	/** check form */
	if (this.categoryForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedCategory = this.prepareCategory();
	if (editedCategory.id > 0) {
		this.updateCategory(editedCategory);
	} else {
		this.createCategory(editedCategory);
	}

	const	_saveMessage= editedCategory.id > 0 ? 'Student Category  has been updated' : 'Student Category has been created';
		
	const _messageType = editedCategory.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadCategoryList();
		this.categoryForm.reset();
		// this.category.clear();
		// this.createForm();
		this.addCategory();


}
onCancel(){
	this.categoryForm.reset();
	// this.category.clear();
	// this.createForm();
	this.addCategory();
}
/**
 * Update Category
 *
 * @param _category: CategoryDtoModel
 */
updateCategory(_category: CategoryDtoModel) {
	const updateCategory: Update<CategoryDtoModel> = {
		id: _category.id,
		changes: _category
	};
	this.store.dispatch(new CategoryUpdated({
		partialCategory: updateCategory,
		category: _category
	}));


}

/**
 * Create Category
 *
 * @param _category: CategoryDtoModel
 */
createCategory(_category:CategoryDtoModel) {
	this.store.dispatch(new CategoryOnServerCreated({ category: _category }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedCategoryId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _category, isEdit: false });
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
