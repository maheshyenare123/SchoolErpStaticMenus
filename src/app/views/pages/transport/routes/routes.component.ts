import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RoutesDataSource, RouteModel,selectRoutesActionLoading, RouteService } from 'src/app/core/transport';
import { QueryParamsModel, LayoutUtilsService, MessageType ,TypesUtilsService} from 'src/app/core/_base/crud';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription, merge, fromEvent, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { SubheaderService  } from 'src/app/core/_base/layout';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
import { tap, debounceTime, distinctUntilChanged, skip, delay, take } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';

import { TranslateService } from '@ngx-translate/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { RoutesPageRequested, OneRouteDeleted, ManyRoutesDeleted, RoutesStatusUpdated, RouteUpdated, RouteOnServerCreated, selectLastCreatedRouteId } from '../../../../core/transport';


@Component({
  selector: 'kt-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  // Table fields
dataSource: RoutesDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'title', 'fare', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<RouteModel>(true, []);
routesResult: RouteModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
route: RouteModel;
routeForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];

searchType:any

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
			tap(() => this.loadRouteList())
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
				this.loadRouteList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new RoutesDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.routesResult = res;
			console.log()
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadRouteList();
		}); // Remove this line, just loading imitation

this.addRoute();
  }
/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load Routes List from service through data-source
	 */
	loadRouteList() {
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
		this.store.dispatch(new RoutesPageRequested({ page: queryParams,searchTerm:this.searchType }));
		this.selection.clear();
	}

	/**
	 * Returns object for filter
	 */
	filterConfiguration(): any {
		const filter: any = {};
		const searchText: string = this.searchInput.nativeElement.value;

		filter.Route = searchText;
		if (!searchText) {
			return filter;
		}
		filter.description = searchText;
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete Route
	 *
	 * @param _item: RouteModel
	 */
	deleteRoute(_item: RouteModel) {

		const _title = 'Route';
		const _description = 'Are you sure to permanently delete selected Route?';
		const _waitDesciption = 'Route is deleting...';
		const _deleteMessage = ' Selected Route has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneRouteDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadRouteList();
		});
		

	}

	/**
	 * Show add Route dialog
	 */
	addRoute() {
		this.route=new RouteModel();
		this.route.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit Route dialog and save after success close result
	 * @param route: RouteModel
	 */
	editRoute(route: RouteModel) {
		
		this.route=route;
		this.createForm();

	}



createForm() {
	debugger;
	this.routeForm = this.fb.group({
    // fare: number;
    // id: number;
    // isActive: string;
    // noOfVehicle: number;
    // note: string;
    // routeTitle: string; 
    fare: [this.route.fare, Validators.required],
    noOfVehicle: [this.route.noOfVehicle, ],
    routeTitle: [this.route.routeTitle, Validators.required],
    note: [this.route.note, ],
    isActive: [this.route.isActive, ],
		
	});
}


/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.routeForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared route
 */
prepareRoute(): RouteModel {
	const controls = this.routeForm.controls;
	const _route = new RouteModel();
  _route.id = this.route.id;
   // fare: number;
    // id: number;
    // isActive: string;
    // noOfVehicle: number;
    // note: string;
    // routeTitle: string;

    _route.fare = controls.fare.value;
   
  _route.noOfVehicle = controls.noOfVehicle.value;
  if(_route.id>0){
	_route.isActive = controls.isActive.value;
}else{
	_route.isActive = 'yes';
}
	_route.routeTitle = controls.routeTitle.value;
  _route.note = controls.note.value;


	return _route;
}

/**
 * On Submit
 */
onSubmit() {
  debugger
	this.hasFormErrors = false;
	const controls = this.routeForm.controls;
	/** check form */
	if (this.routeForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedRoute = this.prepareRoute();
	if (editedRoute.id > 0) {
		this.updateRoute(editedRoute);
	} else {
		this.createRoute(editedRoute);
	}

	const	_saveMessage= editedRoute.id > 0 ? 'Route  has been updated' : 'Route has been created';
		
	const _messageType = editedRoute.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		this.loadRouteList();
		this.routeForm.reset();
		this.addRoute();
		// this.route.clear();
		// this.createForm();

}
onCancel(){
	this.routeForm.reset();
	this.addRoute();
	// this.route.clear();
	// this.createForm();
}
/**
 * Update Route
 *
 * @param _route: RouteModel
 */
updateRoute(_route: RouteModel) {
	const updateRoute: Update<RouteModel> = {
		id: _route.id,
		changes: _route
	};
	this.store.dispatch(new RouteUpdated({
		partialRoute: updateRoute,
		route: _route
	}));


}

/**
 * Create Route
 *
 * @param _route: RouteModel
 */
createRoute(_route:RouteModel) {
	this.store.dispatch(new RouteOnServerCreated({ route: _route }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedRouteId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _route, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}
onSelect(event) {
	console.log(event);
	this.files.push(...event.addedFiles);
  }
   
  onRemove(event) {
	console.log(event);
	this.files.splice(this.files.indexOf(event), 1);
  }
  _keyPress(event: any) {
	const pattern = /[0-9]/;
	let inputChar = String.fromCharCode(event.charCode);
	if (!pattern.test(inputChar)) {
		event.preventDefault();

	}
}
}




