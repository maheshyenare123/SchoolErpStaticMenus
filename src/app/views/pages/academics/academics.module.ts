import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartialsModule } from '../../partials/partials.module';
import { CoreModule } from '../../../core/core.module';
import { CodePreviewModule } from '../../partials/content/general/code-preview/code-preview.module';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatIconRegistry } from '@angular/material/icon';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { ModuleGuard } from '../../../core/auth';
import { InterceptService, TypesUtilsService, HttpUtilsService, LayoutUtilsService } from '../../../core/_base/crud';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MaterialModule } from '../material/material.module';



import { AcademicsComponent } from './academics.component';
import { TeacherTimetableComponent } from './teacher-timetable/teacher-timetable.component';
import { SubjectComponent } from './subject/subject.component';
import { SectionComponent} from './section/section.component';
import { ClassComponent} from './class/class.component';
import { AssignClassTeacherComponent } from './assign-class-teacher/assign-class-teacher.component';
import { PromoteStudentComponent } from './promote-student/promote-student.component';
import { SubjectGroupComponent } from './subject-group/subject-group.component';
import { ClassTimetableListComponent } from './class-timetable/class-timetable-list/class-timetable-list.component'
import { ClassTimetableEditDialogComponent } from './class-timetable/class-timetable-edit/class-timetable-edit.dialog.component'
import { AssignClassTeachersPageCancelled, classTimetablesReducer, ClassTimetableEffects, assignClassTeachersReducer, AssignClassTeacherEffects, SectionEffects, sectionsReducer, subjectsReducer, SubjectEffects, subjectGroupsReducer, SubjectGroupEffects, ClassTimetableService, AssignClassTeacherService, SectionService, SubjectService, SubjectGroupService, StudentClassEffects, studentClasssReducer, StudentClassService } from '../../../core/academics';


const routes: Routes = [
	{
		path: '',
		component: AcademicsComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'class-timetable',
				component: ClassTimetableListComponent
      },
      {
				path: 'teacher-timetable',
				component: TeacherTimetableComponent
      },
      {
				path: 'assign-class-teacher',
				component: AssignClassTeacherComponent
      },
			{
				path: 'class',
				component: ClassComponent
      },
      {
				path: 'section',
				component: SectionComponent
      },
      {
				path: 'subject',
				component: SubjectComponent
      },
      {
				path: 'subject-group',
				component: SubjectGroupComponent
      },

    
    ]
  }
]


@NgModule({
  declarations: [
    AcademicsComponent,
    TeacherTimetableComponent,
    SubjectComponent,
    SectionComponent,
    ClassComponent,
    AssignClassTeacherComponent,
    PromoteStudentComponent,
    SubjectGroupComponent,
    ClassTimetableListComponent,
    ClassTimetableEditDialogComponent
  ],
  imports: [
    CommonModule,
		PartialsModule,
		NgbModule,
		CoreModule,
		CodePreviewModule,
		RouterModule.forChild(routes),
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
    PerfectScrollbarModule,
    MaterialModule,
    TranslateModule.forChild(),
    NgxPermissionsModule.forChild(),

  //state manage
  StoreModule.forFeature('classTimetables', classTimetablesReducer),
  EffectsModule.forFeature([ClassTimetableEffects]),
  StoreModule.forFeature('assignClassTeachers', assignClassTeachersReducer),
  EffectsModule.forFeature([AssignClassTeacherEffects]),
  StoreModule.forFeature('studentClasss', studentClasssReducer),
  EffectsModule.forFeature([StudentClassEffects]),
  StoreModule.forFeature('sections', sectionsReducer),
  EffectsModule.forFeature([SectionEffects]),
  StoreModule.forFeature('subjects', subjectsReducer),
  EffectsModule.forFeature([SubjectEffects]),
  StoreModule.forFeature('subjectGroups', subjectGroupsReducer),
  EffectsModule.forFeature([SubjectGroupEffects]),



  ],
  providers: [
    NgbAlertConfig,
    MatIconRegistry,
    ModuleGuard,
    InterceptService,
    TypesUtilsService,
    HttpUtilsService,
    LayoutUtilsService,
		{ provide: MatBottomSheetRef, useValue: {} },
		{ provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
		{ provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },

    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '1100px'
      }
    },



//custom service
ClassTimetableService,
AssignClassTeacherService,
StudentClassService,
SectionService,
SubjectService,
SubjectGroupService,




  ],
   
    entryComponents: [
      ClassTimetableEditDialogComponent,
    ],
    exports: [RouterModule],
})
export class AcademicsModule { }
