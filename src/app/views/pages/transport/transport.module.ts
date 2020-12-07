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





import { TransportComponent } from './transport.component';

import { RoutesComponent } from './routes/routes.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { AssignVehicleComponent } from './assign-vehicle/assign-vehicle.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouteEffects, routesReducer, RouteService, vehiclesReducer, VehicleEffects, VehicleService, assignVehiclesReducer, AssignVehicleEffects, AssignVehicleService } from 'src/app/core/transport';


const routes: Routes = [
	{
		path: '',
		component: TransportComponent,
		children: [
      {
				path: '',
				redirectTo: 'roles',
				pathMatch: 'full'
      },
      {
				path: 'routes',
				component: RoutesComponent
      },
      {
				path: 'vehicles',
				component: VehiclesComponent
      },
      {
				path: 'assign-vehicle',
				component: AssignVehicleComponent
      },
      
    ] 
  }
]

@NgModule({
  declarations: [TransportComponent,RoutesComponent, VehiclesComponent, AssignVehicleComponent],
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
    StoreModule.forFeature('routes', routesReducer),
    EffectsModule.forFeature([RouteEffects]),
    StoreModule.forFeature('vehicles', vehiclesReducer),
    EffectsModule.forFeature([VehicleEffects]),
    StoreModule.forFeature('assignVehicles', assignVehiclesReducer),
    EffectsModule.forFeature([AssignVehicleEffects]),
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
RouteService,
VehicleService,
AssignVehicleService
  ],
    entryComponents: [],
  exports: [RouterModule],
})
export class TransportModule { }
