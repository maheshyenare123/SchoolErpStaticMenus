
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DepartmentsDataSource, DepartmentModel,selectDepartmentsActionLoading } from 'src/app/core/human-resource';
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
import { DepartmentsPageRequested, OneDepartmentDeleted, ManyDepartmentsDeleted, DepartmentsStatusUpdated, DepartmentUpdated, DepartmentOnServerCreated, selectLastCreatedDepartmentId } from '../../../../core/human-resource';


@Component({
  selector: 'kt-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

   // Table fields
dataSource: DepartmentsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'department', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<DepartmentModel>(true, []);
departmentsResult: DepartmentModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
department: DepartmentModel;
departmentForm: FormGroup;
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
			tap(() => this.loadDepartmentList())
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
				this.loadDepartmentList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new DepartmentsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.departmentsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadDepartmentList();
		}); // Remove this line, just loading imitation

this.addDepartment();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Departments List from service through data-source
	 */
	loadDepartmentList() {
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
		this.store.dispatch(new DepartmentsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.department = searchText;
		if (!searchText) {
			return filter;
		}
		filter.department = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Department
	 *
	 * @param _item: DepartmentModel
	 */
	deleteDepartment(_item: DepartmentModel) {

		const _title = 'Department';
		const _description = 'Are you sure to permanently delete selected Department?';
		const _waitDesciption = 'Department is deleting...';
		const _deleteMessage = ' Selected Department has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneDepartmentDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadDepartmentList();
		});
		

	}

	/**
	 * Show add Department dialog
	 */
	addDepartment() {
		this.department=new DepartmentModel();
		this.department.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Department dialog and save after success close result
	 * @param department: DepartmentModel
	 */
	editDepartment(department: DepartmentModel) {
		
		this.department=department;
		this.createForm();

	}



createForm() {
	debugger;
	this.departmentForm = this.fb.group({
		departmentName: [this.department.departmentName, Validators.required],
		isActive: [this.department.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.departmentForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared Department
 */
prepareDepartment(): DepartmentModel {
	const controls = this.departmentForm.controls;
	const _department = new DepartmentModel();
	_department.id = this.department.id;
	_department.departmentName = controls.departmentName.value;
	_department.isActive='yes';
	return _department;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.departmentForm.controls;
	/** check form */
	if (this.departmentForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedDepartment = this.prepareDepartment();
	if (editedDepartment.id > 0) {
		this.updateDepartment(editedDepartment);
	} else {
		this.createDepartment(editedDepartment);
	}

	const	_saveMessage= editedDepartment.id > 0 ? 'Department  has been updated' : 'Department has been created';
		
	const _messageType = editedDepartment.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadDepartmentList();
		this.departmentForm.reset();
		this.addDepartment();
		// this.department.clear();
		// this.createForm();

}
onCancel(){
	this.departmentForm.reset();
	this.addDepartment();
	// this.department.clear();
	// this.createForm();
}
/**
 * Update Department
 *
 * @param _department: DepartmentModel
 */
updateDepartment(_department: DepartmentModel) {
	const updateDepartment: Update<DepartmentModel> = {
		id: _department.id,
		changes: _department
	};
	this.store.dispatch(new DepartmentUpdated({
		partialDepartment: updateDepartment,
	department: _department
	}));


}

/**
 * Create Department
 *
 * @param _department: DepartmentModel
 */
createDepartment(_department:DepartmentModel) {
	this.store.dispatch(new DepartmentOnServerCreated({ department: _department }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedDepartmentId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _department, isEdit: false });
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

