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
import { StudentDtoModel, selectStudentsActionLoading, StudentUpdated, StudentOnServerCreated, selectLastCreatedStudentId, StudentService, CategoryService, CategoryDtoModel, SchoolHousModel, StudentHouseService, } from '../../../../../core/student-information';
import { StudentClassService, SectionService, StudentClassModel, SectionDtoModel } from 'src/app/core/academics';
import { Router, ActivatedRoute } from '@angular/router';
import { HostelModel, HostelService } from 'src/app/core/hostel';


@Component({
  selector: 'kt-student-details-edit',
  templateUrl: './student-details-edit.component.html',
  styleUrls: ['./student-details-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StudentDetailsEditComponent implements OnInit {

  // Public properties
  studentDetail: StudentDtoModel;
  studentDetailForm: FormGroup;
  hasFormErrors = false;
  viewLoading = false;
  // Private properties
  private componentSubscriptions: Subscription;

  isLinear = false;
  studentInformationFormGroup: FormGroup;
  parentGuardianFormGroup: FormGroup;

  addMoreDetailFormGroup: FormGroup;
  uploadDocumentFormGroup: FormGroup;

  
  filesStudent: File[] = [];
  filesFather: File[] = [];
  filesMother: File[] = [];
  filesGuardian: File[] = [];
  filesTitle: File[] = [];
  filesTitle1: File[] = [];
  filesTitle2: File[] = [];
  filesTitle3: File[] = [];

  classList: StudentClassModel[] = [];
  sectionList: SectionDtoModel[] = [];
  categoryList:CategoryDtoModel[]=[];
  studentHouseList:SchoolHousModel[]=[];
  studentId: any;
  hostelList: HostelModel[] = [];
  constructor(
    //public dialogRef: MatDialogRef<StudentDetailsEditDialogComponent>,
    //  @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private typesUtilsService: TypesUtilsService,
    private studentService: StudentService,
    private studentClassService: StudentClassService,
    private sectionService: SectionService,
    private categoryService:CategoryService,
    private studentHouseService:StudentHouseService,
    private router: Router,
    private route:ActivatedRoute,
    private hostelService:HostelService,
    ) {
  }

  /**
   * On init
   */
  ngOnInit() {
    debugger

    this.route.params.subscribe(params => {
      console.log(params); 
      this.studentId=params.id;
      this.loadStudentById(this.studentId)
      
    })




    this.store.pipe(select(selectStudentsActionLoading)).subscribe(res => this.viewLoading = res);
this.loadAllClasses();
this.loadAllStudentCategory();
this.loadAllStudentHouse()
this.loadAllHostel();
    //this.studentDetail = this.data.studentDetail;
    const newStudent = new StudentDtoModel();
		newStudent.clear(); // Set all defaults fields
		newStudent
    this.studentDetail = newStudent
    this.createForm();
    this.isLinear = true;
  }

  loadStudentById(studentId) {
    debugger
    
    this.studentService.getStudentById(studentId).subscribe(res => {
      const data = res['data'];
      this.studentDetail = data;
      this.createForm();
    }, err => {
    });
  }

  
loadAllClasses() {
	debugger
	this.studentClassService.getAllStudentClasss().subscribe(res => {
		const data = res['data'];
		this.classList = data['content'];
		console.log(this.classList)
	}, err => {
	});
}
onClassSelectChange(classId){
  this.loadAllSectionsByClassId(classId);
 
}
loadAllSectionsByClassId(id:number) {
	debugger
	this.studentClassService.getAllSectionByClasssId(id).subscribe(res => {

		this.sectionList = res['data'];
		console.log(this.sectionList)
	}, err => {
	});
}
	//get All Source List
	loadAllStudentCategory() {
		debugger
		this.categoryService.getAllCategorys().subscribe(res => {
			const data=res['data'];
			this.categoryList=data['content'];
			console.log(this.categoryList)
		}, err => {
		});
  }



  

  	//get All Source List
	loadAllStudentHouse() {
		debugger
		this.studentHouseService.getAllStudentHouses().subscribe(res => {
			const data=res['data'];
			this.studentHouseList=data['content'];
			console.log(this.studentHouseList)
		}, err => {
		});
  }
  
  loadAllHostel() {
		debugger
		this.hostelService.getAllHostels().subscribe(res => {
			const data = res['data'];
			this.hostelList = data['content'];
			console.log(this.hostelList)
		}, err => {
		});
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
    this.studentInformationFormGroup = this.fb.group({
      rollNo: [this.studentDetail.rollNo, ''],
      classId: [this.studentDetail.classId, Validators.required],
      sectionId: [this.studentDetail.sectionId, Validators.required],
      firstname: [this.studentDetail.firstname, Validators.required],
      lastname: [this.studentDetail.lastname, ''],
      gender: [this.studentDetail.gender, ''],
      dob: [this.typesUtilsService.getDateFromString(this.studentDetail.dob), Validators.compose([Validators.nullValidator])],
      categoryId: [this.studentDetail.categoryId, 0],
      religion: [this.studentDetail.religion, ''],
      cast: [this.studentDetail.cast, ''],
      mobileno: [this.studentDetail.mobileno, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      email: [this.studentDetail.email, Validators.compose([Validators.required, Validators.email])],
      admissionDate: [this.typesUtilsService.getDateFromString(this.studentDetail.admissionDate), Validators.compose([Validators.nullValidator])],
      bloodGroup: [this.studentDetail.bloodGroup, ''],
      schoolHouseId: [this.studentDetail.schoolHouseId, 0],
      height: [this.studentDetail.height, ''],
      weight: [this.studentDetail.weight, ''],
      measurementDate: [this.typesUtilsService.getDateFromString(this.studentDetail.measurementDate), Validators.compose([Validators.nullValidator])],
      image: [this.studentDetail.image, ''],
      siblingId: [this.studentDetail.siblingId, 0],
    });

    this.parentGuardianFormGroup = this.fb.group({
      fatherName: [this.studentDetail.fatherName, ''],
      fatherPhone: [this.studentDetail.fatherPhone, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      fatherOccupation: [this.studentDetail.fatherOccupation, ''],
      fatherPic: [this.studentDetail.fatherPic, ''],
      motherName: [this.studentDetail.motherName, ''],
      motherPhone: [this.studentDetail.motherPhone, [Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      motherOccupation: [this.studentDetail.motherOccupation, ''],
      motherPic: [this.studentDetail.motherPic, ''],
      guardianIs: [this.studentDetail.guardianIs, Validators.required],
      guardianName: [this.studentDetail.guardianName, Validators.required],
      guardianPhone: [this.studentDetail.guardianPhone, [Validators.required,Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]],
      guardianOccupation: [this.studentDetail.guardianOccupation, ''],
      guardianPic: [this.studentDetail.guardianPic, ''],
      guardianRelation: [this.studentDetail.guardianRelation, ''],
      guardianEmail: [this.studentDetail.guardianEmail, Validators.compose([Validators.required, Validators.email])],
      guardianAddress: [this.studentDetail.guardianAddress, ''],
    });

    this.addMoreDetailFormGroup = this.fb.group({
      currentAddress: [this.studentDetail.currentAddress, ''],
      permanentAddress: [this.studentDetail.permanentAddress, ''],
      routeId: [this.studentDetail.routeId, 0],

      hostelRoomId: [this.studentDetail.hostelRoomId, 0],
      bankAccountNo: [this.studentDetail.bankAccountNo, ''],
      bankName: [this.studentDetail.bankName, ''],
      ifscCode: [this.studentDetail.ifscCode, ''],


      rte: [this.studentDetail.rte, ''],
      previousSchool: [this.studentDetail.previousSchool, ''],
      note: [this.studentDetail.note, ''],
    });

    this.studentDetailForm = this.fb.group({

      adharNo: [this.studentDetail.adharNo, ''],
      admissionNo: [this.studentDetail.admissionNo, ''],
      appKey: [this.studentDetail.appKey, ''],
      batchId: [this.studentDetail.batchId, 0],
      city: [this.studentDetail.city, ''],
      disNote: [this.studentDetail.disNote, ''],
      disReasonId: [this.studentDetail.disReasonId, 0],
      disableAt: [this.studentDetail.disableAt, ''],
      feesDiscount: [this.studentDetail.feesDiscount, 0],
      isActive: [this.studentDetail.isActive, ''],
      parentId: [this.studentDetail.parentId, 0],
      pincode: [this.studentDetail.pincode, ''],
      samagraId: [this.studentDetail.samagraId, ''],
      state: [this.studentDetail.state, ''],
      transportFees: [this.studentDetail.transportFees, 0],
      vehrouteId: [this.studentDetail.vehrouteId, 0],


    });
  }

  /**
   * Returns page title
   */
  getTitle(): string {
    if (this.studentDetail.id > 0) {
      return `Edit Student Detail '${this.studentDetail.firstname}' '${this.studentDetail.lastname}'`;
    }

    return 'New Student Detail';
  }

  /**
   * Check control is invalid
   * @param controlName: string
   */
  isControlInvalid(controlName: string): boolean {
    const control = this.studentDetailForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  /** ACTIONS */

  /**
   * Returns prepared studentDetail
   */
  preparestudentDetail(): StudentDtoModel {

    const controls = this.studentDetailForm.controls;
        
     const controls1 = this.studentInformationFormGroup.controls;
     const controls2 = this.parentGuardianFormGroup.controls;
     const controls3 = this.addMoreDetailFormGroup.controls;

    const _studentDetail = new StudentDtoModel();
    _studentDetail.id = this.studentDetail.id;

//
    _studentDetail.rollNo = controls1.rollNo.value;
    _studentDetail.classId = controls1.classId.value;
    _studentDetail.sectionId = controls1.sectionId.value;
    _studentDetail.firstname = controls1.firstname.value;
    _studentDetail.lastname = controls1.lastname.value;
    const _dob = controls1.dob.value;
    if (_dob) {
      _studentDetail.dob = this.typesUtilsService.dateFormat(_dob);
    } else {
      _studentDetail.dob = '';
    }
    _studentDetail.categoryId = controls1.categoryId.value;
    _studentDetail.religion = controls1.religion.value;
    _studentDetail.cast = controls1.cast.value;
    _studentDetail.mobileno = controls1.mobileno.value;
    _studentDetail.email = controls1.email.value;
    _studentDetail.gender = controls1.gender.value;
    const _admissionDate = controls1.admissionDate.value;
    if (_admissionDate) {
      _studentDetail.admissionDate = this.typesUtilsService.dateFormat(_admissionDate);
    } else {
      _studentDetail.admissionDate = '';
    }
    _studentDetail.bloodGroup = controls1.bloodGroup.value;
    _studentDetail.schoolHouseId = controls1.schoolHouseId.value;
    _studentDetail.height = controls1.height.value;
    _studentDetail.weight = controls1.weight.value;
    const _measurementDate = controls1.measurementDate.value;
    if (_measurementDate) {
      _studentDetail.measurementDate = this.typesUtilsService.dateFormat(_measurementDate);
    } else {
      _studentDetail.measurementDate = '';
    }
    _studentDetail.image = controls1.image.value;
    _studentDetail.siblingId = controls1.siblingId.value;

//
    _studentDetail.fatherName = controls2.fatherName.value;
    _studentDetail.fatherPhone = controls2.fatherPhone.value;
    _studentDetail.fatherOccupation = controls2.fatherOccupation.value;
    _studentDetail.fatherPic = controls2.fatherPic.value;
    _studentDetail.motherName = controls2.motherName.value;
    _studentDetail.motherPhone = controls2.motherPhone.value;
    _studentDetail.motherOccupation = controls2.motherOccupation.value;
    _studentDetail.motherPic = controls2.motherPic.value;
    _studentDetail.guardianIs = controls2.guardianIs.value;
    _studentDetail.guardianName = controls2.guardianName.value;
    _studentDetail.guardianPhone = controls2.guardianPhone.value;
    _studentDetail.guardianOccupation = controls2.guardianOccupation.value;
    _studentDetail.guardianRelation = controls2.guardianRelation.value;
    _studentDetail.guardianPic = controls2.guardianPic.value;
    _studentDetail.guardianEmail = controls2.guardianEmail.value;
    _studentDetail.guardianAddress = controls2.guardianAddress.value;
    
    //
    _studentDetail.currentAddress = controls3.currentAddress.value;
    _studentDetail.permanentAddress = controls3.permanentAddress.value;
    _studentDetail.routeId = controls3.routeId.value;

    _studentDetail.hostelRoomId = controls3.hostelRoomId.value;
    _studentDetail.bankAccountNo = controls3.bankAccountNo.value;
    _studentDetail.bankName = controls3.bankName.value;
    _studentDetail.ifscCode = controls3.ifscCode.value;


    _studentDetail.rte = controls3.rte.value;
    _studentDetail.previousSchool = controls3.previousSchool.value;
    _studentDetail.note = controls3.note.value;

    
   //
    _studentDetail.adharNo = controls.adharNo.value;
    _studentDetail.admissionNo = controls.admissionNo.value;
    _studentDetail.appKey = controls.appKey.value;
    _studentDetail.batchId = controls.batchId.value;
    _studentDetail.city = controls.city.value;
    _studentDetail.disNote = controls.disNote.value;
    _studentDetail.disReasonId = controls.disReasonId.value;
    _studentDetail.disableAt = controls.disableAt.value;
    _studentDetail.feesDiscount = controls.feesDiscount.value;
    _studentDetail.isActive = controls.isActive.value;
    // _studentDetail.measurementDate = controls.measurementDate.value;
    _studentDetail.parentId = controls.parentId.value;
    _studentDetail.pincode = controls.pincode.value;
    _studentDetail.samagraId = controls.samagraId.value;
    _studentDetail.state = controls.state.value;
    _studentDetail.transportFees = controls.transportFees.value;
    _studentDetail.vehrouteId = controls.vehrouteId.value;
    if(_studentDetail.id>0){
      _studentDetail.isActive = controls.isActive.value;
    }else{
      _studentDetail.isActive = 'yes';
    }
     
    
    return _studentDetail;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.hasFormErrors = false;

    const controls = this.studentDetailForm.controls;

    const controls1 = this.studentInformationFormGroup.controls;
    const controls2 = this.parentGuardianFormGroup.controls;
    const controls3 = this.addMoreDetailFormGroup.controls;

    /** check form */
    if (this.studentDetailForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    if (this.studentInformationFormGroup.invalid) {
      Object.keys(controls1).forEach(controlName =>
        controls1[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    if (this.parentGuardianFormGroup.invalid) {
      Object.keys(controls2).forEach(controlName =>
        controls2[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    if (this.addMoreDetailFormGroup.invalid) {
      Object.keys(controls3).forEach(controlName =>
        controls3[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }


    const editedstudentDetail = this.preparestudentDetail();
    if (editedstudentDetail.id > 0) {
      this.updateStudentDetail(editedstudentDetail);
    } else {
      this.createStudentDetail(editedstudentDetail);
    }
  }

  onSubmit1() {
//only save add siblings

    this.hasFormErrors = false;
    const controls = this.studentDetailForm.controls;
    /** check form */
    if (this.studentDetailForm.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    const editedstudentDetail = this.preparestudentDetail();
    if (editedstudentDetail.id > 0) {
      this.updateStudentDetail(editedstudentDetail);
    } else {
      this.createStudentDetail(editedstudentDetail);
    }
  }
  /**
   * Update studentDetail
   *
   * @param _studentDetail: StudentDtoModel
   */
  updateStudentDetail(_studentDetail: StudentDtoModel) {
    const updateStudentDetail: Update<StudentDtoModel> = {
      id: _studentDetail.id,
      changes: _studentDetail
    };
    this.store.dispatch(new StudentUpdated({
      partialStudent: updateStudentDetail,
      student: _studentDetail
    }));

    this.router.navigate(["/student-information/student-details"])

    // Remove this line
    //of(undefined).pipe(delay(1000)).subscribe(() => this.dialogRef.close({ _studentDetail, isEdit: true }));
    // Uncomment this line
    // this.dialogRef.close({ _studentDetail, isEdit: true }
  }

  /**
   * Create studentDetail
   *
   * @param _studentDetail: StudentDtoModel
   */
  createStudentDetail(_studentDetail: StudentDtoModel) {
    this.store.dispatch(new StudentOnServerCreated({ student: _studentDetail }));
    this.componentSubscriptions = this.store.pipe(
      select(selectLastCreatedStudentId),
      delay(1000), // Remove this line
    ).subscribe(res => {
      if (!res) {
        return;
      }

      this.router.navigate(["/student-information/student-details"])
      // this.dialogRef.close({ _studentDetail, isEdit: false });
    });


  }

  onCancel() {
    this.studentDetailForm.reset();
    this.studentInformationFormGroup.reset();
    this.addMoreDetailFormGroup.reset();
    this.studentDetail.clear();
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

  onSelectStudent(event) {
    console.log(event);
    this.filesStudent.push(...event.addedFiles);
  }

  onRemoveStudent(event) {
    console.log(event);
    this.filesStudent.splice(this.filesStudent.indexOf(event), 1);
  }

  onSelectFather(event) {
    console.log(event);
    this.filesFather.push(...event.addedFiles);
  }

  onRemoveFather(event) {
    console.log(event);
    this.filesFather.splice(this.filesFather.indexOf(event), 1);
  }

  onSelectMother(event) {
    console.log(event);
    this.filesMother.push(...event.addedFiles);
  }

  onRemoveMother(event) {
    console.log(event);
    this.filesMother.splice(this.filesMother.indexOf(event), 1);
  }

  onSelectGuardian(event) {
    console.log(event);
    this.filesGuardian.push(...event.addedFiles);
  }

  onRemoveGuardian(event) {
    console.log(event);
    this.filesGuardian.splice(this.filesGuardian.indexOf(event), 1);
  }

  onSelectTitle(event) {
    console.log(event);
    this.filesTitle.push(...event.addedFiles);
  }

  onRemoveTitle(event) {
    console.log(event);
    this.filesTitle.splice(this.filesTitle.indexOf(event), 1);
  }

  onSelectTitle1(event) {
    console.log(event);
    this.filesTitle1.push(...event.addedFiles);
  }

  onRemoveTitle1(event) {
    console.log(event);
    this.filesTitle1.splice(this.filesTitle1.indexOf(event), 1);
  }

  onSelectTitle2(event) {
    console.log(event);
    this.filesTitle2.push(...event.addedFiles);
  }

  onRemoveTitle2(event) {
    console.log(event);
    this.filesTitle2.splice(this.filesTitle2.indexOf(event), 1);
  }

  onSelectTitle3(event) {
    console.log(event);
    this.filesTitle3.push(...event.addedFiles);
  }

  onRemoveTitle3(event) {
    console.log(event);
    this.filesTitle3.splice(this.filesTitle3.indexOf(event), 1);
  }

  onChangeGuardianIs($event) {
    debugger
    if($event.value == "Father"){

      this.parentGuardianFormGroup.get("guardianName").setValue(this.parentGuardianFormGroup.get("fatherName").value) 
      this.parentGuardianFormGroup.get("guardianPhone").setValue(this.parentGuardianFormGroup.get("fatherPhone").value)  
      this.parentGuardianFormGroup.get("guardianOccupation").setValue(this.parentGuardianFormGroup.get("fatherOccupation").value)  
      this.parentGuardianFormGroup.get("guardianRelation").setValue(this.parentGuardianFormGroup.get("guardianIs").value)  

    }
    if($event.value == "Mother"){
      this.parentGuardianFormGroup.get("guardianName").setValue(this.parentGuardianFormGroup.get("motherName").value) 
      this.parentGuardianFormGroup.get("guardianPhone").setValue(this.parentGuardianFormGroup.get("motherPhone").value)  
      this.parentGuardianFormGroup.get("guardianOccupation").setValue(this.parentGuardianFormGroup.get("motherOccupation").value)  
      this.parentGuardianFormGroup.get("guardianRelation").setValue(this.parentGuardianFormGroup.get("guardianIs").value)  
    }
    if($event.value == "Other"){
      this.parentGuardianFormGroup.get("guardianName").setValue('') 
      this.parentGuardianFormGroup.get("guardianPhone").setValue('')  
      this.parentGuardianFormGroup.get("guardianOccupation").setValue('')  
      this.parentGuardianFormGroup.get("guardianRelation").setValue('')  

    }

  }

}

