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
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {

  company_id: any;

  public monthlyReports: any[];
  public dailyReports: any[];
  public yearlyReports: any[];
  public refunds: any[];
  public colorScheme = {
    domain: ['rgba(255,255,255,0.8)']
  };
  public autoScale = true;
  @ViewChild('resizedDiv', { static: true }) resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  public settings: Settings;
  constructor(public appSettings: AppSettings, private commonServices: CommonServices, public dialog: MatDialog) {
    this.settings = this.appSettings.settings;

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;
  }

  ngOnInit() {
    //this.orders = orders;
    //this.products = products;
    //this.customers = customers;
    //this.refunds = refunds;
    //this.orders = this.addRandomValue('orders');     
    //this.customers = this.addRandomValue('customers');
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

      } else if (res['success'] == '0') {
        this.dailyReports = []
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
        /* this.monthlyReports = [
          {
           name: 'Monthly',
           series: monthly
         }
       ] */


      } else if (res['success'] == '0') {
        this.monthlyReports = [];
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
        /* this.customers = [
          {
           name: 'Yearly',
           series: yearly
         }
       ] */

      } else if (res['success'] == '0') {
        this.yearlyReports = [];
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
      data: {date, title: "Daily"}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  /* public onSelectMonthly(event) {
    console.log(event);
    let date = moment(event.name).format('YYYY-MM-DD');
    let dialogRef = this.dialog.open(GraphListDialogComponent, {
      data: {date, title: "Monthly"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public onSelectYearly(event) {
    //console.log(event.name);
    let date = moment(event.name).format('YYYY-MM-DD');
    let dialogRef = this.dialog.open(GraphListDialogComponent, {
      data: {date, title: "Yearly"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  } */


  ngOnDestroy() {
    //this.monthlyReports[0].series.length = 0;
    //this.yearlyReports[0].series.length = 0;
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      /* setTimeout(() => this.monthlyReports = [...this.monthlyReports]);
      setTimeout(() => this.dailyReports = [...this.dailyReports]);
      setTimeout(() => this.yearlyReports = [...this.yearlyReports]); */
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}