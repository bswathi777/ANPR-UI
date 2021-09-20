import { ImageDialogComponent } from './../report-dialog/report-dialog.component';
import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { environment } from './../../../../environments/environment.prod';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatPaginator, MatDialog } from '@angular/material';
import { PlateImageDialogComponent } from '../platereport-dialog/platereport-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicleno-dialog',
  templateUrl: './vehicleno-dialog.component.html',
  styleUrls: ['./vehicleno-dialog.component.scss']
})
export class VehicleNumberDialogComponent implements OnInit {
  vehicleurl: any;

  path: any = this.globalService.path;

  anprList: any = [];
  totalRecords: any;
  dataloading: boolean;

  pageSizeOptions: any = [10];
  pageSize: number;

  entry_icon = "entry";
  exit_icon = "exit";


  emptyData: string = "No Records Found";


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public displayedColumns = ['date', 'vehicle_status', 'vehicle_licence_no', 'vehicle_type', 'vehicle_in_time', 'vehicle_image', 'number_plate_image'];

  company_id: any;
  regno: any;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<VehicleNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonServices,
    private globalService: GlobalServices, public router: Router) {
    //console.log(data)

    this.vehicleurl = this.path + data.vehicle_image;

    //console.log(data.vehicle_reg_no);

    this.regno;

    if(data.vehicle_number == undefined){
      this.regno = this.data.vehicle_reg_no;
    }else{
      this.regno = this.data.vehicle_number;
    }

    let dataObj = {
      "reg_number": this.regno,
    }

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;

    this.getVehicleList(dataObj)

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
      "date": "",
      "reg_number": data.reg_number || this.data.vehicle_reg_no || this.data.vehicle_number,
      "from_time": "",
      "to_time": "",
      "bike": true,
      "car": true,
      "entry": true,
      "exit": true,
      "size_of_page": size,
      "offset": offset
    };

    this.commonService.getReportList(obj).subscribe((res) => {
      if (res['success'] == 1) {

        this.anprList = res["data"];
        //console.log(this.anprList);


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
        this.router.navigate(['/error']);
        console.log(err);
      })
  }

  ngOnInit() {
  }

  openDialog1(element): void {
    let dialogRef = this.dialog.open(PlateImageDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  openDialog(element): void {
    let dialogRef = this.dialog.open(ImageDialogComponent, {
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
