import { analyticsData } from './dashboard.data';
import { disk_space } from './dashboard.data';
import { GlobalServices } from './../../services/global.service';
import { CommonServices } from './../../services/common.services';
import * as moment from 'moment';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GraphListDialogComponent } from './list-dialog/list-dialog.component';
import { TilesListDialogComponent } from './tileslist-dialog/tileslist-dialog.component';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

export interface Analysis {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('backToTop', { static: false }) backToTop: any;

  data: any = {};

  public maxDate: any = new Date();

  //Analysis
  public analytics: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = true;
  public xAxisLabel;
  public showYAxisLabel = true;
  public yAxisLabel = 'Vehicle Count';
  public colorScheme = {
    domain: ['#283593', '#FF4F00']
  };
  public autoScale = true;
  public roundDomains = true;
  @ViewChild('resizedDiv', { static: true }) resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;

  analysisData: Analysis[] = [
    { value: 'hourly', viewValue: 'Hourly' },
    { value: 'daily', viewValue: 'Daily' },
    { value: 'monthly', viewValue: 'Monthly' },
    { value: 'yearly', viewValue: 'Yearly' }
  ];

  loading_graph: boolean = true;


  //disk space
  public data_disk: any;
  public showLegend_disk = true;
  public gradient_disk = true;
  public colorScheme_disk = {
    domain: ['#378D3B', '#2F3E9E']
  };
  model: any;
  vehicle_reg_no: any;
  public showLabels_disk = false;
  public explodeSlices_disk = false;
  public doughnut_disk = false;

  data_count: any = {};

  company_id: any;
  noentry: any;

  constructor(private commonService: CommonServices, private globalService: GlobalServices, public dialog: MatDialog) {

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;

    let dateValue = new Date();

    this.noentry = { "entry": 0, "exit": 0, "taxi": 0, "total": 0, "private": 0, "recurring": 0, "unidentified": 0 };

    this.data = {
      type: 'daily',
      date: dateValue
    }

    this.GraphsVehicleData(this.data);
    this.xAxisLabelData();

  }

  ngOnInit() {
    this.dashboardCount();
  }

  ngAfterViewInit() {
    //this.backToTop.nativeElement.style.display = 'none';
  }

  xAxisLabelData() {
    if (this.data.type == 'hourly') {
      this.xAxisLabel = "Hours"
    } else if (this.data.type == 'daily') {
      this.xAxisLabel = "Days"
    } else if (this.data.type == 'monthly') {
      this.xAxisLabel = "Months"
    } else if (this.data.type == 'yearly') {
      this.xAxisLabel = "Years"
    }
  }

  selectCategory(ev) {
    this.xAxisLabelData();

    let data = {
      type: ev.type,
      date: this.data.date
    }
    this.GraphsVehicleData(data);
  }

  onDate(ev) {

    let data = {
      type: this.data.type,
      date: ev.value
    }

    this.GraphsVehicleData(data);

  }

  GraphsVehicleData(obj) {

    let dateObj = moment(obj.date).format('YYYY-MM-DD');
    this.loading_graph = true;

    this.analytics = analyticsData;

    let data = {
      type: obj.type,
      date: dateObj,
      company_id: this.company_id
    }

    this.commonService.graphsVehicleData(data).subscribe((res) => {
      if (res["success"] == 1) {
        this.analytics = res["data"];
        //console.log(res["data"]);
        if (this.analytics.length == 0) {
          this.loading_graph = true;
        } else {
          this.loading_graph = false;
        }
      } else {
        this.loading_graph = true;
        this.analytics = analyticsData;
      }
    })
  }


  dashboardCount() {
    this.data_count = this.noentry;
    //this.data_disk = disk_space;

    let obj = {
      company_id: this.company_id
    };

    this.commonService.getDashboardCount(obj).subscribe((res) => {
      if (res["success"] == 1) {
        let obj = res["data"];

        this.data_count = obj;

        this.data_disk = [
          {
            "name": "Entry",
            "value": obj.entry
          },
          {
            "name": "Exit",
            "value": obj.exit
          }
        ];
      } else {
        //this.data_disk = disk_space;
        this.data_count = this.noentry;
      }
    })
  }

  vehicleDataChanged(newObj) {

    if (newObj == undefined || newObj == '') {
      this.dashboardCount();
      //this.globalService.showMessage("Enter Vehicle No.")
    } else {
      let obj = {
        "vehicle_reg_no": newObj,
        "company_id": this.company_id
      }
      this.commonService.getPieSearchData(obj).subscribe(res => {

        if (res["success"] == 1) {

          this.data_disk = [
            {
              "name": "Entry",
              "value": res["entry"]
            },
            {
              "name": "Exit",
              "value": res["exit"]
            }
          ];
        } else {
          this.data_disk = disk_space;
        }

      },
        err => {
          console.log(err);
        });
    }
  }

  showReportData(title) {
    //console.log(title);

    let currentdate = new Date();

    let date = moment(currentdate).format('YYYY-MM-DD');


    let dialogRef = this.dialog.open(TilesListDialogComponent, {
      width: '90%',
      data: { date, title: title }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  ngAfterViewChecked() {
    let analytics = this.analytics;
    let data_disk = this.data_disk;
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      if (this.analytics != undefined) {
        this.analytics = [...analytics];
      }

      if (this.data_disk != undefined) {
        this.data_disk = [...data_disk];
      }
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

  onSelectDisk(event) {
    let eventname = event.name
    let title = eventname.toLowerCase();
    this.showReportData(title);
  }

  onSelectGraph(event) {
    if (this.data.type == 'daily') {
      let date = moment(event.name).format('YYYY-MM-DD');
      let dialogRef = this.dialog.open(GraphListDialogComponent, {
        width: '90%',
        data: { date, title: event.series }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed');
      });
    } 
  }
}
