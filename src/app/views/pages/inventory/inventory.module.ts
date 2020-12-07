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

import { InventoryComponent } from './inventory.component';
import { ItemCategoryComponent } from './item-category/item-category.component';
import { itemCategorysReducer, ItemCategoryEffects, ItemCategoryService, AddItemEffects, AddItemService, addItemsReducer, ItemStoreEffects, ItemStoreService, itemStoresReducer, ItemSupplierEffects, ItemSupplierService, itemSuppliersReducer, ItemStockEffects, ItemStockService, itemStocksReducer, ItemIssueEffects, ItemIssueService, itemIssuesReducer } from 'src/app/core/inventory';
import { AddItemComponent } from './add-item/add-item.component';
import { ItemStoreComponent } from './item-store/item-store.component';
import { ItemSupplierComponent } from './item-supplier/item-supplier.component';
import { ItemStockComponent } from './item-stock/item-stock.component';
import { ItemIssueEditDialogComponent } from './item-issue/item-issue-edit/item-issue-edit.dialog.component';
import { ItemIssueListComponent } from './item-issue/item-issue-list/item-issue-list.component';

const routes: Routes = [
	{
		path: '',
		component: InventoryComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'item-category',
				component: ItemCategoryComponent
      },
      {
				path: 'add-item',
				component: AddItemComponent
      },
      {
				path: 'item-store',
				component: ItemStoreComponent
      },
      {
				path: 'item-supplier',
				component: ItemSupplierComponent
      },
      {
				path: 'item-stock',
				component: ItemStockComponent
      },
      {
				path: 'item-issue',
				component: ItemIssueListComponent
      },
    ] 
  }
]


@NgModule({
  declarations: [
    InventoryComponent,
    ItemCategoryComponent,
    AddItemComponent,
    ItemStoreComponent,
    ItemSupplierComponent,
    ItemStockComponent,
    ItemIssueListComponent,
    ItemIssueEditDialogComponent,
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
StoreModule.forFeature('itemStocks', itemStocksReducer),
EffectsModule.forFeature([ItemStockEffects]),

StoreModule.forFeature('itemSuppliers', itemSuppliersReducer),
EffectsModule.forFeature([ItemSupplierEffects]),

    StoreModule.forFeature('itemStores', itemStoresReducer),
    EffectsModule.forFeature([ItemStoreEffects]),

    StoreModule.forFeature('itemCategorys', itemCategorysReducer),
    EffectsModule.forFeature([ItemCategoryEffects]),

    StoreModule.forFeature('addItems', addItemsReducer),
    EffectsModule.forFeature([AddItemEffects]),

    StoreModule.forFeature('itemIssues', itemIssuesReducer),
    EffectsModule.forFeature([ItemIssueEffects]), 

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
ItemStockService,
ItemSupplierService,
ItemStoreService,
ItemCategoryService,
AddItemService,
ItemIssueService,
  ],
    entryComponents: [
      ItemIssueEditDialogComponent,
    ],
  exports: [RouterModule],
})
export class InventoryModule { }
