
import { Component, OnInit, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SubjectGroupsDataSource, SubjectGroupDtoModel,selectSubjectGroupsActionLoading, SubjectModel, SectionModel, StudentClassModel, SectionDtoModel, StudentClassService, SectionService, SubjectService, SubjectDtoModel } from '../../../../core/academics';
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
import { SubjectGroupsPageRequested, OneSubjectGroupDeleted, ManySubjectGroupsDeleted, SubjectGroupsStatusUpdated, SubjectGroupUpdated, SubjectGroupOnServerCreated, selectLastCreatedSubjectGroupId } from '../../../../core/academics';


@Component({
  selector: 'kt-subject-group',
  templateUrl: './subject-group.component.html',
  styleUrls: ['./subject-group.component.scss']
})
export class SubjectGroupComponent implements OnInit {

   // Table fields
dataSource: SubjectGroupsDataSource;
//  dataSource = new MatTableDataSource(ELEMENT_DATA);
displayedColumns = ['id', 'name', 'classSection', 'subject', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild('sort1', {static: true}) sort: MatSort;
// Filter fields
@ViewChild('searchInput', {static: true}) searchInput: ElementRef;
filterStatus = '';
filterType = '';
// Selection
selection = new SelectionModel<SubjectGroupDtoModel>(true, []);
subjectGroupsResult: SubjectGroupDtoModel[] = [];
// Subscriptions
private subscriptions: Subscription[] = [];

// Public properties
subjectGroup: SubjectGroupDtoModel;
subjectGroupForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;



classList: StudentClassModel[] = [];
	sectionList: SectionDtoModel[] = [];
	subjectList: SubjectDtoModel[] = [];
	subjectCheckBoxList: SubjectCheckBox[] = [];
	sectionCheckBoxList: SectionCheckBox[] = [];

  constructor(public dialog: MatDialog,
		public snackBar: MatSnackBar,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private typesUtilsService: TypesUtilsService,
		private studentClassService: StudentClassService,
		private sectionService: SectionService,
		private subjectService: SubjectService) { }

  ngOnInit() {

	debugger;
	this.loadAllSubject();
	this.loadAllClasses();
	// this.loadAllSections();
    const sortSubscription = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
		this.subscriptions.push(sortSubscription);

		/* Data load will be triggered in two cases:
		- when a pagination event occurs => this.paginator.page
		- when a sort event occurs => this.sort.sortChange
		**/
		const paginatorSubscriptions = merge(this.sort.sortChange, this.paginator.page).pipe(
			tap(() => this.loadSubjectGroupList())
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
				this.loadSubjectGroupList();
			})
		)
		.subscribe();
		this.subscriptions.push(searchSubscription);

		// Init DataSource
		this.dataSource = new SubjectGroupsDataSource(this.store);
	
		const entitiesSubscription = this.dataSource.entitySubject.pipe(
			skip(1),
			distinctUntilChanged()
		).subscribe(res => {
			debugger
	console.log(res);
			this.subjectGroupsResult = res;
		});
		this.subscriptions.push(entitiesSubscription);
		// First load
		of(undefined).pipe(take(1), delay(1000)).subscribe(() => { // Remove this line, just loading imitation
			this.loadSubjectGroupList();
		}); // Remove this line, just loading imitation

this.addSubjectGroup();
		
  }

	//get All Class List
	loadAllClasses() {
		debugger
		this.studentClassService.getAllStudentClasss().subscribe(res => {
			const data = res['data'];
			this.classList = data['content'];
			console.log(this.classList)
		}, err => {
		});
	}
	loadAllSectionsByClassId(id:number) {
		debugger
		this.studentClassService.getAllSectionByClasssId(id).subscribe(res => {
		
			this.sectionList = res['data'];
			console.log(this.sectionList)
			this.setSectionDataInChecboxList();
		}, err => {
		});
	}

	loadAllSubject() {
		debugger
		this.subjectService.getAllSubjects().subscribe(res => {
			const data = res['data'];
			this.subjectList = data['content'];
			console.log(this.subjectList)
			this.setSubjectDataInChecboxList();
		
		}, err => {
		});
	}
setSubjectDataInChecboxList(){
	this.subjectList.forEach(element => {
	
		this.subjectCheckBoxList.push({ 'data':	new SubjectModel(element.id,element.name,element.id), 'isChecked': false })
	})
}


setSectionDataInChecboxList(){
	this.sectionCheckBoxList=[];
	this.sectionList.forEach(element => {
		this.sectionCheckBoxList.push({ 'data':new SectionModel(element.id,element.section,element.id), 'isChecked': false })
	})
	//by default check section checkbox
if(this.subjectGroup.id>0){
	this.sectionCheckBoxList.forEach(element => {
		this.subjectGroup.sections.forEach(innerElement => {
			if (element.data.id == innerElement.id) {
				element.isChecked = true;
			}
		})
	})
}
}



/**
	 * On Destroy
	 */
	ngOnDestroy() {
		this.subscriptions.forEach(el => el.unsubscribe());
	}

	/**
	 * Load SubjectGroups List from service through data-source
	 */
	loadSubjectGroupList() {
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
		this.store.dispatch(new SubjectGroupsPageRequested({ page: queryParams }));
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
    filter.name = searchText;
    filter.classSection = searchText;
    filter.subject = searchText;
  
		return filter;
	}

	/** ACTIONS */
	/**
	 * Delete SubjectGroup
	 *
	 * @param _item: SubjectGroupDtoModel
	 */
	deleteSubjectGroup(_item: SubjectGroupDtoModel) {

		const _title = 'Subject Group';
		const _description = 'Are you sure to permanently delete selected Subject Group?';
		const _waitDesciption = 'Subject Group is deleting...';
		const _deleteMessage = ' Selected Subject Group has been deleted';



		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.store.dispatch(new OneSubjectGroupDeleted({ id: _item.id }));
			this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
			this.loadSubjectGroupList();
		});
		

	}

	/**
	 * Show add SubjectGroup dialog
	 */
	addSubjectGroup() {
		this.subjectGroup=new SubjectGroupDtoModel();
		this.subjectGroup.clear(); //
		this.createForm();

	}

	/**
	 * Show Edit SubjectGroup dialog and save after success close result
	 * @param subjectGroup: SubjectGroupDtoModel
	 */
	editSubjectGroup(subjectGroup: SubjectGroupDtoModel) {
	
		this.subjectGroup=subjectGroup;
		this.loadAllSectionsByClassId(this.subjectGroup.classId);
		this.createForm();
	
//by default check subject checkbox
		this.subjectCheckBoxList.forEach(element => {
			this.subjectGroup.subjects.forEach(innerElement => {
				if (element.data.id == innerElement.id) {
					element.isChecked = true;
				}
			})


		})

	}



createForm() {
	debugger;
	this.subjectGroupForm = this.fb.group({
		name: [this.subjectGroup.name, Validators.required],
    classId: [this.subjectGroup.classId, Validators.required],
    className: [this.subjectGroup.className, ],
		description: [this.subjectGroup.description, ],
    // sections: [this.subjectGroup.sections, Validators.required],
		// subjects: [this.subjectGroup.subjects, Validators.required],
	});
}

onSubjectCheckBoxChanges(_isChecked: boolean, id: number) {
	// get current position of the changes element by ID
	const index = this.subjectCheckBoxList.findIndex(_ => _.data.id === id);
	// if (!(index > -1)) return;

	// const isChecked = this.checkBoxes[index].isChecked;
	if (_isChecked) {
		this.subjectCheckBoxList[index].isChecked = _isChecked;
	}else{
		this.subjectCheckBoxList[index].isChecked = _isChecked;
	}
}
onSectionCheckBoxChanges(_isChecked: boolean, id: number) {
	// get current position of the changes element by ID
	const index = this.sectionCheckBoxList.findIndex(_ => _.data.id === id);
	// if (!(index > -1)) return;
	if (_isChecked) {
		this.sectionCheckBoxList[index].isChecked = _isChecked;
	}else{
		this.sectionCheckBoxList[index].isChecked = _isChecked;
	}



}
onClassSelectChange(classId){
	this.loadAllSectionsByClassId(classId);
	var classObj=this.classList.find(x => x.id === classId);
	this.subjectGroupForm.controls.className.setValue(classObj.classses);

}
/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.subjectGroupForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared SubjectGroup
 */
prepareSubjectGroup(): SubjectGroupDtoModel {
	const controls = this.subjectGroupForm.controls;
	const _subjectGroup = new SubjectGroupDtoModel();
	_subjectGroup.id = this.subjectGroup.id;
	// if (_subjectGroup.id > 0) {
	// 	_subjectGroup.isActive = this.subjectGroup.isActive;
	// } else {
	// 	_subjectGroup.isActive = 'yes';
	// }

	_subjectGroup.name = controls.name.value;
  _subjectGroup.classId = controls.classId.value;
  _subjectGroup.className = controls.className.value;
  _subjectGroup.description = controls.description.value;
//   _subjectGroup.sections = controls.sections.value;
//   _subjectGroup.subjects = controls.subjects.value;

const sectionData: SectionModel[] = [];
		this.sectionCheckBoxList.forEach(element => {
			if (element.isChecked) {
				sectionData.push(element.data);
			}
		})
		_subjectGroup.sections =sectionData;

const subjectData: SubjectModel[] = [];
		this.subjectCheckBoxList.forEach(element => {
			if (element.isChecked) {
				subjectData.push(element.data);
			}
		})
		_subjectGroup.subjects =subjectData;
	return _subjectGroup;
}

/**
 * On Submit
 */
onSubmit() {
	debugger
	this.hasFormErrors = false;
	const controls = this.subjectGroupForm.controls;
	/** check form */
	if (this.subjectGroupForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedSubjectGroup = this.prepareSubjectGroup();
	console.log(editedSubjectGroup);
	if (editedSubjectGroup.id > 0) {
		this.updateSubjectGroup(editedSubjectGroup);
	} else {
		this.createSubjectGroup(editedSubjectGroup);
	}
	this.loadSubjectGroupList();
	const	_saveMessage= editedSubjectGroup.id > 0 ? 'Subject Group  has been updated' : 'Subject Group has been created';
		
	const _messageType = editedSubjectGroup.id > 0 ? MessageType.Update : MessageType.Create;
	
		this.layoutUtilsService.showActionNotification(_saveMessage, _messageType);
		
		this.subjectGroupForm.reset();

		this.addSubjectGroup();
		// this.subjectGroup.clear();
		// this.createForm();
		this.subjectCheckBoxList = [];
		this.setSubjectDataInChecboxList();
		this.sectionCheckBoxList=[];
		// this.setSectionDataInChecboxList();

}
onCancel(){
	this.subjectGroupForm.reset();
	this.addSubjectGroup();
	// this.subjectGroup.clear();
	// this.createForm();
	this.subjectCheckBoxList = [];
		this.setSubjectDataInChecboxList();
		this.sectionCheckBoxList=[];
}
/**
 * Update SubjectGroup
 *
 * @param _subjectGroup: SubjectGroupDtoModel
 */
updateSubjectGroup(_subjectGroup: SubjectGroupDtoModel) {
	const updateSubjectGroup: Update<SubjectGroupDtoModel> = {
		id: _subjectGroup.id,
		changes: _subjectGroup
	};
	this.store.dispatch(new SubjectGroupUpdated({
		partialSubjectGroup: updateSubjectGroup,
		subjectGroup: _subjectGroup
	}));


}

/**
 * Create SubjectGroup
 *
 * @param _subjectGroup: SubjectGroupDtoModel
 */
createSubjectGroup(_subjectGroup:SubjectGroupDtoModel) {
	this.store.dispatch(new SubjectGroupOnServerCreated({ subjectGroup: _subjectGroup }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedSubjectGroupId),
		// delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		// this.dialogRef.close({ _subjectGroup, isEdit: false });
	});
}

/** Alect Close event */
onAlertClose($event) {
	this.hasFormErrors = false;
}

}
export class SubjectCheckBox {
  data:SubjectModel;
  isChecked:boolean;
}
export class SectionCheckBox {
	data:SectionModel;
	isChecked:boolean;
  }
