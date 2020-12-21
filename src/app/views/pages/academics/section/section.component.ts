
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SectionsDataSource, SectionDtoModel, selectSectionsActionLoading } from '../../../../core/academics';
import { QueryParamsModel, LayoutUtilsService, MessageType, TypesUtilsService } from '../../../../core/_base/crud';
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
import { SectionsPageRequested, OneSectionDeleted, ManySectionsDeleted, SectionsStatusUpdated, SectionUpdated, SectionOnServerCreated, selectLastCreatedSectionId } from '../../../../core/academics';



@Component({
	selector: 'kt-section',
	templateUrl: './section.component.html',
	styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {

	// Table fields
	dataSource: SectionsDataSource;
	//  dataSource = new MatTableDataSource(ELEMENT_DATA);
	displayedColumns = ['id', 'section', 'actions'];
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('sort1', { static: true }) sort: MatSort;
	// Filter fields
	@ViewChild('searchInput', { static: true }) searchInput: ElementRef;
	filterStatus = '';
	filterType = '';
	// Selection
	selection = new SelectionModel<SectionDtoModel>(true, []);
	sectionsResult: SectionDtoModel[] = [];
	// Subscriptions
	private subscriptions: Subscription[] = [];

	// Public properties
	section: SectionDtoModel;
	sectionForm: FormGroup;
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
			tap(() => this.loadSectionList())
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
				this.loadSectionList();
			})
		)
			.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new SectionsDataSource(this.store);

		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
			console.log(res);
			this.sectionsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadSectionList();
		}); // Remove this line, just loading imitation

		this.addSection();

	}
	/**
		 * On Destroy
		 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Sections List from service through data-source
	 */
	loadSectionList() {
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
		this.store.dispatch(new SectionsPageRequested({ page: queryParams }));
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
		filter.section = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Section
	 *
	 * @param _item: SectionDtoModel
	 */
	deleteSection(_item: SectionDtoModel) {

		const _title = 'Section';
		const _description = 'Are you sure to permanently delete selected section?';
		const _waitDesciption = 'Section is deleting...';
		const _deleteMessage = ' Selected section has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneSectionDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadSectionList();
		});


	}

	/**
	 * Show add Section dialog
	 */
	addSection() {
		this.section = new SectionDtoModel();
		this.section.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Section dialog and save after success close result
	 * @param section: SectionDtoModel
	 */
	editSection(section: SectionDtoModel) {

		this.section = section;
		this.createForm();

	}



	createForm() {
		debugger;
		this.sectionForm = this.fb.group({
			section: [this.section.section, Validators.required],


		});
	}


	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.sectionForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/** ACTIONS */

	/**
	 * Returns prepared Section
	 */
	prepareSection(): SectionDtoModel {
		const controls = this.sectionForm.controls;
		const _section = new SectionDtoModel();
		_section.id = this.section.id;
		if (_section.id > 0) {
			_section.isActive = this.section.isActive;
		} else {
			_section.isActive = 'yes';
		}

		_section.section = controls.section.value;

		return _section;
	}

	/**
	 * On Submit
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.sectionForm.controls;
		/** check form */
		if (this.sectionForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		const editedSection = this.prepareSection();
		if (editedSection.id > 0) {
			this.updateSection(editedSection);
		} else {
			this.createSection(editedSection);
		}
		this.loadSectionList();
		const _saveMessage = editedSection.id > 0 ? 'Section  has been updated' : 'Section has been created';

		const _messageType = editedSection.id > 0 ? MessageType.Update : MessageType.Create;

		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);

		this.sectionForm.reset();

		this.addSection();
		// this.section.clear();
		// this.createForm();

	}
	onCancel() {
		this.sectionForm.reset();
		this.addSection();
		// this.section.clear();
		// this.createForm();
	}
	/**
	 * Update Section
	 *
	 * @param _section: SectionDtoModel
	 */
	updateSection(_section: SectionDtoModel) {
		const updateSection: Update<SectionDtoModel> = {
			id: _section.id,
			changes: _section
		};
		this.store.dispatch(new SectionUpdated({
			partialSection: updateSection,
			section: _section
		}));


	}

	/**
	 * Create Section
	 *
	 * @param _section: SectionDtoModel
	 */
	createSection(_section: SectionDtoModel) {
		this.store.dispatch(new SectionOnServerCreated({ section: _section }));
		this.componentSubscriptions = this.store.pipe(
			select(selectLastCreatedSectionId),
			// delay(1000), // Remove this line
		).subscribe(res => {
			if (!res) {
				return;
			}

			// this.dialogRef.close({ _section, isEdit: false });
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

