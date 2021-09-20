import { InformationCardsComponent } from './information-cards/information-cards.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DashboardComponent } from './dashboard.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { VehicleListComponent } from './vehiclelist/list.component';
import { TrackingVehicleComponent } from './tracking-vehicle/tracking-vehicle.component';

export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full', }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FormsModule,
    NgxChartsModule,
    PerfectScrollbarModule
  ],
  declarations: [
    DashboardComponent,
    InfoCardsComponent,
    InformationCardsComponent,
    VehicleListComponent,
    TrackingVehicleComponent
  ]
})
export class DashboardModule { }
