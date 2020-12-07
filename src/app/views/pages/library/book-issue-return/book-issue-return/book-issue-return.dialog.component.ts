
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BookIssueReturnsDataSource, BookIssueReturnModel, selectBookIssueReturnsActionLoading, BookService, BookModel } from 'src/app/core/library';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { BookIssueReturnsPageRequested, OneBookIssueReturnDeleted, ManyBookIssueReturnsDeleted, BookIssueReturnsStatusUpdated, BookIssueReturnUpdated, BookIssueReturnOnServerCreated, selectLastCreatedBookIssueReturnId } from '../../../../../core/library';




@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-book-issue-return-dialog',
	templateUrl: './book-issue-return.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookIssueReturnDialogComponent implements OnInit {

	// Table fields
	dataSource: BookIssueReturnsDataSource;
	//  dataSource = new MatTableDataSource(ELEMENT_DATA);
	displayedColumns = ['bookTitle', 'bookNumber', 'issueDate', 'dueReturnDate', 'returnDate', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	// Selection
	selection = new SelectionModel<BookIssueReturnModel>(true, []);
	bookIssueReturnsResult: BookIssueReturnModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	// Public properties
	bookIssueReturn: BookIssueReturnModel;
	bookIssueReturnForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;
	libraryMember: BookIssueReturnModel;
	showReturnDate: boolean = false;


	bookList: BookModel[] = [];

	constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		public dialogRef: MatDialogRef<BookIssueReturnDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public bookService: BookService) { }

	ngOnInit() {

		debugger;
		this.loadAllBookList();
		const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadBookIssueReturnList(this.libraryMember.memberId))
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
				this.loadBookIssueReturnList(this.libraryMember.memberId);
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new BookIssueReturnsDataSource(this.store);

		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
			console.log(res);
			this.bookIssueReturnsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadBookIssueReturnList(this.libraryMember.memberId);
		}); // Remove this line, just loading imitation

		this.libraryMember = this.data.librarymember;
		console.log(this.libraryMember);
		this.addBookIssueReturn();


		// this.createForm();

	}
	loadAllBookList() {
		debugger
		this.bookService.getAllBooks().subscribe(res => {
			const data = res['data'];
			this.bookList = data['content'];
			console.log(this.bookList)
		}, err => {
		});
	}
	onBookSelectChange(bookId) {

		var bookObj = this.bookList.find(x => x.id === bookId);

		this.bookIssueReturnForm.controls.bookNo.setValue(bookObj.bookNo);

		this.bookIssueReturnForm.controls.bookTitle.setValue(bookObj.bookTitle);
	}



	/**
		 * On Destroy
		 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load BookIssueReturns List from service through data-source
	 */
	loadBookIssueReturnList(id) {
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
		this.store.dispatch(new BookIssueReturnsPageRequested({ page: queryParams, id: id }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.visitorsPurpose = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete BookIssueReturn
	 *
	 * @param _item: BookIssueReturnModel
	 */
	deleteBookIssueReturn(_item: BookIssueReturnModel) {

		const _title = 'Purpose';
		const _description = 'Are you sure to permanently delete selected purpose?';
		const _waitDesciption = 'Purpose is deleting...';
		const _deleteMessage = ' Selected purpose has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneBookIssueReturnDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadBookIssueReturnList(this.libraryMember.memberId);
		});


	}

	/**
	 * Show add BookIssueReturn dialog
	 */
	addBookIssueReturn() {
		this.bookIssueReturn = new BookIssueReturnModel();
		this.bookIssueReturn.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit bookIssueReturn dialog and save after success close result
	 * @param bookIssueReturn: BookIssueReturnModel
	 */
	editBookIssueReturn(bookIssueReturn: BookIssueReturnModel) {
		this.showReturnDate = true;
		this.bookIssueReturn = bookIssueReturn;
		console.log(this.bookIssueReturn);
		this.createForm();

	}



	createForm() {
		debugger;
		this.bookIssueReturnForm = this.fb.group({
			bookId: [this.bookIssueReturn.bookId, Validators.required],
			duereturnDate: [this.typesUtilsService.getDateFromString(this.bookIssueReturn.duereturnDate), Validators.compose([Validators.nullValidator])],
			memberId: [this.libraryMember.memberId, Validators.required],
			// issueDate: [this.typesUtilsService.getDateFromString(this.bookIssueReturn.issueDate), Validators.compose([Validators.nullValidator])],
			returnDate: [this.typesUtilsService.getDateFromString(this.bookIssueReturn.returnDate), Validators.compose([Validators.nullValidator])],
			bookNo: [this.bookIssueReturn.bookNo, Validators.required],
			bookTitle: [this.bookIssueReturn.bookTitle, Validators.required],


		});
	}


	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.bookIssueReturnForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared bookIssueReturn
	 */
	prepareBookIssueReturn(): BookIssueReturnModel {
		const controls = this.bookIssueReturnForm.controls;
		const _bookIssueReturn = new BookIssueReturnModel();
		// _bookIssueReturn.id = this.bookIssueReturn.id;
		_bookIssueReturn.bookId = controls.bookId.value;
		_bookIssueReturn.memberId = controls.memberId.value;
		const _duereturnDate = controls.duereturnDate.value;
		if (_duereturnDate) {
			_bookIssueReturn.duereturnDate = this.typesUtilsService.dateFormat(_duereturnDate);
		} else {
			_bookIssueReturn.duereturnDate = '';
		}

		// const _issueDate = controls.issueDate.value;

		const issueDate = new Date();
		_bookIssueReturn.issueDate = this.typesUtilsService.dateFormat(issueDate);
		if (this.bookIssueReturn.id > 0) {
			_bookIssueReturn.isActive = this.bookIssueReturn.isActive;
			_bookIssueReturn.isReturned = this.bookIssueReturn.isReturned;
			const _returnDate = controls.returnDate.value;
			if (_returnDate) {
				_bookIssueReturn.returnDate = this.typesUtilsService.dateFormat(_returnDate);
			} else {
				_bookIssueReturn.returnDate = '';
			}
		}

		_bookIssueReturn.bookNo = controls.bookNo.value;
		_bookIssueReturn.bookTitle = controls.bookTitle.value;

		_bookIssueReturn.isActive = 'yes';
		_bookIssueReturn.isReturned = 0;






		return _bookIssueReturn;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.bookIssueReturnForm.controls;
		/** check form */
		if (this.bookIssueReturnForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		console.log(this.bookIssueReturn)
		const editedBookIssueReturn = this.prepareBookIssueReturn();
		if (this.bookIssueReturn.id > 0) {
			this.updateBookIssueReturn(editedBookIssueReturn);
		} else {
			this.createBookIssueReturn(editedBookIssueReturn);
		}
		this.loadBookIssueReturnList(this.libraryMember.memberId);
		const _saveMessage = editedBookIssueReturn.id > 0 ? 'Issue Book has been returned' : 'Issue Book has been created';

		const _messageType = editedBookIssueReturn.id > 0 ? MessageType.Update : MessageType.Create;

		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

		this.bookIssueReturnForm.reset();

		this.addBookIssueReturn();
		// this.bookIssueReturn.clear();
		// this.createForm();
		this.showReturnDate = false;
	}
	onCancel() {
		this.bookIssueReturnForm.reset();
		this.addBookIssueReturn();
		// this.bookIssueReturn.clear();
		// this.createForm();
	}


	/**
	 * Create bookIssueReturn
	 *
	 * @param _bookIssueReturn: BookIssueReturnModel
	 */
	createBookIssueReturn(_bookIssueReturn: BookIssueReturnModel) {
		this.store.dispatch(new BookIssueReturnOnServerCreated({ bookIssueReturn: _bookIssueReturn }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedBookIssueReturnId),
			// delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}
			// this.dialogRef.close({ _bookIssueReturn, isEdit: false });
		});
	}
	/**
	 * Update bookIssueReturn
	 *
	 * @param _bookIssueReturn: BookIssueReturnModel
	 */
	updateBookIssueReturn(_bookIssueReturn: BookIssueReturnModel) {
		const updateBookIssueReturn: Update<BookIssueReturnModel> = {
			id: _bookIssueReturn.id,
			changes: _bookIssueReturn
		};
		this.store.dispatch(new BookIssueReturnUpdated({
			partialBookIssueReturn: updateBookIssueReturn,
			bookIssueReturn: _bookIssueReturn
		}));

		this.showReturnDate = false;
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


