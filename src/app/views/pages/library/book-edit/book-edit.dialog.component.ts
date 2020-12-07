// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookModel, selectBooksActionLoading, BookUpdated, BookOnServerCreated, selectLastCreatedBookId, BookService } from '../../../../core/library';
// // Services and Models
// import { DeliveryPersonModel, DeliveryPersonUpdated, DeliveryPersonOnServerCreated, selectLastCreatedDeliveryPersonId, selectDeliveryPersonsActionLoading } from '../../../../../core/master-entry';
// import { EmployeeModel } from '../../../../../core/payroll/_models/employee.model';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-book-edit-dialog',
	templateUrl: './book-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class BookEditDialogComponent implements OnInit, OnDestroy {

	// Public properties
	book: BookModel;
	bookForm: FormGroup;
	hasFormErrors = false;
	viewLoading = false;
	// Private properties
	private componentSubscriptions: Subscription;

	classList = []
	constructor(public dialogRef: MatDialogRef<BookEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private store: Store<AppState>,
		private typesUtilsService: TypesUtilsService,
		private bookService: BookService
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {


		this.store.pipe(select(selectBooksActionLoading)).subscribe(res => this.viewLoading = res);

		this.book = this.data.book;
		this.createForm();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	createForm() {
		this.bookForm = this.fb.group({
			bookTitle: [this.book.bookTitle, Validators.required],
			bookNo: [this.book.bookNo, ''],
			isbnNo: [this.book.isbnNo, ''],
			publish: [this.book.publish, ''],
			author: [this.book.author, ''],
			subject: [this.book.subject, ''],
			rackNo: [this.book.rackNo, ''],
			qty: [this.book.qty, 0],
			perunitcost: [this.book.perunitcost, 0],
			postdate: [this.typesUtilsService.getDateFromString(this.book.postdate), Validators.compose([Validators.nullValidator])],
			description: [this.book.description, ''],
			avaliable: [this.book.avaliable, 0],
		});
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.book.id > 0) {
			return `Edit Book '${this.book.bookTitle}'`;
		}

		return 'New Book';
	}

	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.bookForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared book
	 */
	preparebook(): BookModel {
		const controls = this.bookForm.controls;
		const _book = new BookModel();
		_book.id = this.book.id;
		
		if (_book.id > 0) {
			_book.isActive = this.book.isActive;
		} else {
			_book.isActive = 'yes';
		}

		_book.bookTitle = controls.bookTitle.value;
		_book.bookNo = controls.bookNo.value;
		_book.isbnNo = controls.isbnNo.value;
		_book.publish = controls.publish.value;
		_book.author = controls.author.value;
		_book.subject = controls.subject.value;
		_book.rackNo = controls.rackNo.value;
		_book.qty = controls.qty.value;
		_book.perunitcost = controls.perunitcost.value;
		const _postdate = controls.postdate.value;
		if (_postdate) {
			_book.postdate = this.typesUtilsService.dateFormat(_postdate);
		} else {
			_book.postdate = '';
		}
		_book.description = controls.description.value;
		_book.avaliable = controls.avaliable.value;

		return _book;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.bookForm.controls;
		/** check form */
		if (this.bookForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedbook = this.preparebook();
		if (editedbook.id > 0) {
			this.updateBook(editedbook);
		} else {
			this.createBook(editedbook);
		}



	}

	/**
	 * Update book
	 *
	 * @param _book: BookModel
	 */
	updateBook(_book: BookModel) {
		const updateBook: Update<BookModel> = {
			id: _book.id,
			changes: _book
		};
		this.store.dispatch(new BookUpdated({
			partialBook: updateBook,
			book: _book
		}));



		// Remove this line
		of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _book, isEdit: true }));
		// Uncomment this line
		// this.dialogRef.close({ _book, isEdit: true }
	}

	/**
	 * Create book
	 *
	 * @param _book: BookModel
	 */
	createBook(_book: BookModel) {
		this.store.dispatch(new BookOnServerCreated({ book: _book }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedBookId),
			delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			this.dialogRef.close({ _book, isEdit: false });
		});


	}

	/** Alect Close event */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	_keyPress(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);
		if (!pattern.test(inputChar)) {
			event.preventDefault();

		}
	}
}

