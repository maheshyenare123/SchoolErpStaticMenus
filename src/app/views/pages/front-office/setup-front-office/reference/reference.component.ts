
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ReferencesDataSource, ReferenceModel,selectReferencesActionLoading } from 'src/app/core/front-office';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
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
import { ReferencesPageRequested, OneReferenceDeleted, ManyReferencesDeleted, ReferencesStatusUpdated, ReferenceUpdated, ReferenceOnServerCreated, selectLastCreatedReferenceId } from '../../../../../core/front-office';


@Component({
  selector: 'kt-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {

  // Table fields
dataSource: ReferencesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'reference', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<ReferenceModel>(true, []);
referencesResult: ReferenceModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
reference: ReferenceModel;
referenceForm: FormGroup;
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
			tap(() => this.loadReferenceList())
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
				this.loadReferenceList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new ReferencesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.referencesResult = res;
			if(this.referencesResult.length==0)this.dataSource.hasItems=false;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadReferenceList();
		}); // Remove this line, just loading imitation

this.addReference();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load References List from service through data-source
	 */
	loadReferenceList() {
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
		this.store.dispatch(new ReferencesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.reference = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Reference
	 *
	 * @param _item: ReferenceModel
	 */
	deleteReference(_item: ReferenceModel) {

		const _title = 'Reference';
		const _description = 'Are you sure to permanently delete selected reference?';
		const _waitDesciption = 'Reference is deleting...';
		const _deleteMessage = ' Selected reference has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneReferenceDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadReferenceList();
		});
		

	}

	/**
	 * Show add Reference dialog
	 */
	addReference() {
		this.reference=new ReferenceModel();
		this.reference.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Reference dialog and save after success close result
	 * @param reference: ReferenceModel
	 */
	editReference(reference: ReferenceModel) {
		
		this.reference=reference;
		this.createForm();

	}



createForm() {
	debugger;
	this.referenceForm = this.fb.group({
		reference: [this.reference.reference, Validators.required],
		description: [this.reference.description, ],
		isActive: [this.reference.isActive, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.referenceForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared reference
 */
prepareReference(): ReferenceModel {
	const controls = this.referenceForm.controls;
	const _reference = new ReferenceModel();
	_reference.id = this.reference.id;
	_reference.reference = controls.reference.value;
	_reference.description = controls.description.value;
			if(_reference.id>0){
	_reference.isActive = controls.isActive.value;
}else{
	_reference.isActive = 'yes';
}
	return _reference;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.referenceForm.controls;
	/** check form */
	if (this.referenceForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedReference = this.prepareReference();
	if (editedReference.id > 0) {
		this.updateReference(editedReference);
	} else {
		this.createReference(editedReference);
	}

	const	_saveMessage= editedReference.id > 0 ? 'Reference  has been updated' : 'Reference has been created';
		
	const _messageType = editedReference.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadReferenceList();
		this.referenceForm.reset();
		this.addReference();
		// this.reference.clear();
		// this.createForm();

}
onCancel(){
	this.referenceForm.reset();
	this.addReference();
	// this.reference.clear();
	// this.createForm();
}
/**
 * Update Reference
 *
 * @param _reference: ReferenceModel
 */
updateReference(_reference: ReferenceModel) {
	const updateReference: Update<ReferenceModel> = {
		id: _reference.id,
		changes: _reference
	};
	this.store.dispatch(new ReferenceUpdated({
		partialReference: updateReference,
		reference: _reference
	}));


}

/**
 * Create reference
 *
 * @param _reference: ReferenceModel
 */
createReference(_reference:ReferenceModel) {
	this.store.dispatch(new ReferenceOnServerCreated({ reference: _reference }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedReferenceId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _reference, isEdit: false });
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
