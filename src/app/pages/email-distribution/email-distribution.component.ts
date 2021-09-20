import { Settings } from './../../app.settings.model';
import { AppSettings } from './../../app.settings';
import { Component, ViewChild, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialogRef } from '@angular/material';
import { CommonServices } from '../../services/common.services';
import { GlobalServices } from '../../services/global.service';
import { MatDialog } from '@angular/material';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-emaildist',
  templateUrl: './email-distribution.component.html',
  styleUrls: ['./email-distribution.component.css']
})
export class EmailDistributionComponent implements OnInit, AfterViewInit {

  dataloading: boolean;


  emptyData: string = "No Records Found";

  path: any = this.globalService.path;


  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  public displayedColumns = ['email', 'company_name', 'group', 'added_by', 'action'];

  public settings: Settings;

  pageSizeOptions: number[];
  pageSize: number;
  totalRecords: any;

  data: any = {};

  vehicleList: any = [];

  company_id: any;

  dialogRef: MatDialogRef<ConfirmDeleteComponent>;



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

  }

  getVehicleList(event) {

    //console.log(event);

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

    this.commonService.getEmailDistribution(obj).subscribe((res) => {
      if (res['success'] == 1) {
        this.vehicleList = res["data"];
        this.totalRecords = res["count"];

        this.dataloading = true;
        this.emptyData = "No Records Found";
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

  ngAfterViewInit() {

  }

  deleteEmailDistribution(data) {
    //console.log(data);
    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: false
    });


    this.dialogRef.componentInstance.title = "Email ID: "+data.email;
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.dialogRef.componentInstance.note = "";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let obj = {
          "id": data.id
        }
        this.commonService.deleteEmailDistribution(obj).subscribe(res => {
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

}