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


import { ExpenseComponent } from './expense.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { SearchExpenseComponent } from './search-expense/search-expense.component';
import { ExpenseHeadComponent } from './expense-head/expense-head.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { expensesReducer, ExpenseEffects, ExpenseHeadEffects, expenseHeadsReducer, ExpenseService, ExpenseHeadService } from 'src/app/core/expense';

const routes: Routes = [
	{
		path: '',
		component: ExpenseComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'add-expense',
				component: AddExpenseComponent
      },
      {
				path: 'search-expense',
				component: SearchExpenseComponent
      },
      {
				path: 'expense-head',
				component: ExpenseHeadComponent
      },
      
    ] 
  }
]

@NgModule({
  declarations: [ExpenseComponent,AddExpenseComponent, SearchExpenseComponent, ExpenseHeadComponent],
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
   // CKEditorModule
    
//state manage
    StoreModule.forFeature('expenses', expensesReducer),
    EffectsModule.forFeature([ExpenseEffects]),
    StoreModule.forFeature('expenseHeads', expenseHeadsReducer),
    EffectsModule.forFeature([ExpenseHeadEffects]),
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
ExpenseService,
ExpenseHeadService,
  ],
    entryComponents: [],
  exports: [RouterModule],
})
export class ExpenseModule { }
