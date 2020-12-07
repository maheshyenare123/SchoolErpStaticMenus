import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExamGroupsDataSource, ExamGroupModel,selectExamGroupsActionLoading, } from 'src/app/core/examination';
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
import { ExamGroupsPageRequested, OneExamGroupDeleted, ManyExamGroupsDeleted, ExamGroupsStatusUpdated, ExamGroupUpdated, ExamGroupOnServerCreated, selectLastCreatedExamGroupId } from '../../../../core/examination';


@Component({
  selector: 'kt-exam-group',
  templateUrl: './exam-group.component.html',
  styleUrls: ['./exam-group.component.scss']
})
export class ExamGroupComponent implements OnInit {

  // Table fields
dataSource: ExamGroupsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'name','examType', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ExamGroupModel>(true, []);
examGroupsResult: ExamGroupModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
examGroup: ExamGroupModel;
examGroupForm: FormGroup;
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
		private router: Router,
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
			tap(() => this.loadExamGroupList())
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
				this.loadExamGroupList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ExamGroupsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.examGroupsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadExamGroupList();
		}); // Remove this line, just loading imitation

		this.addExamGroup();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	
	/**
	 * Load ExamGroups List from service through data-source
	 */
	loadExamGroupList() {
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
		this.store.dispatch(new ExamGroupsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.ExamGroup = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete ExamGroup
	 *
	 * @param _item: ExamGroupModel
	 */
	deleteExamGroup(_item: ExamGroupModel) {

		const _title = 'ExamGroup';
		const _description = 'Are you sure to permanently delete selected ExamGroup?';
		const _waitDesciption = 'ExamGroup is deleting...';
		const _deleteMessage = ' Selected ExamGroup has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneExamGroupDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadExamGroupList();
		});
		

	}

	/**
	 * Show add ExamGroup dialog
	 */
	addExamGroup() {
		this.examGroup=new ExamGroupModel();
		this.examGroup.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit ExamGroup dialog and save after success close result
	 * @param examGroup: ExamGroupModel
	 */
	editExamGroup(examGroup: ExamGroupModel) {
		
		this.examGroup=examGroup;
		this.createForm();

	}

	addExam(examGroup: ExamGroupModel) {
		this.examGroup=examGroup;
		this.router.navigate(["/examination/exam/"+examGroup.id])
	}

createForm() {
	debugger;
	this.examGroupForm = this.fb.group({
    examType: [this.examGroup.examType, Validators.required],
    description: [this.examGroup.description, ],
    isActive: [this.examGroup.isActive, ],
		name: [this.examGroup.name, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.examGroupForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared examGroup
 */
prepareExamGroup(): ExamGroupModel {
	const controls = this.examGroupForm.controls;
	const _examGroup = new ExamGroupModel();
  _examGroup.id = this.examGroup.id;
  _examGroup.examType = controls.examType.value;
  _examGroup.description = controls.description.value;
  _examGroup.isActive='yes';
  _examGroup.name = controls.name.value;
	return _examGroup;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.examGroupForm.controls;
	/** check form */
	if (this.examGroupForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedExamGroup = this.prepareExamGroup();
	if (editedExamGroup.id > 0) {
		this.updateExamGroup(editedExamGroup);
	} else {
		this.createExamGroup(editedExamGroup);
	}

	const	_saveMessage= editedExamGroup.id > 0 ? 'ExamGroup  has been updated' : 'ExamGroup has been created';
		
	const _messageType = editedExamGroup.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadExamGroupList();
		this.examGroupForm.reset();
		this.addExamGroup();
		// this.examGroup.clear();
		// this.createForm();

}
onCancel(){
	this.examGroupForm.reset();
	this.addExamGroup();
	// this.examGroup.clear();
	// this.createForm();
}
/**
 * Update ExamGroup
 *
 * @param _examGroup: ExamGroupModel
 */
updateExamGroup(_examGroup: ExamGroupModel) {
	const updateExamGroup: Update<ExamGroupModel> = {
		id: _examGroup.id,
		changes: _examGroup
	};
	this.store.dispatch(new ExamGroupUpdated({
		partialExamGroup: updateExamGroup,
		examGroup: _examGroup
	}));


}

/**
 * Create ExamGroup
 *
 * @param _examGroup: ExamGroupModel
 */
createExamGroup(_examGroup:ExamGroupModel) {
	this.store.dispatch(new ExamGroupOnServerCreated({ examGroup: _examGroup }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedExamGroupId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _examGroup, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
