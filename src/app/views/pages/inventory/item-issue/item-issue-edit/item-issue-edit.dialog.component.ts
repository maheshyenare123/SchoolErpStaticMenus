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
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemIssueModel, selectItemIssuesActionLoading, ItemIssueUpdated, ItemIssueOnServerCreated, selectLastCreatedItemIssueId, AddItemModel, AddItemService, ItemCategoryModel, ItemCategoryService } from '../../../../../core/inventory';
import { Constants } from 'src/app/core/api_url';
import { RoleService } from 'src/app/core/human-resource';
import { RolesDtoModel } from 'src/app/core/Models/rolesDto.model';
// // Services and Models



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-item-issue-edit-dialog',
	templateUrl: './item-issue-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ItemIssueEditDialogComponent implements OnInit, OnDestroy {
	
	
	// Public properties
itemIssue: ItemIssueModel;
itemIssueForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
rolesList: RolesDtoModel[] = [];
itemCategoryList: ItemCategoryModel[] = [];
itemList:AddItemModel[] = [];
constructor(public dialogRef: MatDialogRef<ItemIssueEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService,
	private itemCategoryService:ItemCategoryService,
	private addItemService:AddItemService,
	private roleService:RoleService,
	) {
}

/**
 * On init
 */
ngOnInit() {
	this.store.pipe(select(selectItemIssuesActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	this.itemIssue = this.data.itemIssue;
	this.createForm();
	this.loadAllItemCategory();
	this.loadAllRoles();
}

/**
 * On destroy
 */
ngOnDestroy() {
	if (this.componentSubscriptions) {
		this.componentSubscriptions.unsubscribe();
	}
}
loadAllItemCategory() {
	debugger
	this.itemCategoryService.getAllItemCategorys().subscribe(res => {
		const data = res['data'];
		this.itemCategoryList = data['content'];
		console.log(this.itemCategoryList)
	}, err => {
	});
}

onItemCategorySelectChange(itemCategoryId){
this.loadAllItemsByItemCategoryId(itemCategoryId)
this.itemCategoryList.map(item =>{
  if(item.id == itemCategoryId){
	this.itemIssueForm.get('itemCategory').setValue(item.itemCategory);
  }
})
}

loadAllItemsByItemCategoryId(id:number) {
debugger
this.addItemService.getAllItemsByItemCategoryId(id).subscribe(res => {

  this.itemList = res['data'];
  console.log(this.itemList)
}, err => {
});
}

onItemSelectChange(itemId){
this.itemList.map(item =>{
  if(item.id == itemId){
	this.itemIssueForm.get('itemName').setValue(item.name);
  }
})
}

loadAllRoles() {
	debugger
	this.roleService.getAllRoles().subscribe(res => {
	  const data = res['data'];
	  this.rolesList = data['content'];
	  console.log(this.rolesList)
	}, err => {
	});
  }
  onRoleSelectChange(roleId){
	var roleObj = this.rolesList.find(x => x.id === roleId);
	// this.staffInformationFormGroup.controls.roleName.setValue(roleObj.roleName);
  }

createForm() {
	this.itemIssueForm = this.fb.group({

	    

		isActive: [this.itemIssue.isActive,],
		isReturned: [this.itemIssue.isReturned,],
		issueBy: [this.itemIssue.issueBy,],
		issueDate: [this.typesUtilsService.getDateFromString(this.itemIssue.issueDate), Validators.compose([Validators.nullValidator])],
		issueTo: [this.itemIssue.issueTo,],
		issueType: [this.itemIssue.issueType,],
		itemCategory: [this.itemIssue.itemCategory, Validators.required],
		itemCategoryId: [this.itemIssue.itemCategoryId, Validators.required],
		itemId: [this.itemIssue.itemId, Validators.required],
		itemName: [this.itemIssue.itemName,Validators.required ],
		note: [this.itemIssue.note,],
		quantity: [this.itemIssue.quantity,Validators.required],
		returnDate: [this.typesUtilsService.getDateFromString(this.itemIssue.returnDate), Validators.compose([Validators.nullValidator])],
	});
}

/**
 * Returns page title
 */
getTitle(): string {
	if (this.itemIssue.id > 0) {
		return `Edit Item Issue '${this.itemIssue.issueTo}'`;
	}

	return 'New Item Issue';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.itemIssueForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared itemIssue
 */
prepareitemIssue(): ItemIssueModel {
	const controls = this.itemIssueForm.controls;
	const _itemIssue = new ItemIssueModel();
	_itemIssue.id = this.itemIssue.id;
        // id: number;
// isActive: string;
// isReturned: number;
// issueBy: string;
// issueDate: string;
// issueTo: string;
// issueType: string;
// itemCategory: string;
// itemCategoryId: number;
// itemId: number;
// itemName: string;
// note: string;
// quantity: number;
// returnDate: string;

		if(_itemIssue.id>0){
			_itemIssue.isActive = controls.isActive.value;
		}else{
			_itemIssue.isActive = 'yes';
		}
		_itemIssue.isReturned = controls.isReturned.value;
		_itemIssue.issueBy = controls.issueBy.value;
		const _issueDate = controls.issueDate.value;
		if (_issueDate) {
			_itemIssue.issueDate = this.typesUtilsService.dateFormat(_issueDate);
		} else {
			_itemIssue.issueDate = '';
		}
		_itemIssue.issueTo = controls.issueTo.value;
		_itemIssue.issueType = controls.issueType.value;
		_itemIssue.itemName = controls.itemName.value;
		_itemIssue.itemId = controls.itemId.value;
		_itemIssue.itemCategory = controls.itemCategory.value;
		_itemIssue.itemCategoryId = controls.itemCategoryId.value;
		_itemIssue.note = controls.note.value;
		_itemIssue.quantity = controls.quantity.value;
		const _returnDate = controls.returnDate.value;
		if (_returnDate) {
			_itemIssue.returnDate = this.typesUtilsService.dateFormat(_returnDate);
		} else {
			_itemIssue.returnDate = '';
		}

	

	return _itemIssue;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.itemIssueForm.controls;
	/** check form */
	if (this.itemIssueForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editeditemIssue = this.prepareitemIssue();
	if (editeditemIssue.id > 0) {
		this.updateItemIssue(editeditemIssue);
	} else {
		this.createItemIssue(editeditemIssue);
	}
}

/**
 * Update itemIssue
 *
 * @param _itemIssue: ItemIssueModel
 */
updateItemIssue(_itemIssue: ItemIssueModel) {
	const updateitemIssue: Update<ItemIssueModel> = {
		id: _itemIssue.id,
		changes: _itemIssue
	};
	this.store.dispatch(new ItemIssueUpdated({
		partialItemIssue: updateitemIssue,
		itemIssue: _itemIssue
	}));

	// integrate itemIssue  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _itemIssue, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _itemIssue, isEdit: true }
}

/**
 * Create itemIssue
 *
 * @param _itemIssue: ItemIssueModel
 */
createItemIssue(_itemIssue: ItemIssueModel) {
	this.store.dispatch(new ItemIssueOnServerCreated({ itemIssue: _itemIssue }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedItemIssueId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _itemIssue, isEdit: false });
	});

	// integrate itemIssue  create api
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

