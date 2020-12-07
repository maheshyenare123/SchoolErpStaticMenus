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
import { MaterialModule } from '../material/material.module';

import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { ModuleGuard } from 'src/app/core/auth';
import { InterceptService, TypesUtilsService, HttpUtilsService, LayoutUtilsService } from 'src/app/core/_base/crud';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {NgxPaginationModule} from 'ngx-pagination';

import { ReportComponent } from './report.component';
import { StudentInformationsComponent } from './student-informations/student-informations.component';
import { AdmissionReportComponent } from './admission-report/admission-report.component';
import { ClassSubjectReportComponent } from './class-subject-report/class-subject-report.component';
import { GuardianReportComponent } from './guardian-report/guardian-report.component';
import { HomeworkEvaluationReportComponent } from './homework-evaluation-report/homework-evaluation-report.component';
import { SiblingReportComponent } from './sibling-report/sibling-report.component';
import { StudentHistoryComponent } from './student-history/student-history.component';
import { StudentLoginCredentialComponent } from './student-login-credential/student-login-credential.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentReportComponent } from './student-report/student-report.component';
import { studentsReducer, StudentEffects, StudentService } from 'src/app/core/student-information';
import { homeworksReducer, HomeworkEffects, HomeworkService } from 'src/app/core/homework';
import { FinanceComponent } from './finances/finance/finance.component';
import { BalanceFeesReportComponent } from './finances/balance-fees-report/balance-fees-report.component';
import { ExpenseGroupReportComponent } from './finances/expense-group-report/expense-group-report.component';
import { ExpenseReportComponent } from './finances/expense-report/expense-report.component';
import { FeesCollectionReportComponent } from './finances/fees-collection-report/fees-collection-report.component';
import { FeesStatementComponent } from './finances/fees-statement/fees-statement.component';
import { IncomeGroupReportComponent } from './finances/income-group-report/income-group-report.component';
import { IncomeReportComponent } from './finances/income-report/income-report.component';
import { OnlineFeesCollectionReportComponent } from './finances/online-fees-collection-report/online-fees-collection-report.component';
import { PayrollReportComponent } from './finances/payroll-report/payroll-report.component';
import { expensesReducer, ExpenseEffects, ExpenseService, ExpenseHeadEffects, ExpenseHeadService, expenseHeadsReducer } from 'src/app/core/expense';
import { incomesReducer, IncomeEffects, incomeHeadsReducer, IncomeHeadEffects, IncomeService, IncomeHeadService } from 'src/app/core/income';
import { staffPayslipsReducer, StaffPayslipEffects, StaffPayslipService, StaffService, staffsReducer } from 'src/app/core/human-resource';
import { HostelReportComponent } from './hostel-report/hostel-report.component';
import { TransportReportComponent } from './transport-report/transport-report.component';
import { AddItemReportComponent } from './inventory/add-item-report/add-item-report.component';
import { InventoryReportComponent } from './inventory/inventory-report/inventory-report.component';
import { IssueItemReportComponent } from './inventory/issue-item-report/issue-item-report.component';
import { StockReportComponent } from './inventory/stock-report/stock-report.component';
import { itemStocksReducer, ItemStockEffects, ItemStockService } from 'src/app/core/inventory';
import { bookIssueReturnsReducer, BookIssueReturnEffects, BookIssueReturnService, BookEffects, BookService, booksReducer } from 'src/app/core/library';
import { BookDueReportComponent } from './library/book-due-report/book-due-report.component';
import { BookInventoryReportComponent } from './library/book-inventory-report/book-inventory-report.component';
import { BookIssueReportComponent } from './library/book-issue-report/book-issue-report.component';
import { BookIssueReturnReportComponent } from './library/book-issue-return-report/book-issue-return-report.component';
import { LibraryReportComponent } from './library/library-report/library-report.component';
import { HumanResourceReportComponent } from './human-resource/human-resource-report/human-resource-report.component';
import { PayrollsReportComponent } from './human-resource/payrolls-report/payrolls-report.component';
import { StaffReportComponent } from './human-resource/staff-report/staff-report.component';
import { StaffEffects } from 'src/app/core/human-resource/_effects/staff.effects';
import { AttendanceReportComponent } from './Attendances/attendance-report/attendance-report.component';
import { BiometricAttendanceLogComponent } from './Attendances/biometric-attendance-log/biometric-attendance-log.component';
import { StaffAttendanceReportComponent } from './Attendances/staff-attendance-report/staff-attendance-report.component';
import { StudentAttendanceReportComponent } from './Attendances/student-attendance-report/student-attendance-report.component';
import { StudentAttendanceTypeReportComponent } from './Attendances/student-attendance-type-report/student-attendance-type-report.component';




const routes: Routes = [
	{
		path: '',
		component: ReportComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'student-information',
				component: StudentInformationsComponent
      },
      {
				path: 'student-report',
				component: StudentReportComponent
      },
      {
				path: 'guardian-report',
				component:  GuardianReportComponent
      },
      {
				path: 'student-history',
				component:  StudentHistoryComponent
      },
      {
				path: 'student-login-credential',
				component:  StudentLoginCredentialComponent
      },
      {
				path: 'class-subject-report',
				component:  ClassSubjectReportComponent
      },
      {
				path: 'admission-report',
				component: AdmissionReportComponent
      },
      {
				path: 'sibling-report',
				component:  SiblingReportComponent, 
    
      },
      {
				path: 'student-profile',
				component:  StudentProfileComponent, 
      },
      {
				path: 'homework-evaluation-report',
				component:  HomeworkEvaluationReportComponent
      },
      {
				path: 'finance',
				component:  FinanceComponent
      },

      {
				path: 'fees-statement',
				component:  FeesStatementComponent, 
      },
      {
				path: 'balance-fees-report',
				component:  BalanceFeesReportComponent, 
      },
      {
				path: 'fees-collection-report',
				component:   FeesCollectionReportComponent, 
      },
      {
				path: 'online-fees-collection-report',
				component:   OnlineFeesCollectionReportComponent, 
      },
      {
				path: 'income-report',
        component:   IncomeReportComponent, 
      },
      {
				path: 'expense-report',
				component:   ExpenseReportComponent, 
      },
      {
				path: 'payroll-report',
				component:   PayrollReportComponent, 
      },
      {
				path: 'income-group-report',
				component:   IncomeGroupReportComponent,
      },
      {
				path: 'expense-group-report',
				component:   ExpenseGroupReportComponent,
      },


      {
				path: 'human-resource-report',
				component:   HumanResourceReportComponent, 
      },
      {
				path: 'staff-report',
				component:   StaffReportComponent, 
      },
      {
				path: 'payrolls-report',
				component:   PayrollsReportComponent, 
      },


      // {
			// 	path: 'attendance-report',
			// 	component:   AttendanceReportComponent, 
      // },
      // {
			// 	path: 'book-issue-report',
			// 	component:   StudentAttendanceReportComponent, 
      // },
      // {
			// 	path: 'book-due-report',
			// 	component:   StudentAttendanceTypeReportComponent, 
      // },
      // {
			// 	path: 'book-inventory-report',
			// 	component:  StaffAttendanceReportComponent,
      // },
      // {
			// 	path: 'book-issue-return-report',
			// 	component:  BiometricAttendanceLogComponent,
      // },


    
      {
				path: 'library-report',
				component:   LibraryReportComponent, 
      },
      {
				path: 'book-issue-report',
				component:   BookIssueReportComponent, 
      },
      {
				path: 'book-due-report',
				component:   BookDueReportComponent, 
      },
      {
				path: 'book-inventory-report',
				component:  BookInventoryReportComponent,
      },
      {
				path: 'book-issue-return-report',
				component:  BookIssueReturnReportComponent,
      },


      {
				path: 'inventory-report',
				component:   InventoryReportComponent, 
      },
      {
				path: 'stock-report',
				component:   StockReportComponent, 
      },
      {
				path: 'add-item-report',
				component:   AddItemReportComponent, 
      },
      {
				path: 'issue-item-report',
				component:  IssueItemReportComponent,
      },


      {
				path: 'transport-report',
				component:   TransportReportComponent,
      },
      {
				path: 'hostel-report',
				component:   HostelReportComponent,
      },

    ] 
  }
]


@NgModule({
  declarations: [
    ReportComponent,
    StudentInformationsComponent,
    StudentReportComponent,
    GuardianReportComponent, 
    StudentHistoryComponent, 
    StudentLoginCredentialComponent, 
    ClassSubjectReportComponent, 
    AdmissionReportComponent, 
    SiblingReportComponent, 
    StudentProfileComponent, 
    HomeworkEvaluationReportComponent,

    FinanceComponent,
    FeesStatementComponent, 
    BalanceFeesReportComponent, 
    FeesCollectionReportComponent, 
    OnlineFeesCollectionReportComponent, 
    IncomeReportComponent, 
    ExpenseReportComponent, 
    PayrollReportComponent, 
    IncomeGroupReportComponent, 
    ExpenseGroupReportComponent,


    AttendanceReportComponent, 
    StudentAttendanceReportComponent, 
    StudentAttendanceTypeReportComponent, 
    StaffAttendanceReportComponent, 
    BiometricAttendanceLogComponent,


    HumanResourceReportComponent, 
    StaffReportComponent, 
    PayrollsReportComponent, 

    LibraryReportComponent, 
    BookIssueReportComponent, 
    BookDueReportComponent, 
    BookInventoryReportComponent, 
    BookIssueReturnReportComponent,

    InventoryReportComponent, 
    StockReportComponent, 
    AddItemReportComponent, 
    IssueItemReportComponent,

    TransportReportComponent,
    HostelReportComponent
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
    NgxPaginationModule,
   // CKEditorModule
    
// state manage
        StoreModule.forFeature('students', studentsReducer),
        EffectsModule.forFeature([StudentEffects]),
        StoreModule.forFeature('homeworks', homeworksReducer),
        EffectsModule.forFeature([HomeworkEffects]),
        StoreModule.forFeature('expenses', expensesReducer),
        EffectsModule.forFeature([ExpenseEffects]),
        StoreModule.forFeature('expenseHeads', expenseHeadsReducer),
        EffectsModule.forFeature([ExpenseHeadEffects]),
        StoreModule.forFeature('incomes', incomesReducer),
        EffectsModule.forFeature([IncomeEffects]),
        StoreModule.forFeature('incomeHeads', incomeHeadsReducer),
        EffectsModule.forFeature([IncomeHeadEffects]),
        StoreModule.forFeature('staffPayslips', staffPayslipsReducer),
        EffectsModule.forFeature([StaffPayslipEffects]),
        StoreModule.forFeature('itemStocks', itemStocksReducer),
        StoreModule.forFeature('books', booksReducer),
        EffectsModule.forFeature([BookEffects]),
        EffectsModule.forFeature([ItemStockEffects]),
        StoreModule.forFeature('bookIssueReturns', bookIssueReturnsReducer),
        EffectsModule.forFeature([BookIssueReturnEffects]),
        StoreModule.forFeature('staffs', staffsReducer),
        EffectsModule.forFeature([StaffEffects]),
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
        width: '900px'
      }
    },

//custom service
StudentService,
HomeworkService,
ExpenseService,
ExpenseHeadService,
IncomeService,
IncomeHeadService,
StaffPayslipService,
ItemStockService,
BookService,
BookIssueReturnService,
StaffService,
  ],
    entryComponents: [
     
    ],
  exports: [RouterModule],
})
export class ReportModule { }
