import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExamsDataSource, ExamModel, ExamsPageRequested, OneExamDeleted, ManyExamsDeleted, ExamGroupService } from 'src/app/core/examination';
import { QueryParamsModel, LayoutUtilsService, MessageType } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { ExamEditDialogComponent} from '../exam-edit/exam-edit.dialog.component';
import { ExamAssignStudentDialogComponent } from '../../exam-assign-student/exam-assign-student.dialog.component';
import { ExamSubjectDialogComponent } from '../../exam-subject-edit/exam-subject-edit.dialog.component';
import { ExamMarksDialogComponent } from '../../exam-marks/exam-marks.dialog.component';

@Component({
  selector: 'kt-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

 // Table fields
dataSource: ExamsDataSource;

displayedColumns = ['name', 'sessionName', 'subjectCount', 'status', 'isPublish', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterCondition = '';
lastQuery: QueryParamsModel;
// Selection
selection = new SelectionModel<ExamModel>(true, []);
examsResult: ExamModel[] = [];
private subscriptions: Subscription[] = [];
  examGroupDetail: any;
  examGroupId: any;


constructor(public dialog: MatDialog,
             private subheaderService: SubheaderService,
             private layoutUtilsService: LayoutUtilsService,
             private store: Store<AppState>,
             private router: Router,
            private route:ActivatedRoute,
            private examGroupService:ExamGroupService
             ) { }


/**
 * On init
 */
ngOnInit() {

  this.route.params.subscribe(params => {
    console.log(params); 
    this.examGroupId=params.id;
    this.loadExamGroupById(this.examGroupId)
    
  })


 // If the user changes the sort order, reset back to the first page.
 const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
 this.subscriptions.push(sortSubscription);

 /* Data load will be triggered in two cases:
 - when a pagination event occurs => this.paginator.page
 - when a sort event occurs => this.sort.sortChange
 **/
 const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
   tap(() => this.loadExamsList())
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
     this.loadExamsList();
   })
 )
 .subscribe();
 this.subscriptions.push(searchSubscription);

 // Init DataSource
 this.dataSource = new ExamsDataSource(this.store);
 const entitiesSubscription = this.dataSource.entitySubject.pipe(
   skip(1),
   distinctUntilChanged()
 ).subscribe(res => {
   this.examsResult = res;
   console.log(this.examsResult);
   if(this.examsResult.length==0)this.dataSource.hasItems=false;
 });
 this.subscriptions.push(entitiesSubscription);
 // First load
 of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
   this.loadExamsList();
 }); // Remove this line, just loading imitation

}

loadExamGroupById(examGroupId) {
  debugger
  
  this.examGroupService.getExamGroupById(examGroupId).subscribe(res => {
    const data = res['data'];
    this.examGroupDetail = data;
    console.log(this.examGroupDetail)
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
 * Load Products List
 */
loadExamsList() {
  this.selection.clear();
  const queryParams = new QueryParamsModel(
    this.filterConfiguration(),
    this.sort.direction,
    this.sort.active,
    this.paginator.pageIndex,
    this.paginator.pageSize
  );
  // Call request from server
  this.store.dispatch(new ExamsPageRequested({ page: queryParams, examGroupId: this.examGroupDetail.id }));
  // get api 
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
 * Delete  Exam
 *
 * @param _item: ExamModel
 */
deleteExam(_item: ExamModel) {
  const _title = ' Exam Delete';
  const _description = 'Are you sure to permanently delete this Exam?';
  const _waitDesciption = ' Exam is deleting...';
  const _deleteMessage = ` Exam has been deleted`;

  const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
  dialogRef.afterClosed().subscribe(res => {
    if (!res) {
      return;
    }
//delete api call
    this.store.dispatch(new OneExamDeleted({ id: _item.id }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
  });
}

/**
 * Delete  Exams
 */
deleteProducts() {
  const _title = ' Exams Delete';
  const _description = 'Are you sure to permanently delete selected  Exams?';
  const _waitDesciption = ' Exams are deleting...';
  const _deleteMessage = 'Selected  Exams have been deleted';

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

    //many  Exam deleted
    this.store.dispatch(new ManyExamsDeleted({ ids: idsForDeletion }));
    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
    this.selection.clear();
  });
}

/**
 * Fetch selected  Exam
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
	addExam() {
		const newCustomer = new ExamModel();
		newCustomer.clear(); // Set all defaults fields
		this.editExam(newCustomer);
	}

	/**
	 * Show Edit customer dialog and save after success close result
	 * @param customer: CustomerModel
	 */
	editExam(exam: ExamModel) {
   let examGroupDetail = this.examGroupDetail

		let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
    const _saveMessage = exam.id > 0 ? 'Edit Exam' : 'Create Exam';
    
		const _messageType = exam.id > 0 ? MessageType.Update : MessageType.Create;
		const dialogRef = this.dialog.open(ExamEditDialogComponent, { data: { exam , examGroupDetail} });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
			this.loadExamsList();
		});
  }
  
  assignExamToStudent(exam: ExamModel) {
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
  //const _saveMessage = homework.id > 0 ? 'Edit  Homework' : 'Create  Homework';
  
    //const _messageType = homework.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ExamAssignStudentDialogComponent, { data: { exam } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
  
    //	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
      
     });
  }

  addSubject(exam: ExamModel) {
    let examGroupDetail = this.examGroupDetail;
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
  //const _saveMessage = homework.id > 0 ? 'Edit  Homework' : 'Create  Homework';
  
    //const _messageType = homework.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ExamSubjectDialogComponent, { data: { exam, examGroupDetail } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
  
    //	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
      
     });
  }


  examMarks(exam: ExamModel) {
    let examGroupDetail = this.examGroupDetail;
    let saveMessageTranslateParam = 'ECOMMERCE.CUSTOMERS.EDIT.';
  //const _saveMessage = homework.id > 0 ? 'Edit  Homework' : 'Create  Homework';
  
    //const _messageType = homework.id > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ExamMarksDialogComponent, { data: { exam, examGroupDetail } });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
  
    //	this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
      
     });
  }


/**
 * Check all rows are selected
 */
isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.examsResult.length;
  return numSelected === numRows;
}

/**
 * Selects all rows if they are not all selected; otherwise clear selection
 */
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
  } else {
    this.examsResult.forEach(row => this.selection.select(row));
  }
}

/* UI */
/**
 * Returns status string
 *
 * @param status: number
 */
getItemStatusString(status: number = 0): string {
  switch (status) {
    case 0:
      return 'Selling';
    case 1:
      return 'Sold';
  }
  return '';
}

/**
 * Returns CSS Class by status
 *
 * @param status: number
 */
getItemCssClassByStatus(status: number = 0): string {
  switch (status) {
    case 0:
      return 'success';
    case 1:
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
