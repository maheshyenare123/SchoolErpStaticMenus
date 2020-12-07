// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormArray} from '@angular/forms';
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
import { StaffModel, StaffPayslipModel, selectStaffPayslipsActionLoading, StaffPayslipUpdated, selectLastCreatedStaffPayslipId, StaffPayslipOnServerCreated } from '../../../../../core/human-resource';



@Component({
	// tslint:disable-next-line:component-selector
	selector: 'kt-generate-payroll-edit-dialog',
	templateUrl: './generate-payroll-edit.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class GeneratePayrollEditDialogComponent implements OnInit, OnDestroy {
	
	
// Public properties
staff: StaffModel;
staffPayslip: StaffPayslipModel;
searchFormData :any;
staffPayslipForm: FormGroup;
earningForm: FormGroup;
deductionForm: FormGroup;
hasFormErrors = false;
viewLoading = false;
// Private properties
private componentSubscriptions: Subscription;
files: File[] = [];
earningItemAmount
deductionItemAmount
earningTotalAmount
deductionTotalAmount
type
constructor(public dialogRef: MatDialogRef<GeneratePayrollEditDialogComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	private fb: FormBuilder,
	private store: Store<AppState>,
	private typesUtilsService: TypesUtilsService) {
}

/**
 * On init
 */
ngOnInit() {
	this.store.pipe(select(selectStaffPayslipsActionLoading)).subscribe(res => this.viewLoading = res);
	// loadding
	debugger
	//staff details show purpose and from staff.id call api for attendance for staff for showing
	this.staff = this.data.staff;
	 
	this.searchFormData = this.data.searchForm.value

	// for save payment 
	const newStaffPayslip = new StaffPayslipModel();
	newStaffPayslip.clear(); // Set all defaults fields
	this.staffPayslip = newStaffPayslip;

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
	this.earningForm = this.fb.group({
		itemsearning: this.fb.array([
			this.createItemRowEarning()
		  ]),
	});

	this.deductionForm = this.fb.group({
		itemsdeduction: this.fb.array([
			this.createItemRowDeduction()
		  ]),
	});

	this.staffPayslipForm = this.fb.group({	
	
		basic: [this.staffPayslip.basic,0],
		leaveDeduction: [this.staffPayslip.leaveDeduction, 0],
		month: [this.staffPayslip.month, this.searchFormData.month],
		netSalary: [this.staffPayslip.netSalary, 0],
		grossSalary: [this.staffPayslip.grossSalary, 0],//new Variable
		paymentDate: [this.typesUtilsService.getDateFromString(this.staffPayslip.paymentDate), Validators.compose([Validators.nullValidator])],
		paymentMode: [this.staffPayslip.paymentMode,''],
		remark: [this.staffPayslip.remark,''],
		staffId: [this.staffPayslip.staffId,''],//this.staff.userId
		status: [this.staffPayslip.status, ''],
		tax: [this.staffPayslip.tax, ''],
		totalAllowance: [this.staffPayslip.totalAllowance, 0],
		totalDeduction: [this.staffPayslip.totalDeduction,0],
		year: [this.staffPayslip.year,this.searchFormData.year],
		
	});
}

createItemRowEarning() {
	return this.fb.group({
	
		type: [this.type, ],
		earningItemAmount: [this.earningItemAmount, 0 ],
		// earningTotalAmount: [this.earningTotalAmount, 0 ],
	});
  }

  createItemRowDeduction() {
	return this.fb.group({
	
		type: [this.type, ],
		deductionItemAmount: [this.deductionItemAmount, 0 ],
		// deductionTotalAmount: [this.deductionTotalAmount, 0 ],
	});
  }


  addItemRowEarning() {
	let itemArray = this.earningForm.get('itemsearning') as FormArray;
	itemArray.push(this.createItemRowEarning());
  }

  removeItemRowEarning(index) {
	let itemArray = this.earningForm.get('itemsearning') as FormArray;
	let earningItemAmount = itemArray.controls[index].get('earningItemAmount').value;

    if (earningItemAmount) {
      this.staffPayslipForm.get('totalDeduction').setValue
        (
        this.staffPayslipForm.get('totalDeduction').value - earningItemAmount
        );
    }
	itemArray.removeAt(index);
  }



  
  addItemRowDeduction() {
	let itemArray = this.deductionForm.get('itemsdeduction') as FormArray;
	itemArray.push(this.createItemRowDeduction());
  }

  removeItemRowDeduction(index) {
	let itemArray = this.deductionForm.get('itemsdeduction') as FormArray;
	let deductionItemAmount = itemArray.controls[index].get('deductionItemAmount').value;

    if (deductionItemAmount) {
      this.staffPayslipForm.get('totalAllowance').setValue
        (
        this.staffPayslipForm.get('totalAllowance').value - deductionItemAmount
        );
    }
	itemArray.removeAt(index);
  }


  itemsOnChangeEarning(event, i) {
    debugger
    if(event.target.value == "0"){
	  alert("Please Enter Amount greater than 0!");
	  return false;
    }
    if (event.key == "e" || event.key == "E"
      || event.keyCode == 46) {
      return false;
    }

	let itemArray = this.earningForm.get('itemsearning') as FormArray;

    let earningItemAmount = itemArray.controls[i].get('earningItemAmount').value;
	let totalamount: number = 0;
    itemArray.controls.forEach((item) => {
      totalamount += item.get('earningItemAmount').value;
    });

    // if (totalamount) {
	  this.staffPayslipForm.get('totalAllowance').setValue(totalamount);
	  console.log("amount"+this.staffPayslipForm)
  }

  itemsOnChangeDeduction(event, i) {
    debugger
    if(event.target.value == "0"){
	  alert("Please Enter Amount greater than 0!");
	  return false;
    }
    if (event.key == "e" || event.key == "E"
      || event.keyCode == 46) {
      return false;
    }
	let itemArray = this.deductionForm.get('itemsdeduction') as FormArray;
	let deductionItemAmount = itemArray.controls[i].get('deductionItemAmount').value;
	let totalamount: number = 0;
    itemArray.controls.forEach((item) => {
      totalamount += item.get('deductionItemAmount').value;
    });

    // if (totalamount) {
	  this.staffPayslipForm.get('totalDeduction').setValue(totalamount);
	  console.log("amount"+this.staffPayslipForm)
  }
  Calculator(){

	this.staffPayslipForm.get('grossSalary').setValue(
		this.staffPayslipForm.get('basic').value + this.staffPayslipForm.get('totalAllowance').value - 
		this.staffPayslipForm.get('totalDeduction').value - this.staffPayslipForm.get('tax').value
	);
	this.staffPayslipForm.get('netSalary').setValue(
		this.staffPayslipForm.get('basic').value + this.staffPayslipForm.get('totalAllowance').value - 
		this.staffPayslipForm.get('totalDeduction').value - this.staffPayslipForm.get('tax').value
	);

	
  }
/**
 * Returns page title
 */
getTitle(): string {
	if (this.staffPayslip.id > 0) {
		return `Generate PaySlip'${this.staffPayslip.id}'`;
	}

	return 'Generate PaySlip';
}

/**
 * Check control is invalid
 * @param controlName: string
 */
isControlInvalid(controlName: string): boolean {
	const control = this.staffPayslipForm.controls[controlName];
	const result = control.invalid && control.touched;
	return result;
}

/** ACTIONS */

/**
 * Returns prepared staffPayslip
 */
preparestaffPayslip(): StaffPayslipModel {
	const controls = this.staffPayslipForm.controls;
	const _staffPayslip = new StaffPayslipModel();
	_staffPayslip.id = this.staffPayslip.id;
		
		_staffPayslip.basic = controls.basic.value;
		_staffPayslip.leaveDeduction = controls.leaveDeduction.value;
		_staffPayslip.month = controls.month.value;
		_staffPayslip.netSalary = controls.netSalary.value;
		_staffPayslip.grossSalary = controls.grossSalary.value;
		_staffPayslip.status = controls.status.value;
		const _paymentDate = controls.paymentDate.value;
		if (_paymentDate) {
			_staffPayslip.paymentDate = this.typesUtilsService.dateFormat(_paymentDate);
		} else {
			_staffPayslip.paymentDate = '';
		}
		_staffPayslip.paymentMode = controls.paymentMode.value;
		_staffPayslip.remark = controls.remark.value;
		_staffPayslip.staffId = controls.staffId.value;
		_staffPayslip.tax = controls.tax.value;
		_staffPayslip.totalAllowance = controls.totalAllowance.value;
		_staffPayslip.totalDeduction = controls.totalDeduction.value;
		_staffPayslip.year = controls.year.value;
		
	 return _staffPayslip;
}

/**
 * On Submit
 */
onSubmit() {
	this.hasFormErrors = false;
	const controls = this.staffPayslipForm.controls;
	/** check form */
	if (this.staffPayslipForm.invalid) {
		Object.keys(controls).forEach(controlName =>
			controls[controlName].markAsTouched()
		);

		this.hasFormErrors = true;
		return;
	}

	const editedStaffPayslip = this.preparestaffPayslip();
	if (editedStaffPayslip.id > 0) {
		this.updateStaffPayslip(editedStaffPayslip);
	} else {
		this.createStaffPayslip(editedStaffPayslip);
	}
}

/**
 * Update StaffPayslip
 *
 * @param _staffPayslip: StaffPayslipModel
 */
updateStaffPayslip(_staffPayslip: StaffPayslipModel) {
	const updateStaffPayslip: Update<StaffPayslipModel> = {
		id: _staffPayslip.id,
		changes: _staffPayslip
	};
	this.store.dispatch(new StaffPayslipUpdated({
		partialStaffPayslip: updateStaffPayslip,
		staffPayslip: _staffPayslip
	}));

	// integrate StaffPayslip  update api

	// Remove this line
	of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _staffPayslip, isEdit: true }));
	// Uncomment this line
	// this.dialogRef.close({ _staffPayslip, isEdit: true }
}

/**
 * Create StaffPayslip
 *
 * @param _staffPayslip: StaffPayslipModel
 */
createStaffPayslip(_staffPayslip: StaffPayslipModel) {
	this.store.dispatch(new StaffPayslipOnServerCreated({ staffPayslip: _staffPayslip }));
	this.componentSubscriptions = this.store.pipe(
		select(selectLastCreatedStaffPayslipId),
		delay(1000), // Remove this line
	).subscribe(res => {
		if (!res) {
			return;
		}

		this.dialogRef.close({ _staffPayslip, isEdit: false });
	});

	// integrate StaffPayslip  create api
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

