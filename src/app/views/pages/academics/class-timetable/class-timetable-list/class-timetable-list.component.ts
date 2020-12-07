import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ClassTimetablesDataSource, ClassTimetableModel, ClassTimetablesPageRequested, OneClassTimetableDeleted, ManyClassTimetablesDeleted, StudentClassService, StudentClassModel, SectionDtoModel, ClassTimetableService, TimetableDayModel } from '../../../../../core/academics';
import { QueryParamsModel, LayoutUtilsService, MessageType } from '../../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { ClassTimetableEditDialogComponent } from '../class-timetable-edit/class-timetable-edit.dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'kt-class-timetable-list',
  templateUrl: './class-timetable-list.component.html',
  styleUrls: ['./class-timetable-list.component.scss']
})
export class ClassTimetableListComponent implements OnInit {

 // Table fields
dataSource: ClassTimetablesDataSource;
displayedColumns = ['mon', 'tue', 'wed', 'thus', 'fri', 'sat', 'sun', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterCondition = '';
lastQuery: QueryParamsModel;
// Selection
selection = new SelectionModel<ClassTimetableModel>(true, []);
classTimetablesResult: ClassTimetableModel[] = [];
private subscriptions: Subscription[] = [];

searchForm: FormGroup;
  hasFormErrors = false;
  

  classList: StudentClassModel[] = [];
  sectionList: SectionDtoModel[] = [];
  classTimetablesData:ClassTimetableModel;
  timeTableData:TimetableDayModel;
  
  loading:boolean=false;
constructor(public dialog: MatDialog,
             private activatedRoute: ActivatedRoute,
             private router: Router,
             private fb: FormBuilder,
             private subheaderService: SubheaderService,
             private layoutUtilsService: LayoutUtilsService,
             private store: Store<AppState>,
             private studentClassService: StudentClassService,
             private classTimetableService:ClassTimetableService
             ) { }


/**
 * On init
 */
ngOnInit() {

 this.createForm();
     // Init DataSource
     this.loadAllClasses();
     this.dataSource = new ClassTimetablesDataSource(this.store);
  
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
this.loading=true;
		this.getAllClassTimetableListByservice(controls.classId.value, controls.sectionId.value);



}
getAllClassTimetableListByservice(classId, sectionId){

this.classTimetableService.getAllClassTimetables(classId,sectionId).subscribe(res=>{
  this.classTimetablesData=res['data'];
  // this.timeTableData= this.classTimetablesResult.
  console.log(  this.classTimetablesData);
  this.loading=false;
},eror=>{


})

}


getAllClassTimetableList(classId,sectionId) {
 const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
 this.subscriptions.push(sortSubscription);

 /* Data load will be triggered in two cases:
 - when a pagination event occurs => this.paginator.page
 - when a sort event occurs => this.sort.sortChange
 **/
 const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
   tap(() => this.loadClassTimetablesList(classId,sectionId))
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
//      this.loadClassTimetablesList(classId,sectionId);
//    })
//  )
//  .subscribe();
//  this.subscriptions.push(searchSubscription);

 // Init DataSource
 this.dataSource = new ClassTimetablesDataSource(this.store);
 const entitiesSubscription = this.dataSource.entitySubject.pipe(
   skip(1),
   distinctUntilChanged()
 ).subscribe(res => {
   this.classTimetablesResult = res;
   console.log(this.classTimetablesResult);
   if(this.classTimetablesResult.length==0)this.dataSource.hasItems=false;
 });
 this.subscriptions.push(entitiesSubscription);
 // First load
 of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
   this.loadClassTimetablesList(classId,sectionId);
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
loadClassTimetablesList(classId,sectionId) {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new ClassTimetablesPageRequested({ page: queryParams,classId,sectionId }));
 
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
 * @param _item: ClassTimetableModel
 */
deleteClassTimetable(_item: ClassTimetableModel) {
  const _title = ' ClassTimetable Delete';
  const _description = 'Are you sure to permanently delete this  ClassTimetable?';
  const _waitDesciption = ' ClassTimetable is deleting...';
  const _deleteMessage = ` ClassTimetable has been deleted`;

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }
//delete api call
    this.store.dispatch(new OneClassTimetableDeleted({ id: _item.id }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
  });
}

/**
 * Delete products
 */
deleteProducts() {
  const _title = ' ClassTimetables Delete';
  const _description = 'Are you sure to permanently delete selected  ClassTimetables?';
  const _waitDesciption = ' ClassTimetables are deleting...';
  const _deleteMessage = 'Selected  ClassTimetables have been deleted';

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
    this.store.dispatch(new ManyClassTimetablesDeleted({ ids: idsForDeletion }));
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
	 * Show add classTimetable dialog
	 */
	addClassTimetable() {
		const newClassTimetable = new ClassTimetableModel();
		newClassTimetable.clear(); // Set all defaults fields
		this.editClassTimetable(newClassTimetable);
	}

	/**
	 * Show Edit ClassTimetable dialog and save after success close result
	 * @param classTimetable: ClassTimetableModel
	 */
	editClassTimetable(classTimetable: ClassTimetableModel) {
		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const _saveMessage = classTimetable.id > 0 ? 'Edit  ClassTimetable' : 'Create  ClassTimetable';
    
		const _messageType = classTimetable.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ClassTimetableEditDialogComponent, { data: { classTimetable } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			// this.loadClassTimetablesList();
		});
	}

/**
 * Check all rows are selected
 */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.classTimetablesResult.length;
  return numSelected === numRows;
}

/**
 * Selects all rows if they are not all selected; otherwise clear selection
 */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
  } else {
    this.classTimetablesResult.forEach(row => this.selection.select(row));
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
