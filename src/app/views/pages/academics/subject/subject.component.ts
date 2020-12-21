import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SubjectsDataSource, SubjectDtoModel,selectSubjectsActionLoading } from '../../../../core/academics';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from '../../../../core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from '../../../../core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SubjectsPageRequested, OneSubjectDeleted, ManySubjectsDeleted, SubjectsStatusUpdated, SubjectUpdated, SubjectOnServerCreated, selectLastCreatedSubjectId } from '../../../../core/academics';



@Component({
  selector: 'kt-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnInit {

  // Table fields
dataSource: SubjectsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'subject', 'subjectCode', 'subjectType', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<SubjectDtoModel>(true, []);
subjectsResult: SubjectDtoModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
subject: SubjectDtoModel;
subjectForm: FormGroup;
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
			tap(() => this.loadSubjectList())
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
				this.loadSubjectList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new SubjectsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.subjectsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadSubjectList();
		}); // Remove this line, just loading imitation

this.addSubject();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Subjects List from service through data-source
	 */
	loadSubjectList() {
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
		this.store.dispatch(new SubjectsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.class = searchText;
		if (!searchText) {
			return filter;
		}
    filter.subject = searchText;
    filter.subjectCode = searchText;
    filter.subjectType = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Subject
	 *
	 * @param _item: SubjectDtoModel
	 */
	deleteSubject(_item: SubjectDtoModel) {

		const _title = 'Section';
		const _description = 'Are you sure to permanently delete selected section?';
		const _waitDesciption = 'Section is deleting...';
		const _deleteMessage = ' Selected section has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneSubjectDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadSubjectList();
		});
		

	}

	/**
	 * Show add Subject dialog
	 */
	addSubject() {
		this.subject=new SubjectDtoModel();
		this.subject.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Subject dialog and save after success close result
	 * @param subject: SubjectDtoModel
	 */
	editSubject(subject: SubjectDtoModel) {
		
		this.subject=subject;
		this.createForm();

	}



createForm() {
	debugger;
	this.subjectForm = this.fb.group({
    subject: [this.subject.name, Validators.required],
    type: [this.subject.type, Validators.required],
    code: [this.subject.code, ],
    isActive: [this.subject.isActive, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.subjectForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared Subject
 */
prepareSubject(): SubjectDtoModel {
	const controls = this.subjectForm.controls;
	const _subject = new SubjectDtoModel();
	_subject.id = this.subject.id;
	if (_subject.id > 0) {
		_subject.isActive = this.subject.isActive;
	} else {
		_subject.isActive = 'yes';
	}
  _subject.name = controls.subject.value;
  _subject.type = controls.type.value;
  _subject.code = controls.code.value;

	return _subject;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.subjectForm.controls;
	/** check form */
	if (this.subjectForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedSubject = this.prepareSubject();
	if (editedSubject.id > 0) {
		this.updateSubject(editedSubject);
	} else {
		this.createSubject(editedSubject);
	}
	this.loadSubjectList();
	const	_saveMessage= editedSubject.id > 0 ? 'Section  has been updated' : 'Section has been created';
		
	const _messageType = editedSubject.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
		this.subjectForm.reset();

		this.addSubject();
		// this.subject.clear();
		// this.createForm();

}
onCancel(){
	this.subjectForm.reset();
	this.addSubject();
	// this.subject.clear();
	// this.createForm();
}
/**
 * Update Subject
 *
 * @param _subject: SubjectDtoModel
 */
updateSubject(_subject: SubjectDtoModel) {
	const updateSubject: Update<SubjectDtoModel> = {
		id: _subject.id,
		changes: _subject
	};
	this.store.dispatch(new SubjectUpdated({
		partialSubject: updateSubject,
		subject: _subject
	}));


}

/**
 * Create Subject
 *
 * @param _subject: SubjectDtoModel
 */
createSubject(_subject:SubjectDtoModel) {
	this.store.dispatch(new SubjectOnServerCreated({ subject: _subject }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedSubjectId),
		// delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _subject, isEdit: false });
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

