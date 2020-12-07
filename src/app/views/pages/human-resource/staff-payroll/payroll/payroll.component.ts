
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StaffsDataSource, StaffModel,selectStaffsActionLoading, RoleService, StaffPayslipsDataSource, StaffPayslipsPageRequested } from '../../../../../core/human-resource';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from '../../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { StaffsPageRequested, OneStaffDeleted, ManyStaffsDeleted, StaffsStatusUpdated, StaffUpdated, StaffOnServerCreated, selectLastCreatedStaffId } from '../../../../../core/human-resource';
import { GeneratePayrollEditDialogComponent } from '../generate-payroll-edit/generate-payroll-edit.dialog.component';
import { ProceedPayEditDialogComponent } from '../proceed-pay-edit/proceed-pay-edit.dialog.component';
import { ViewPayslipEditDialogComponent } from '../view-payslip-edit/view-payslip-edit.dialog.component';
import { RolesDtoModel } from 'src/app/core/Models/rolesDto.model';



@Component({
  selector: 'kt-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent implements OnInit {

  // Table fields
dataSource: StaffPayslipsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);

   
displayedColumns = ['id', 'staffId','name','role','department','designation','mobileNo','actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<StaffModel>(true, []);
staffsResult: StaffModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
staff: StaffModel;
staffForm: FormGroup;
searchForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;


roleId : number;
month : string;
year : string;

rolesList: RolesDtoModel[] = [];
  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private roleService:RoleService) { }

  ngOnInit() {

	debugger;
	this.loadAllRoles();
    this.createForm();
	this.dataSource = new StaffPayslipsDataSource(this.store);	
  }
  	//get All Class List
	loadAllRoles() {
		debugger
		this.roleService.getAllRoles().subscribe(res => {
			const data = res['data'];
			this.rolesList = data['content'];
			console.log(this.rolesList)
		}, err => {
		});
	}
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Staffs List from service through data-source
	 */
	loadStaffList(roleName,month,year) {
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
		this.store.dispatch(new StaffPayslipsPageRequested({ page: queryParams,roleName,month,year }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		// const searchText: string = this.searchInput.nativeElement.value;
		const searchText: string = '';
		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
		filter.staff = searchText;
		return filter;
	}

	


createForm() {
  debugger;
  this.searchForm = this.fb.group({
    roleId: [this.roleId, ],
    month: [this.month, Validators.required],
    year: [this.year, Validators.required ],
  })

	
}


	/**
	 * On Search
	 */
	onSearch() {
		this.hasFormErrors = false;
		const controls = this.searchForm.controls;
		/** check form */
		if (this.searchForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		//search api
		// const	date = this.typesUtilsService.dateFormat(controls.attendanceDate.value);
		this.getAllPayrollData(controls.roleId.value, controls.month.value, controls.year.value);
		
		
	}

getAllPayrollData(rolename,month,year){
	const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
	this.subscriptions.push(sortSubscription);

	/* Data load will be triggered in two cases:
	- when a pagination event occurs => this.paginator.page
	- when a sort event occurs => this.sort.sortChange
	**/
	const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
		tap(() => this.loadStaffList(rolename,month,year))
	)
	.subscribe();
	this.subscriptions.push(paginatorSubscriptions);

	// Filtration, bind to searchInput
	// const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
	// 	// tslint:disable-next-line:max-line-length
	// 	debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
	// 	distinctUntilChanged(), // This operator will eliminate duplicate values
	// 	tap(() => {
	// 		this.paginator.pageIndex = 0;
	// 		this.loadStaffList();
	// 	})
	// )
	// .subscribe();
	// this.subscriptions.push(searchSubscription);

	// Init DataSource
	this.dataSource = new StaffPayslipsDataSource(this.store);

	const entitiesSubscription = this.dataSource.entitySubject.pipe(
		skip(1),
		distinctUntilChanged()
	).subscribe(res => {
		debugger
console.log(res);
		this.staffsResult = res;
	});
	this.subscriptions.push(entitiesSubscription);
	// First load
	of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
		this.loadStaffList(rolename,month,year);
	}); 
}



  
/** ACTIONS */
/**
 * Delete product
 *
 * @param _item: StaffModel
 */
deleteStaff(_item: StaffModel) {
  const _title = ' Staff Delete';
  const _description = 'Are you sure to permanently delete this  Staff?';
  const _waitDesciption = ' Staff is deleting...';
  const _deleteMessage = ` Staff has been deleted`;

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }
//delete api call
    this.store.dispatch(new OneStaffDeleted({ id: _item.id }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
  });
}

/**
 * Delete products
 */
deleteProducts() {
  const _title = ' Staffs Delete';
  const _description = 'Are you sure to permanently delete selected  Staffs?';
  const _waitDesciption = ' Staffs are deleting...';
  const _deleteMessage = 'Selected  Staffs have been deleted';

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }

    const idsForDeletion: number[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.selection.selected.length; i++) {
      idsForDeletion.push(this.selection.selected[i].id);
    }

    //many product deleted
    this.store.dispatch(new ManyStaffsDeleted({ ids: idsForDeletion }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    this.selection.clear();
  });
}

/**
 * Fetch selected products
 */
// fetchProducts() {
//   // tslint:disable-next-line:prefer-const
//   let messages = [];
//   this.selection.selected.forEach(elem => {
//     messages.push({
//       text: `${elem.manufacture} ${elem.model} ${elem.modelYear}`,
//       id: elem.VINCode,
//       status: elem.status
//     });
//   });
//   this.layoutUtilsService.fetchElements(messages);
// }

/**
 * Update status dialog
 */
// updateStatusForProducts() {
//   const _title = 'Update status for selected products';
//   const _updateMessage = 'Status has been updated for selected products';
//   const _statuses = [{ value: 0, text: 'Selling' }, { value: 1, text: 'Sold' }];
//   const _messages = [];

//   this.selection.selected.forEach(elem => {
//     _messages.push({
//       text: `${elem.manufacture} ${elem.model} ${elem.modelYear}`,
//       id: elem.VINCode,
//       status: elem.status,
//       statusTitle: this.getItemStatusString(elem.status),
//       statusCssClass: this.getItemCssClassByStatus(elem.status)
//     });
//   });

//   const dialogRef = this.layoutUtilsService.updateStatusForEntities(_title, _statuses, _messages);
//   dialogRef.afterClosed().subscribe(res => {
//     if (!res) {
//       this.selection.clear();
//       return;
//     }

//     this.store.dispatch(new ProductsStatusUpdated({
//       status: +res,
//       products: this.selection.selected
//     }));

//     this.layoutUtilsService.showActionNotification(_updateMessage, MessageType.Update);
//     this.selection.clear();
//   });
// }

/**
 * Redirect to edit page
 *
 * @param id: any
 */
/**
	 * Show add customer dialog
	 */
	addStaff() {
		const newCustomer = new StaffModel();
		newCustomer.clear(); // Set all defaults fields
		this.editStaff(newCustomer);
	}

	/**
	 * Show Edit customer dialog and save after success close result
	 * @param customer: CustomerModel
	 */
	editStaff(staff: StaffModel) {
		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const _saveMessage = staff.id > 0 ? 'Edit  Staff' : 'Create  Staff';
    
		// const _messageType = staff.id > 0 ? MessageType.Update : MessageType.Create;
		// const dialogRef = this.dialog.open(StaffEditDialogComponent, { data: { staff } });
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}

		// 	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		// 	this.loadStaffList();
		// });
	}

  onGeneratePaySlip(staff: StaffModel){
    let searchForm =  this.searchForm 
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    // const _saveMessage = staff.id > 0 ? 'Edit  Staff' : 'Create  Staff';
    
		// const _messageType = staff.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(GeneratePayrollEditDialogComponent, { data: { staff , searchForm} });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			// this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			// this.loadStaffList();
		});
  }
  onProceedPay(staff: StaffModel){
    let searchForm =  this.searchForm 
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    // const _saveMessage = staff.id > 0 ? 'Edit  Staff' : 'Create  Staff';
    
		// const _messageType = staff.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ProceedPayEditDialogComponent, { data: { staff , searchForm} });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			// this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			// this.loadStaffList();
		});
  }
  onViewPaySlip(staff: StaffModel){
    let searchForm =  this.searchForm 
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    // const _saveMessage = staff.id > 0 ? 'Edit  Staff' : 'Create  Staff';
    
		// const _messageType = staff.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ViewPayslipEditDialogComponent, { data: { staff , searchForm} });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			// this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			// this.loadStaffList();
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



