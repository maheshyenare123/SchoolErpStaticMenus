
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SourcesDataSource, SourceModel,selectSourcesActionLoading } from 'src/app/core/front-office';
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
import { SourcesPageRequested, OneSourceDeleted, ManySourcesDeleted, SourcesStatusUpdated, SourceUpdated, SourceOnServerCreated, selectLastCreatedSourceId } from '../../../../../core/front-office';


@Component({
  selector: 'kt-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {

 // Table fields
dataSource: SourcesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'source', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<SourceModel>(true, []);
sourcesResult: SourceModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
source: SourceModel;
sourceForm: FormGroup;
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
			tap(() => this.loadSourceList())
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
				this.loadSourceList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new SourcesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.sourcesResult = res;
			if(this.sourcesResult.length==0)this.dataSource.hasItems=false;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadSourceList();
		}); // Remove this line, just loading imitation

this.addSource();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load sources List from service through data-source
	 */
	loadSourceList() {
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
		this.store.dispatch(new SourcesPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.source = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete source
	 *
	 * @param _item: SourceModel
	 */
	deleteSource(_item: SourceModel) {

		const _title = 'Source';
		const _description = 'Are you sure to permanently delete selected source?';
		const _waitDesciption = 'Source is deleting...';
		const _deleteMessage = ' Selected source has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneSourceDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadSourceList();
		});
		

	}

	/**
	 * Show add source dialog
	 */
	addSource() {
		this.source=new SourceModel();
		this.source.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit source dialog and save after success close result
	 * @param source: SourceModel
	 */
	editSource(source: SourceModel) {
		
		this.source=source;
		this.createForm();

	}



createForm() {
	debugger;
	this.sourceForm = this.fb.group({
		source: [this.source.source, Validators.required],
		description: [this.source.description, ],
		isActive: [this.source.isActive, ],
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.sourceForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared source
 */
prepareSource(): SourceModel {
	const controls = this.sourceForm.controls;
	const _source = new SourceModel();
	_source.id = this.source.id;
	_source.source = controls.source.value;
	_source.description = controls.description.value;
		if(_source.id>0){
	_source.isActive = controls.isActive.value;
}else{
	_source.isActive = 'yes';
}
	return _source;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.sourceForm.controls;
	/** check form */
	if (this.sourceForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedSource = this.prepareSource();
	if (editedSource.id > 0) {
		this.updateSource(editedSource);
	} else {
		this.createSource(editedSource);
	}

	const	_saveMessage= editedSource.id > 0 ? 'Source  has been updated' : 'Source has been created';
		
	const _messageType = editedSource.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadSourceList();
		this.sourceForm.reset();
		this.addSource();
		// this.source.clear();
		// this.createForm();

}
onCancel(){
	this.sourceForm.reset();
	this.addSource();
	// this.source.clear();
	// this.createForm();
}
/**
 * Update Source
 *
 * @param _source: SourceModel
 */
updateSource(_source: SourceModel) {
	const updateSource: Update<SourceModel> = {
		id: _source.id,
		changes: _source
	};
	this.store.dispatch(new SourceUpdated({
		partialSource: updateSource,
		source: _source
	}));


}

/**
 * Create source
 *
 * @param _source: SourceModel
 */
createSource(_source:SourceModel) {
	this.store.dispatch(new SourceOnServerCreated({ source: _source }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedSourceId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _source, isEdit: false });
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