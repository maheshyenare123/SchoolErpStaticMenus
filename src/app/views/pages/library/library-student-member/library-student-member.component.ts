import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LibraryStudentMembersDataSource, LibraryStudentMemberModel, LibraryStudentMembersPageRequested, OneLibraryStudentMemberDeleted, ManyLibraryStudentMembersDeleted } from 'src/app/core/library';
import { QueryParamsModel, LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { StudentClassModel, SectionDtoModel, StudentClassService, SectionService } from 'src/app/core/academics';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LibraryStudentMemberEditDialogComponent } from '../library-student-member-edit/library-student-member-edit.dialog.component';


@Component({
  selector: 'kt-library-student-member',
  templateUrl: './library-student-member.component.html',
  styleUrls: ['./library-student-member.component.scss']
})
export class LibraryStudentMemberComponent implements OnInit {

  // Table fields
dataSource: LibraryStudentMembersDataSource;
displayedColumns = ['memberId', 'libraryCardNo', 'addmissionNo', 'studentName', 'class', 'fatherName', 'dob', 'gender', 'mobileNo', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterCondition = '';
lastQuery: QueryParamsModel;
// Selection
selection = new SelectionModel<LibraryStudentMemberModel>(true, []);
libraryStudentMembersResult: LibraryStudentMemberModel[] = [];
private subscriptions: Subscription[] = [];


searchForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;

classId: number;
sectionId: number;


classList: StudentClassModel[] = [];
sectionList: SectionDtoModel[] = [];


constructor(public dialog: MatDialog,
             private activatedRoute: ActivatedRoute,
             private router: Router,
             private subheaderService: SubheaderService,
             private layoutUtilsService: LayoutUtilsService,
             private store: Store<AppState>,
             private fb: FormBuilder,
             private studentClassService: StudentClassService,
             private sectionService: SectionService,
             ) { }


/**
 * On init
 */
ngOnInit() {

	this.loadAllClasses();
		this.loadAllSectionsByClassId(1);

 this.createForm();
 // Init DataSource
 this.dataSource = new LibraryStudentMembersDataSource(this.store);
}


//get All Class List

loadAllClasses() {
	debugger
	this.studentClassService.getAllStudentClasss().subscribe(res => {
		const data = res['data'];
		this.classList = data['content'];
		console.log(this.classList)
	}, err => {
	});
}
onClassSelectChange(classObj:StudentClassModel){
	// this.loadAllSectionsByClassId(classObj.id);
}
loadAllSectionsByClassId(id:number) {
	debugger
	this.sectionService.getAllSections().subscribe(res => {
		const data = res['data'];
		this.sectionList = data['content'];
		console.log(this.sectionList)
	}, err => {
	});
}
	onSearch() {
		debugger;
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

		this.getAllLibraryStudentMember(controls.classId.value, controls.sectionId.value);


	}
getAllLibraryStudentMember(classId,sectionId){
  // If the user changes the sort order, reset back to the first page.
 const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
 this.subscriptions.push(sortSubscription);

 /* Data load will be triggered in two cases:
 - when a pagination event occurs => this.paginator.page
 - when a sort event occurs => this.sort.sortChange
 **/
 const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
   tap(() => this.loadLibraryStudentMembersList(classId,sectionId))
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
     this.loadLibraryStudentMembersList(classId,sectionId);
   })
 )
 .subscribe();
 this.subscriptions.push(searchSubscription);

 // Init DataSource
 this.dataSource = new LibraryStudentMembersDataSource(this.store);
 const entitiesSubscription = this.dataSource.entitySubject.pipe(
   skip(1),
   distinctUntilChanged()
 ).subscribe(res => {
   this.libraryStudentMembersResult = res;
   console.log(this.libraryStudentMembersResult);
 });
 this.subscriptions.push(entitiesSubscription);
 // First load
 of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
   this.loadLibraryStudentMembersList(classId,sectionId);
 }); // Remove this line, just loading imitation

}
	createForm() {
		debugger;
		this.searchForm = this.fb.group({
			classId: [this.classId, Validators.required],
			sectionId: [this.sectionId, Validators.required],
		})

	
	}



/**
 * On Destroy
 */
ngOnDestroy() {
  this.subscriptions.forEach(el => el.unsubscribe());
}

/**
 * Load Products List
 */
loadLibraryStudentMembersList(classId,sectionId) {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new LibraryStudentMembersPageRequested({ page: queryParams,classId,sectionId }));
 
  this.selection.clear();
}

/**
 * Returns object for filter
 */
filterConfiguration(): any {
  const filter: any = {};
  const searchText: string = this.searchInput.nativeElement.value;

  if (this.filterStatus && this.filterStatus.length > 0) {
    filter.status = +this.filterStatus;
  }

  if (this.filterCondition && this.filterCondition.length > 0) {
    filter.condition = +this.filterCondition;
  }

  filter.model = searchText;

  filter.manufacture = searchText;
  filter.color = searchText;
  filter.VINCode = searchText;
  return filter;
}

/**
 * Restore state
 *
 * @param queryParams: QueryParamsModel
 * @param id: number
 */
restoreState(queryParams: QueryParamsModel, id: number) {

  if (!queryParams.filter) {
    return;
  }

  if ('condition' in queryParams.filter) {
    this.filterCondition = queryParams.filter.condition.toString();
  }

  if ('status' in queryParams.filter) {
    this.filterStatus = queryParams.filter.status.toString();
  }

  if (queryParams.filter.model) {
    this.searchInput.nativeElement.value = queryParams.filter.model;
  }
}

/** ACTIONS */
/**
 * Delete product
 *
 * @param _item: LibraryStudentMemberModel
 */
deleteLibraryStudentMember(_item: LibraryStudentMemberModel) {
  const _title = ' Library Student Member Delete';
  const _description = 'Are you sure to permanently delete this  Library Student Member?';
  const _waitDesciption = ' Library Student Member is deleting...';
  const _deleteMessage = ` Library Student Member has been deleted`;

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }
//delete api call
    this.store.dispatch(new OneLibraryStudentMemberDeleted({ id: _item.studentId }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
  });
}

/**
 * Delete products
 */
deleteProducts() {
  const _title = ' Library Student Members Delete';
  const _description = 'Are you sure to permanently delete selected  Library Student Members?';
  const _waitDesciption = ' Library Student Members are deleting...';
  const _deleteMessage = 'Selected  Library Student Members have been deleted';

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }

    const idsForDeletion: number[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.selection.selected.length; i++) {
      idsForDeletion.push(this.selection.selected[i].studentId);
    }

    //many product deleted
    this.store.dispatch(new ManyLibraryStudentMembersDeleted({ ids: idsForDeletion }));
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
	addLibraryStudentMember() {
		const newCustomer = new LibraryStudentMemberModel();
		newCustomer.clear(); // Set all defaults fields
		this.editLibraryStudentMember(newCustomer);
	}

	/**
	 * Show Edit customer dialog and save after success close result
	 * @param customer: CustomerModel
	 */
	editLibraryStudentMember(libraryStudentMember: LibraryStudentMemberModel) {
		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    // const _saveMessage = libraryStudentMember.studentId > 0 ? 'Edit  Library Student Member' : 'Create  Library Student Member';
    const _saveMessage ='Create Library Student Member';
		// const _messageType = libraryStudentMember.studentId > 0 ? MessageType.Update : MessageType.Create;
  	const _messageType = MessageType.Create;
  
    const dialogRef = this.dialog.open(LibraryStudentMemberEditDialogComponent, { data: { libraryStudentMember },width: '450px' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			// this.loadLibraryStudentMembersList();
		});
	}

/**
 * Check all rows are selected
 */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.libraryStudentMembersResult.length;
  return numSelected === numRows;
}

/**
 * Selects all rows if they are not all selected; otherwise clear selection
 */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
  } else {
    this.libraryStudentMembersResult.forEach(row => this.selection.select(row));
  }
}

/* UI */
/**
 * Returns status string
 *
 * @param status: number
 */
getItemStatusString(status: String ): string {
  switch (status) {
    case 'yes':
      return 'Active';
    case 'no':
      return 'DeActive';
  }
  return '';
}

/**
 * Returns CSS Class by status
 *
 * @param status: number
 */
getItemCssClassByStatus(status: String): string {
  switch (status) {
    case 'yes':
      return 'success';
    case 'no':
      return 'metal';
  }
  return '';
}

/**
 * Rerurns condition string
 *
 * @param condition: number
 */
getItemConditionString(condition: number = 0): string {
  switch (condition) {
    case 0:
      return 'New';
    case 1:
      return 'Used';
  }
  return '';
}

/**
 * Returns CSS Class by condition
 *
 * @param condition: number
 */
getItemCssClassByCondition(condition: number = 0): string {
  switch (condition) {
    case 0:
      return 'danger';
    case 1:
      return 'primary';
  }
  return '';
}
}
