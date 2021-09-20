import { GraphListDialogComponent } from '../list-dialog/list-dialog.component';

import { MatDialog } from '@angular/material';
import { CommonServices } from './../../../services/common.services';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import * as moment from 'moment';
//import { orders, products, customers, refunds } from '../dashboard.data';
//import { customers, refunds } from '../dashboard.data';

@Component({
  selector: 'app-information-cards',
  templateUrl: './information-cards.component.html',
  styleUrls: ['./information-cards.component.scss']
})
export class InformationCardsComponent implements OnInit {

  company_id: any;

  public monthlyReports: any;
  public dailyReports: any;
  public yearlyReports: any;

  loading_daily: boolean = true;
  loading_yearly: boolean = true;
  loading_monthly: boolean = true;


  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel = 'Country';
  public showYAxisLabel = true;
  public yAxisLabel = 'Population';
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  };

  @ViewChild('resizedDiv', { static: true }) resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;

  public settings: Settings;
  constructor(public appSettings: AppSettings, private commonServices: CommonServices, public dialog: MatDialog) {
    this.settings = this.appSettings.settings;

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;
  }

  ngOnInit() {

    this.getDailyReportGraphs();
    this.getMonthlyReportGraphs();
    this.getYealyReportGraphs();
  }

  getDailyReportGraphs() {
    let obj = {
      company_id: this.company_id
    }
    this.commonServices.dailyReportGraphs(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.dailyReports = res['data'];
        if (this.dailyReports.length == 0) {
          this.loading_daily = true;
        } else {
          this.loading_daily = false;
        }
      } else if (res['success'] == '0') {
        this.dailyReports = []
      } else if (res['success'] == '3') {
        this.getDailyReportGraphs()
      }
    },
      err => {
        console.log(err);
      });
  }


  getMonthlyReportGraphs() {
    let obj = {
      company_id: this.company_id
    }
    this.commonServices.monthlyReportGraphs(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.monthlyReports = res['data'];
        if (this.monthlyReports.length == 0) {
          this.loading_monthly = true;
        } else {
          this.loading_monthly = false;
        }
      } else if (res['success'] == '0') {
        this.monthlyReports = [];
      } else if (res['success'] == '3') {
        this.getMonthlyReportGraphs()
      }
    },
      err => {
        console.log(err);
      });
  }

  getYealyReportGraphs() {
    let obj = {
      company_id: this.company_id
    }
    this.commonServices.yearlyReportGraphs(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.yearlyReports = res['data'];
        if (this.yearlyReports.length == 0) {
          this.loading_yearly = true;
        } else {
          this.loading_yearly = false;
        }
      } else if (res['success'] == '0') {
        this.yearlyReports = [];
      } else if (res['success'] == '3') {
        this.getYealyReportGraphs()
      }
    },
      err => {
        console.log(err);
      });
  }

  public onSelectDaily(event) {
    //console.log(event.name);
    let date = moment(event.name).format('YYYY-MM-DD');

    let dialogRef = this.dialog.open(GraphListDialogComponent, {
      width: '90%',
      data: { date, title: "Daily" }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    //this.monthlyReports[0].series.length = 0;
    //this.yearlyReports[0].series.length = 0;
  }

  ngAfterViewChecked() {

    let dailyReports = this.dailyReports;
    let monthlyReports = this.monthlyReports;
    let yearlyReports = this.yearlyReports;
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {

      if (this.dailyReports != undefined) {
        this.dailyReports = [...dailyReports];
      }

      if (this.monthlyReports != undefined) {
        this.monthlyReports = [...monthlyReports];
      }

      if (this.yearlyReports != undefined) {
        this.yearlyReports = [...yearlyReports];
      }
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}