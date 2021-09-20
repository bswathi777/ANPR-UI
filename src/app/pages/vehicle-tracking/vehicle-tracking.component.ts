import { ConfirmDeleteComponent } from './../confirm-delete/confirm-delete.component';
import { AddTrackingVehicleComponent } from './add-trackingvehicle/add-trackingvehicle.component';

import { environment } from './../../../environments/environment.prod';
import { Settings } from './../../app.settings.model';
import { AppSettings } from './../../app.settings';
import { Component, ViewChild, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialogRef } from '@angular/material';
import { CommonServices } from '../../services/common.services';
import { GlobalServices } from '../../services/global.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface Element {
  id: string;
  vehicle_number: string;
  company_name: string;
  name: string;
  group: string;
  alert_event: string;
  notification_type: string;
  created_by: string;
  vehicle_time: string;
  comments: string;
  show: boolean;
}

@Component({
  selector: 'app-vehicle-tracking',
  templateUrl: './vehicle-tracking.component.html',
  styleUrls: ['./vehicle-tracking.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VehicleTrackingComponent implements OnInit, AfterViewInit {

  dataloading: boolean;
  emptyData: string = "No Records Found";
  path: any = this.globalService.path;

  @ViewChild(MatPaginator, { static: true }) customPaginator: MatPaginator;

  public displayedColumns = ['vehicle_number', 'name', 'group', 'alert_event', 'comments', 'action'];

  public settings: Settings;

  pageSizeOptions: number[];
  pageSize: number;
  totalRecords: any;

  data: any = {};

  vehicleList: any = [];

  company_id: any;

  dialogRef: MatDialogRef<ConfirmDeleteComponent>;

  vehicledata: Element[];

  trackingListData: any = [];

  show_deleteemail: boolean = false;


  dataSource: MatTableDataSource<any>;

  isExpansionDetailRow = (i: number, row: Object) => {
    //console.log(row);
    return row.hasOwnProperty('detailRow');
  }
  expandedElement: any;

  constructor(public appSettings: AppSettings,
    private commonService: CommonServices,
    private globalService: GlobalServices,
    public dialog: MatDialog,
    public router: Router) {
    this.settings = this.appSettings.settings;

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;

    //this.pageSizeOptions = this.globalService.pageSizeOptions;
    this.pageSize = this.globalService.pageSize

  }

  ngOnInit() {

    this.getVehicleList(1);

    if(this.customPaginator != undefined){
      this.dataSource.paginator = this.customPaginator;
    }
  }

  getVehicleList(event) {


    this.vehicleList = [];

    this.emptyData = "Loading..";

    let size;
    let offset;
    if (event.pageSize != undefined) {
      size = event.pageSize;
      offset = event.pageIndex + 1;
    }
    else {
      size = 25;
      offset = 1;
    }

    let obj = {
      "company_id": this.company_id,
      "size_of_page": size,
      "offset": offset
    };

    this.commonService.getVehicleTracking(obj).subscribe((res) => {
      if (res['success'] == 1) {
        this.emptyData = "No Records Found";
        this.dataloading = true;
        this.trackingListData = res['data'];

        this.vehicledata = res['data'];
        this.totalRecords = res["count"];
        const rows = [];
        this.vehicledata.forEach(element => rows.push(element, { detailRow: true, element }));
        this.dataSource = new MatTableDataSource(rows);

      }
      else {
        this.emptyData = "No Records Found";
        this.dataloading = false;
        this.globalService.showErrorMessage(res['message'])
      }
    },
      (err) => {
        this.dataloading = false;
        console.log(err);
        this.router.navigate(['/error']);
      })
  }

  getRows() {
    const rows = [];

    console.log(this.vehicledata);

    this.vehicledata.forEach(element => rows.push(element, { detailRow: true, element }));

    return rows;
  }

  toggleRow(value: Element) {
    const foundElement = this.dataSource.data.find(elem => elem !== undefined && elem.id === value.id)
    const index = this.dataSource.data.indexOf(foundElement);
    //console.log(index);
    this.dataSource.data[index].show = !this.dataSource.data[index].show;
  }

  deleteEmail(data, email) {


    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: false
    });
    let vehicle = data.vehicle_number;
    let vehicleno = vehicle.toUpperCase();


    this.dialogRef.componentInstance.title = "Email ID: " + email;
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.dialogRef.componentInstance.note = "";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.show_deleteemail = true;
        let obj = {
          "vehicle_number": data.vehicle_number,
          "email": email,
          "company_location": data.company_name
        }
        this.commonService.deleteEmailID(obj).subscribe(res => {
          if (res['success'] == '1') {
            this.show_deleteemail = false;
            this.globalService.showSuccessMessage(res['message']);
            this.getVehicleList(1);

          } else if (res['success'] == '0') {
            this.show_deleteemail = false;
            this.globalService.showMessage(res['message']);
          }
        },
          err => {
            this.show_deleteemail = false;
            console.log(err);
          });

      }
      this.dialogRef = null;
    });

  }

  ngAfterViewInit() {

  }

  deleteTracking(data) {

    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: false
    });
    let vehicle = data.vehicle_number;
    let vehicleno = vehicle.toUpperCase();


    this.dialogRef.componentInstance.title = "Vehicle No: " + vehicleno;
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.dialogRef.componentInstance.note = "";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let obj = {
          "id": data.id
        }
        this.commonService.deleteVehicleTracking(obj).subscribe(res => {
          if (res['success'] == '1') {

            this.globalService.showSuccessMessage(res['message']);
            this.getVehicleList(1);

          } else if (res['success'] == '0') {
            this.globalService.showMessage(res['message']);
          }
        },
          err => {
            console.log(err);
          });

      }
      this.dialogRef = null;
    });
  }

  addVehicle(): void {
    let dialogRef = this.dialog.open(AddTrackingVehicleComponent, {
      data: ''
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      this.getVehicleList(1);
    });
  }



}