
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IncomeHeadsDataSource, IncomeHeadModel,selectIncomeHeadsActionLoading, IncomeService, IncomeModel } from 'src/app/core/income';
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
import { IncomeHeadsPageRequested, OneIncomeHeadDeleted, ManyIncomeHeadsDeleted, IncomeHeadsStatusUpdated, IncomeHeadUpdated, IncomeHeadOnServerCreated, selectLastCreatedIncomeHeadId } from '../../../../core/income';



@Component({
  selector: 'kt-income-head',
  templateUrl: './income-head.component.html',
  styleUrls: ['./income-head.component.scss']
})
export class IncomeHeadComponent implements OnInit {

  // Table fields
dataSource: IncomeHeadsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'incomeHead', 'description', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<IncomeHeadModel>(true, []);
incomeHeadsResult: IncomeHeadModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
incomeHead: IncomeHeadModel;
incomeHeadForm: FormGroup;
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
			tap(() => this.loadIncomeHeadList())
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
				this.loadIncomeHeadList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new IncomeHeadsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.incomeHeadsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadIncomeHeadList();
		}); // Remove this line, just loading imitation

		this.addIncomeHead();
		
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}
	
	/**
	 * Load IncomeHeads List from service through data-source
	 */
	loadIncomeHeadList() {
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
		this.store.dispatch(new IncomeHeadsPageRequested({ page: queryParams }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.IncomeHead = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete IncomeHead
	 *
	 * @param _item: IncomeHeadModel
	 */
	deleteIncomeHead(_item: IncomeHeadModel) {

		const _title = 'IncomeHead';
		const _description = 'Are you sure to permanently delete selected IncomeHead?';
		const _waitDesciption = 'IncomeHead is deleting...';
		const _deleteMessage = ' Selected IncomeHead has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneIncomeHeadDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadIncomeHeadList();
		});
		

	}

	/**
	 * Show add IncomeHead dialog
	 */
	addIncomeHead() {
		this.incomeHead=new IncomeHeadModel();
		this.incomeHead.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit IncomeHead dialog and save after success close result
	 * @param incomeHead: IncomeHeadModel
	 */
	editIncomeHead(incomeHead: IncomeHeadModel) {
		
		this.incomeHead=incomeHead;
		this.createForm();

	}



createForm() {
	debugger;
	this.incomeHeadForm = this.fb.group({
   
    incomeCategory: [this.incomeHead.incomeCategory, Validators.required],
    description: [this.incomeHead.description, ],
    isActive: [this.incomeHead.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.incomeHeadForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared incomeHead
 */
prepareIncomeHead(): IncomeHeadModel {
	const controls = this.incomeHeadForm.controls;
	const _incomeHead = new IncomeHeadModel();
	_incomeHead.id = this.incomeHead.id;
  _incomeHead.incomeCategory = controls.incomeCategory.value;
	_incomeHead.description = controls.description.value;
	if(_incomeHead.id>0){
		_incomeHead.isActive = controls.isActive.value;
	  }else{
		_incomeHead.isActive = 'yes';
	  }
	 
	
	return _incomeHead;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.incomeHeadForm.controls;
	/** check form */
	if (this.incomeHeadForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedIncomeHead = this.prepareIncomeHead();
	if (editedIncomeHead.id > 0) {
		this.updateIncomeHead(editedIncomeHead);
	} else {
		this.createIncomeHead(editedIncomeHead);
	}

	const	_saveMessage= editedIncomeHead.id > 0 ? 'IncomeHead  has been updated' : 'IncomeHead has been created';
		
	const _messageType = editedIncomeHead.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadIncomeHeadList();
		this.incomeHeadForm.reset();
		this.addIncomeHead();
		// this.incomeHead.clear();
		// this.createForm();

}
onCancel(){
	this.incomeHeadForm.reset();
	this.addIncomeHead();
	// this.incomeHead.clear();
	// this.createForm();
}
/**
 * Update IncomeHead
 *
 * @param _incomeHead: IncomeHeadModel
 */
updateIncomeHead(_incomeHead: IncomeHeadModel) {
	const updateIncomeHead: Update<IncomeHeadModel> = {
		id: _incomeHead.id,
		changes: _incomeHead
	};
	this.store.dispatch(new IncomeHeadUpdated({
		partialIncomeHead: updateIncomeHead,
		incomeHead: _incomeHead
	}));


}

/**
 * Create IncomeHead
 *
 * @param _incomeHead: IncomeHeadModel
 */
createIncomeHead(_incomeHead:IncomeHeadModel) {
	this.store.dispatch(new IncomeHeadOnServerCreated({ incomeHead: _incomeHead }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedIncomeHeadId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _incomeHead, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}


