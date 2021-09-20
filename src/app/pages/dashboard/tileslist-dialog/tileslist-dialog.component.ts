import { PlateImageDialogComponent } from './../../reports/platereport-dialog/platereport-dialog.component';
import { ImageDialogComponent } from './../../reports/report-dialog/report-dialog.component';
import { CommonServices } from './../../../services/common.services';
import { GlobalServices } from './../../../services/global.service';
import { environment } from './../../../../environments/environment';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatDialog } from '@angular/material';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tileslist-dialog',
  templateUrl: './tileslist-dialog.component.html',
  styleUrls: ['./tileslist-dialog.component.scss']
})
export class TilesListDialogComponent implements OnInit {
  vehicleurl: any;

  path: any = this.globalService.path;

  anprList: any = [];
  totalRecords: any;
  dataloading: boolean;

  pageSizeOptions: any = [10];
  pageSize: number;

  entry_icon = "entry";
  exit_icon = "exit";
  //date = Date.now();
  date = this.data1.date;
  title: string;
  vehicle_reg_no: string;

  emptyData: string = "No Records Found";


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public displayedColumns = ['vehicle_reg_no','vehicle_status', 'vehicle_licence_no', 'vehicle_type', 'vehicle_in_time', 'vehicle_image', 'number_plate_image'];
  company_id: any;


  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<TilesListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any, private commonService: CommonServices, public router: Router, 
    private globalService: GlobalServices) {

    this.title = data1.title;

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;

    let dataObj = {
      "company_id": this.company_id
    }

    this.getVehicleList(dataObj);

  }

  getVehicleList(data) {

    this.emptyData = "Loading";

    let size;
    let offset;
    if (data.pageSize != undefined) {
      size = data.pageSize;
      offset = data.pageIndex + 1;
    }
    else {
      size = 10;
      offset = 1;
    }

    let obj;

    obj = {
      "company_id": this.company_id,
      "type": this.title,
      "size_of_page": size,
      "offset": offset
    };

    this.commonService.getCountReports(obj).subscribe((res) => {
      if (res['success'] == 1) {

        this.anprList = res["data"];

        this.totalRecords = res["count"];

        if (this.totalRecords == 0) {
          this.dataloading = false;
          this.emptyData = "No Records Found";
        } else {
          this.dataloading = true;
        }
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

  ngOnInit() {
  }

  openDialog(element): void {

    let dialogRef = this.dialog.open(ImageDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  openDialog1(element): void {
    let dialogRef = this.dialog.open(PlateImageDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }


  dialogClose() {
    this.dialogRef.close();
  }
}
