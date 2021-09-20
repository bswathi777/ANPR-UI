import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FusionChartsModule } from "angular-fusioncharts";
import { Covid19Component } from './covid19/covid19.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CovidInformationCardsComponent } from './covid-information-cards/covid-information-cards.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';
import { CovidBuildingReportsComponent } from './covid-building-reports/covid-building-reports.component';

import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

import { CovidOverallReportComponent } from './covid-overall-report/covid-overall-report.component';
import { CovidDashboardComponent } from './covid-dashboard/covid-dashboard.component';
import { CovidCurrentReportsComponent } from './covid-current-reports/covid-current-reports.component';
import { CovidReportDialogComponent } from './covid-report-dialog/covid-report-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from './multi-select/multi-select.component';
import { CovidFusionChartComponent } from './charts/covid-fusion-chart/covid-fusion-chart.component';
import { CovidDailyChartComponent } from './charts/covid-daily-chart/covid-daily-chart.component';
import { CovidMonthlyChartComponent } from './charts/covid-monthly-chart/covid-monthly-chart.component';
import { CovidVideoDialogComponent } from './covid-video-dialog/covid-video-dialog.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { AgmCoreModule } from '@agm/core';
import { CovidMapDialogComponent } from './covid-map-dialog/covid-map-dialog.component';
import { CovidMapComponent } from './covid-map/covid-map.component';
import { CovidMindMapComponent } from './covid-mind-map/covid-mind-map.component';

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme);

export const routes : Routes = [
    { path: '', redirectTo: 'tracker', pathMatch: 'full' },
     {path: '' , component: CovidDashboardComponent, children : [
     {path: 'tracker' , component: Covid19Component},
     {path:'reports/:id',component:CovidOverallReportComponent , data: { breadcrumb: 'Covid Reports' }}
  ]
}
];
 

@NgModule({
  declarations: [
    Covid19Component,
    CovidInformationCardsComponent,
    CovidDailyChartComponent,
    CovidMonthlyChartComponent,
    CovidBuildingReportsComponent,
    CovidOverallReportComponent,
    CovidDashboardComponent,
    CovidCurrentReportsComponent,
    CovidReportDialogComponent,
    MultiSelectComponent,
    CovidFusionChartComponent,
    CovidVideoDialogComponent,
    CovidMapDialogComponent,
    CovidMapComponent,
    CovidMindMapComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FusionChartsModule,
    DiagramAllModule,
    OwlDateTimeModule,
    NgxChartsModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0'
    }), 
  ],
  entryComponents: [CovidReportDialogComponent,CovidVideoDialogComponent,CovidMapDialogComponent]
})
export class CovidModule { }
