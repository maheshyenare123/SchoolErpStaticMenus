// Angular
import { Component, OnInit, Inject, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// RxJS
import { Subscription, of, Observable, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
// NGRX
import { Update } from '@ngrx/entity';
import { Store, select } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
// CRUD
import { TypesUtilsService } from '../../../../../core/_base/crud';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StaffModel, selectStaffsActionLoading, StaffUpdated, StaffOnServerCreated, selectLastCreatedStaffId, RoleService, DepartmentService, StaffDesignationService, DepartmentModel, LeaveTypeService, LeaveTypeModel, StaffService, selectStaffById, } from '../../../../../core/human-resource';
import { RolesDtoModel } from '../../../../../core/Models/rolesDto.model';
import { StaffDesignationModel } from '../../../../../core/Models/staffDesignation.model';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'kt-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AddStaffComponent implements OnInit {

  // Public properties
  loadingSubject = new BehaviorSubject<boolean>(true);
	loading$: Observable<boolean>;




  staff: StaffModel;
  hasFormErrors = false;
  viewLoading = false;
  // Private properties
  private componentSubscriptions: Subscription;

  isLinear = false;
  staffInformationFormGroup: FormGroup;
  addMoreDetailFormGroup: FormGroup;
  uploadDocumentFormGroup: FormGroup;

  
  filesStaff: File[] = [];

  filesResume: File[] = [];
  filesJoinLetter: File[] = [];
  filesOther: File[] = [];
  filesTitle3: File[] = [];

  rolesList: RolesDtoModel[] = [];
designationList:StaffDesignationModel[] = [];
departmentList:DepartmentModel[]=[];
leaveTypeList:LeaveTypeModel[]=[];
  constructor(
    //public dialogRef: MatDialogRef<StaffsEditDialogComponent>,
    //  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>,
    private typesUtilsService: TypesUtilsService,
    private roleService:RoleService,
    private designationService:StaffDesignationService,
    private departmentService:DepartmentService,
    private leaveTypeService:LeaveTypeService,
    private staffService: StaffService

  ) {
  }

  /**
   * On init
   */
  ngOnInit() {
    debugger

    this.loadAllRoles();
    this.loadAllDesignation();
    this.loadAllDepartment();
    this.loadAllLeaveType();


    // this.loading$ = this.loadingSubject.asObservable();
		// this.loadingSubject.next(true);
		// this.activatedRoute.params.subscribe(params => {
		// 	const id = params.id;
		// 	if (id && id > 0) {

		// 		this.store.pipe(
		// 			select(selectStaffById(id))
		// 		).subscribe(result => {
		// 			if (!result) {
		// 				this.loadStaffFromService(id);
		// 				return;
		// 			}

		// 			this.loadStaff(result);
		// 		});
		// 	} else {
		// 		const newStaff = new StaffModel();
		// 		newStaff.clear();
		// 		this.loadStaff(newStaff);
		// 	}
		// });








    this.store.pipe(select(selectStaffsActionLoading)).subscribe(res => this.viewLoading = res);
    //this.staff = this.data.staff;
    const newStaff = new StaffModel();
		newStaff.clear(); // Set all defaults fields
		newStaff
    this.staff = newStaff
    this.createForm();
  }

//get All  List
loadAllRoles() {
  debugger
  this.roleService.getAllRoles().subscribe(res => {
    const data = res['data'];
    this.rolesList = data['content'];
    console.log(this.rolesList)
  }, err => {
  });
}
loadAllDesignation() {
  debugger
  this.designationService.getAllStaffDesignations().subscribe(res => {
    const data = res['data'];
    this.designationList = data['content'];
    console.log(this.designationList)
  }, err => {
  });
}

loadAllDepartment() {
  debugger
  this.departmentService.getAllDepartments().subscribe(res => {
    const data = res['data'];
    this.departmentList = data['content'];
    console.log(this.departmentList)
  }, err => {
  });
}
loadAllLeaveType() {
  debugger
  this.leaveTypeService.getAllLeaveTypes().subscribe(res => {
    const data = res['data'];
    this.leaveTypeList = data['content'];
    console.log(this.leaveTypeList)
  }, err => {
  });
}

onRoleSelectChange(roleId){
  var roleObj = this.rolesList.find(x => x.id === roleId);
  this.staffInformationFormGroup.controls.roleName.setValue(roleObj.roleName);
}
onDesignationSelectChange(designationId){
  var designationObj = this.designationList.find(x => x.id === designationId);
  this.staffInformationFormGroup.controls.classes.setValue(designationObj.designation);
}
onDepartmentSelectChange(departmentId){
  var departmentObj = this.departmentList.find(x => x.id === departmentId);
  this.staffInformationFormGroup.controls.classes.setValue(departmentObj.departmentName);
}


  /**
   * On destroy
   */
  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }
	// If product didn't find in store
	loadStaffFromService(staffId) {
		this.staffService.getStaffById(staffId).subscribe(res => {
			this.loadStaff(res, true);
		});
	}
  loadStaff(_staff, fromService: boolean = false) {
		if (!_staff) {
			// this.goBack('');
		}
		this.staff = _staff;
		// this.productId$ = of(_staff.id);
		// this.oldstaff = Object.assign({}, _staff);
		// this.initProduct();
		if (fromService) {
			this.cdr.detectChanges();
		}
  }
  // initProduct() {
	// 	this.createForm();
	// 	this.loadingSubject.next(false);
	// 	if (!this.product.id) {
	// 		this.subheaderService.setBreadcrumbs([
	// 			{ title: 'eCommerce', page: `/ecommerce` },
	// 			{ title: 'Products', page: `/ecommerce/products` },
	// 			{ title: 'Create product', page: `/ecommerce/products/add` }
	// 		]);
	// 		return;
	// 	}
	// 	this.subheaderService.setTitle('Edit product');
	// 	this.subheaderService.setBreadcrumbs([
	// 		{ title: 'eCommerce', page: `/ecommerce` },
	// 		{ title: 'Products', page: `/ecommerce/products` },
	// 		{ title: 'Edit product', page: `/ecommerce/products/edit`, queryParams: { id: this.product.id } }
	// 	]);
	// }
  // goBack(id) {
	// 	this.loadingSubject.next(false);
	// 	const url = `/ecommerce/products?id=${id}`;
	// 	this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	// }

	// goBackWithoutId() {
	// 	this.router.navigateByUrl('/ecommerce/products', { relativeTo: this.activatedRoute });
	// }




  createForm() {
    this.staffInformationFormGroup = this.fb.group({
      userId: [this.staff.userId, Validators.required],
      roleId: [this.staff.roleId, Validators.required],
      roleName: [this.staff.roleName, Validators.required],
      staffDesignationId: [this.staff.staffDesignationId,],
      staffDesignation: [this.staff.staffDesignation,],
      departmentId: [this.staff.departmentId,],
      departmentName: [this.staff.departmentName,],
      name: [this.staff.name,Validators.required],
      surname: [this.staff.surname,Validators.required],
      fatherName: [this.staff.fatherName,],
      motherName: [this.staff.motherName,],
      email: [this.staff.email, Validators.compose([Validators.required, Validators.email])],
      gender: [this.staff.gender, Validators.required],
      dob: [this.typesUtilsService.getDateFromString(this.staff.dob), Validators.compose([Validators.nullValidator])],
      dateOfJoining: [this.typesUtilsService.getDateFromString(this.staff.dateOfJoining), Validators.compose([Validators.nullValidator])],
      dateOfLeaving: [this.typesUtilsService.getDateFromString(this.staff.dateOfLeaving), Validators.compose([Validators.nullValidator])],
      contactNo: [this.staff.contactNo, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      emergencyContactNo: [this.staff.emergencyContactNo, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      maritalStatus: [this.staff.maritalStatus,''],
      image: [this.staff.image, ''],
      localAddress: [this.staff.localAddress,''],
      permanentAddress: [this.staff.permanentAddress, ''], 
      qualification: [this.staff.qualification, ''],
      workExp: [this.staff.workExp, ''],
      note: [this.staff.note, ''],
    });


    this.addMoreDetailFormGroup = this.fb.group({
      epfNo: [this.staff.epfNo, ''],
      basicSalary: [this.staff.basicSalary, ''],
      contractType: [this.staff.contractType, ''],
      shift: [this.staff.shift, ''],
      location: [this.staff.location, ''],

      // leaveType: this.fb.array([
      //   this.createItemRow()
			//   ]),
      
      numberOfLeaves: [this.staff.numberOfLeaves, ],


      accountTitle: [this.staff.accountTitle, ''],
      bankAccountNo: [this.staff.bankAccountNo, ''],
      bankName: [this.staff.bankName, ''],
      ifscCode: [this.staff.ifscCode, ''],
      bankBranch: [this.staff.bankBranch, ''],


      facebook: [this.staff.facebook, ''],
      twitter: [this.staff.twitter, ''],
      linkedin: [this.staff.linkedin, ''],
      instagram: [this.staff.instagram, ''],
    });

  
  }
	// createItemRow() {
	// 	return this.fb.group({
  //     numberOfLeaves: [this.staff.numberOfLeaves, ],
	// 	});
  //   }
    




  /**
   * Returns page title
   */
  getTitle(): string {
    if (this.staff.id > 0) {
      return `Edit Staff Detail '${this.staff.name}' '${this.staff.surname}'`;
    }

    return 'New Staff Detail';
  }

  /**
   * Check control is invalid
   * @param controlName: string
   */
  isControlInvalid(controlName: string): boolean {
    const control = this.staffInformationFormGroup.controls[controlName];
    const control1 = this.addMoreDetailFormGroup.controls[controlName];
  
    const result = control.invalid && control.touched;
    const result1 = control1.invalid && control1.touched;
    return result && result1;
  }

  /** ACTIONS */

  /**
   * Returns prepared staff
   */
  preparestaff(): StaffModel {

     const controls1 = this.staffInformationFormGroup.controls;
     const controls2 = this.addMoreDetailFormGroup.controls;

    const _staff = new StaffModel();
    _staff.id = this.staff.id;

    _staff.userId = controls1.userId.value;
    _staff.roleId = controls1.roleId.value;
    _staff.roleName = controls1.roleName.value;
    _staff.staffDesignationId = controls1.staffDesignationId.value;
    _staff.staffDesignation = controls1.staffDesignation.value;
    _staff.departmentId = controls1.departmentId.value;
    _staff.departmentName = controls1.departmentName.value;
    _staff.name = controls1.name.value;
    _staff.surname = controls1.surname.value;
    _staff.fatherName = controls1.fatherName.value;
    _staff.motherName = controls1.motherName.value;
    _staff.email = controls1.email.value;
    _staff.gender = controls1.gender.value;
    
    const _dob = controls1.dob.value;
    if (_dob) {
      _staff.dob = this.typesUtilsService.dateFormat(_dob);
    } else {
      _staff.dob = '';
    }
    const _dateOfJoining  = controls1.dateOfJoining.value;
    if (_dateOfJoining) {
      _staff.dateOfJoining = this.typesUtilsService.dateFormat(_dateOfJoining);
    } else {
      _staff.dateOfJoining = '';
    }
    const _dateOfLeaving = controls1.dateOfLeaving.value;
    if (_dateOfLeaving) {
      _staff.dateOfLeaving = this.typesUtilsService.dateFormat(_dateOfLeaving);
    } else {
      _staff.dateOfLeaving = '';
    }
    _staff.contactNo = controls1.contactNo.value;
    _staff.emergencyContactNo = controls1.emergencyContactNo.value;
    _staff.maritalStatus = controls1.maritalStatus.value;
    _staff.image = controls1.image.value;
    _staff.localAddress = controls1.localAddress.value;
    _staff.permanentAddress = controls1.permanentAddress.value;
    _staff.qualification = controls1.qualification.value;
    _staff.workExp = controls1.workExp.value;
    _staff.note = controls1.note.value;
   
    //
    _staff.epfNo = controls2.epfNo.value;
    _staff.basicSalary = controls2.basicSalary.value;
    _staff.contractType = controls2.contractType.value;
    _staff.shift = controls2.shift.value;
    _staff.location = controls2.location.value;
    _staff.numberOfLeaves = controls2.numberOfLeaves.value;

    _staff.accountTitle = controls2.accountTitle.value;
    _staff.bankAccountNo = controls2.bankAccountNo.value;
    _staff.bankName = controls2.bankName.value;
    _staff.ifscCode = controls2.ifscCode.value;
    _staff.bankBranch = controls2.bankBranch.value;

    _staff.facebook = controls2.facebook.value;
    _staff.twitter = controls2.twitter.value;
    _staff.linkedin = controls2.linkedin.value;
    _staff.instagram = controls2.instagram.value;

    _staff.isActive='yes'
    return _staff;
  }

  /**
   * On Submit
   */
  onSubmit() {
    debugger
    this.hasFormErrors = false;
    const controls1 = this.staffInformationFormGroup.controls;
    const controls2 = this.addMoreDetailFormGroup.controls;

    /** check form */

    if (this.staffInformationFormGroup.invalid) {
      Object.keys(controls1).forEach(controlName =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    if (this.addMoreDetailFormGroup.invalid) {
      Object.keys(controls2).forEach(controlName =>
        controls2[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }


    const editedstaff = this.preparestaff();
    if (editedstaff.id > 0) {
      this.updateStaff(editedstaff);
    } else {
      this.createStaff(editedstaff);
    }




  }

  /**
   * Update staff
   *
   * @param _staff: StaffModel
   */
  updateStaff(_staff: StaffModel) {
    const updateStaff: Update<StaffModel> = {
      id: _staff.id,
      changes: _staff
    };
    this.store.dispatch(new StaffUpdated({
      partialStaff: updateStaff,
      staff: _staff
    }));



    // Remove this line
    //of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _staff, isEdit: true }));
    // Uncomment this line
    // this.dialogRef.close({ _staff, isEdit: true }
  }

  /**
   * Create staff
   *
   * @param _staff: StaffModel
   */
  createStaff(_staff: StaffModel) {
    this.store.dispatch(new StaffOnServerCreated({ staff: _staff }));
    this.componentSubscriptions = this.store.pipe(
      select(selectLastCreatedStaffId),
      delay(1000), // Remove this line
    ).subscribe(res => {
      if (!res) {
        return;
      }

      // this.dialogRef.close({ _staff, isEdit: false });
    });

this.router.navigateByUrl('/human-resource/staff-directory', { relativeTo: this.activatedRoute });
  }

  onCancel() {
    this.staffInformationFormGroup.reset();
    this.addMoreDetailFormGroup.reset();

    this.staff.clear();
    this.createForm();
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

  onSelectStaff(event) {
    console.log(event);
    this.filesStaff.push(...event.addedFiles);
  }

  onRemoveStaff(event) {
    console.log(event);
    this.filesStaff.splice(this.filesStaff.indexOf(event), 1);
  }

  onSelectResume(event) {
    console.log(event);
    this.filesResume.push(...event.addedFiles);
  }

  onRemoveResume(event) {
    console.log(event);
    this.filesResume.splice(this.filesResume.indexOf(event), 1);
  }

  onSelectJoinLetter(event) {
    console.log(event);
    this.filesJoinLetter.push(...event.addedFiles);
  }

  onRemoveJoinLetter(event) {
    console.log(event);
    this.filesJoinLetter.splice(this.filesJoinLetter.indexOf(event), 1);
  }

  onSelectOther(event) {
    console.log(event);
    this.filesOther.push(...event.addedFiles);
  }

  onRemoveOther(event) {
    console.log(event);
    this.filesOther.splice(this.filesOther.indexOf(event), 1);
  }

}



