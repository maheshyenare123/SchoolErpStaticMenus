import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentFeeDepositesDataSource, StudentFeeDepositeModel, StudentFeeDepositesPageRequested, OneStudentFeeDepositeDeleted, ManyStudentFeeDepositesDeleted, StudentFeeDepositeService ,  } from '../../../../core/fees-collection';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
// import { StudentFeeDepositeEditDialogComponent } from '../class-timetable-edit/class-timetable-edit.dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StudentClassModel, SectionDtoModel, StudentClassService } from 'src/app/core/academics';
import { FeeCollectEditDialogComponent } from '../fee-collect-edit/fee-collect-edit.dialog.component';
import { StudentModel } from 'src/app/core/Models/student.model';

@Component({
  selector: 'kt-fees-collect',
  templateUrl: './fees-collect.component.html',
  styleUrls: ['./fees-collect.component.scss']
})
export class FeesCollectComponent implements OnInit {

 // Table fields
dataSource: StudentFeeDepositesDataSource;
displayedColumns = ['class', 'section', 'admissionNo', 'studentName', 'fatherName', 'dob', 'contact', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterCondition = '';
lastQuery: QueryParamsModel;
// Selection
selection = new SelectionModel<StudentFeeDepositeModel>(true, []);
studentFeeDepositesResult: StudentFeeDepositeModel[] = [];
private subscriptions: Subscription[] = [];

searchForm: FormGroup;
  hasFormErrors = false;
  data
studentfeedeposite
  classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
  collectionFeeShowFlag: boolean = false;
  student: StudentModel;
  studentListFlag: boolean = true;
  feesDepositeList: any;
  feesDiscountList: any;

  totalAmount: number = 0;
  totalDiscount: number = 0;
  totalFine: number = 0;
  totalPaid: number = 0; 
  totalBalance: number = 0;
constructor(public dialog: MatDialog,
             private activatedRoute: ActivatedRoute,
             private router: Router,
             private fb: FormBuilder,
             private subheaderService: SubheaderService,
             private layoutUtilsService: LayoutUtilsService,
             private store: Store<AppState>,
             private studentClassService: StudentClassService,
             private studentFeeDepositeService:StudentFeeDepositeService
             ) { }


/**
 * On init
 */
ngOnInit() {
  this.studentListFlag = true;
 this.createForm();
     // Init DataSource
     this.loadAllClasses();
     this.dataSource = new StudentFeeDepositesDataSource(this.store);
  
}
loadAllClasses() {
	debugger
	this.studentClassService.getAllStudentClasss().subscribe(res => {
		const data = res['data'];
		this.classList = data['content'];
		console.log(this.classList)
	}, err => {
	});
}
onClassSelectChange(classId){
	this.loadAllSectionsByClassId(classId);
}
loadAllSectionsByClassId(id:number) {
	debugger
	this.studentClassService.getAllSectionByClasssId(id).subscribe(res => {
		this.sectionList = res['data'];
		console.log(this.sectionList)
	}, err => {
	});
}
onSearch(){
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

		this.getAllStudentFeeDepositeList(controls.classId.value, controls.sectionId.value,controls.searchText.value);



}
getAllStudentFeeDepositeList(classId,sectionId,searchText) {
 const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
 this.subscriptions.push(sortSubscription);

 /* Data load will be triggered in two cases:
 - when a pagination event occurs => this.paginator.page
 - when a sort event occurs => this.sort.sortChange
 **/
 const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
   tap(() => this.loadStudentFeeDepositesList(classId,sectionId,searchText))
 )
 .subscribe();
 this.subscriptions.push(paginatorSubscriptions);

//  // Filtration, bind to searchInput
//  const searchSubscription = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
//    // tslint:disable-next-line:max-line-length
//    debounceTime(50), // The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator, we are limiting the amount of server requests emitted to a maximum of one every 150ms
//    distinctUntilChanged(), // This operator will eliminate duplicate values
//    tap(() => {
//      this.paginator.pageIndex = 0;
//      this.loadStudentFeeDepositesList(classId,sectionId);
//    })
//  )
//  .subscribe();
//  this.subscriptions.push(searchSubscription);

 // Init DataSource
 this.dataSource = new StudentFeeDepositesDataSource(this.store);
 const entitiesSubscription = this.dataSource.entitySubject.pipe(
   skip(1),
   distinctUntilChanged()
 ).subscribe(res => {
   this.studentFeeDepositesResult = res;
   console.log(this.studentFeeDepositesResult);
   if(this.studentFeeDepositesResult.length==0)this.dataSource.hasItems=false;
 });
 this.subscriptions.push(entitiesSubscription);
 // First load
 of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
   this.loadStudentFeeDepositesList(classId,sectionId,searchText);
 });
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
loadStudentFeeDepositesList(classId,sectionId,searchText) {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new StudentFeeDepositesPageRequested({ page: queryParams,classId,sectionId,searchText }));
 
  this.selection.clear();
}

/**
 * Returns object for filter
 */
filterConfiguration(): any {
  const filter: any = {};
  // const searchText: string = this.searchInput.nativeElement.value;
  const searchText: string ='';
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
createForm() {
  debugger;
  this.searchForm = this.fb.group({
    classId: ['', Validators.required],
    sectionId: ['', Validators.required],
    searchText: ['',],
    // attendanceDate: [this.typesUtilsService.getDateFromString(this.attendanceDate), Validators.compose([Validators.nullValidator])],

  })
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
 * @param _item: StudentFeeDepositeModel
 */
deleteStudentFeeDeposite(_item: StudentFeeDepositeModel) {
  const _title = ' StudentFeeDeposite Delete';
  const _description = 'Are you sure to permanently delete this  StudentFeeDeposite?';
  const _waitDesciption = ' StudentFeeDeposite is deleting...';
  const _deleteMessage = ` StudentFeeDeposite has been deleted`;

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }
//delete api call
    this.store.dispatch(new OneStudentFeeDepositeDeleted({ id: _item.feeGroupId }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
  });
}

/**
 * Delete products
 */
deleteProducts() {
  const _title = ' StudentFeeDeposites Delete';
  const _description = 'Are you sure to permanently delete selected  StudentFeeDeposites?';
  const _waitDesciption = ' StudentFeeDeposites are deleting...';
  const _deleteMessage = 'Selected  StudentFeeDeposites have been deleted';

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }

    const idsForDeletion: number[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.selection.selected.length; i++) {
      idsForDeletion.push(this.selection.selected[i].feeGroupId);
    }

    //many product deleted
    this.store.dispatch(new ManyStudentFeeDepositesDeleted({ ids: idsForDeletion }));
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
	 * Show add studentFeeDeposite dialog
	 */
	addStudentFeeDeposite() {
		const newStudentFeeDeposite = new StudentFeeDepositeModel();
		newStudentFeeDeposite.clear(); // Set all defaults fields
		this.editStudentFeeDeposite(newStudentFeeDeposite);
	}

	/**
	 * Show Edit StudentFeeDeposite dialog and save after success close result
	 * @param studentFeeDeposite: StudentFeeDepositeModel
	 */
	editStudentFeeDeposite(studentFeeDeposite: StudentFeeDepositeModel) {
		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const _saveMessage = studentFeeDeposite.feeGroupId > 0 ? 'Edit  StudentFeeDeposite' : 'Create  StudentFeeDeposite';
    
		// const _messageType = studentFeeDeposite.feeGroupId > 0 ? MessageType.Update : MessageType.Create;
		// const dialogRef = this.dialog.open(StudentFeeDepositeEditDialogComponent, { data: { studentFeeDeposite } });
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}

		// 	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		// 	// this.loadStudentFeeDepositesList();
		// });
  }
  
  collectionFeeShow(studentFeeDeposite: StudentModel){
    this.student = studentFeeDeposite
    this.collectionFeeShowFlag = true;
    this.studentListFlag = false;
    this.getStudentFeeDepositeById();
    this.loadAllFeesDiscount();
  }

  getStudentFeeDepositeById(){
    debugger
    this.feesDepositeList = []
    this.studentFeeDepositeService.getStudentFeeDepositeById(this.student.studentSessionId).subscribe(res => {
      const data = res['data'];
      this.feesDepositeList = data['studentFeeDetails'];
      console.log(this.feesDepositeList)
      this.totalAmount= 0;
      this.totalDiscount= 0;
      this.totalFine= 0;
      this.totalPaid= 0; 
      this.totalBalance= 0;

      this.feesDepositeList.map(item=>{
        this.totalAmount += item.amount;
        this.totalDiscount += item.discount;
        this.totalFine += item.fine;
        this.totalPaid += item.paid;
        this.totalBalance += item.balance;

      })

    }, err => {
    });
  }

  loadAllFeesDiscount() {
		debugger
		this.feesDiscountList = []
	this.studentFeeDepositeService.getStudentDiscountById(this.student.studentSessionId).subscribe(res => {
	  const data1 = res['data'];
	  this.feesDiscountList = data1;
	  console.log(this.feesDiscountList)
	}, err => {
	});
	}

  collectStudentFee(studentFeeDeposite: StudentFeeDepositeModel,type:string) {
    debugger
   let student = this.student
		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    // const _saveMessage = student.id > 0 ? 'Student Fees Collect' : 'Create product';
    
		// const _messageType = student.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(FeeCollectEditDialogComponent, { data: { studentFeeDeposite,type,student } });
		dialogRef.afterClosed().subscribe(res => {
      this.getStudentFeeDepositeById()
			if (!res) {
				return;
			}

		//	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			// this.loadStudentsList();
		});
	}
/**
 * Check all rows are selected
 */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.studentFeeDepositesResult.length;
  return numSelected === numRows;
}

/**
 * Selects all rows if they are not all selected; otherwise clear selection
 */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
  } else {
    this.studentFeeDepositesResult.forEach(row => this.selection.select(row));
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

onSelection(data, $event){
  if( $event.target.checked){
    // this.customerIdList.push(data)
  
  }else{
    // const index = this.customerIdList.findIndex(item =>item.customerId === data.customerId);
    // this.customerIdList.splice(index, 1);
  }
}

onSelectionAll(data, $event){
  if( $event.target.checked){
    // this.customerIdList.push(data)
    
  }else{
    // const index = this.customerIdList.findIndex(item =>item.customerId === data.customerId);
    // this.customerIdList.splice(index, 1);
  }
}

}
