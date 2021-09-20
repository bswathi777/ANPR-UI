import { VehicleNumberDialogComponent } from './../../reports/vehicleno-dialog/vehicleno-dialog.component';
import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { TablesService } from '../../tables/tables.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Subscription, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-trackingvehicle',
  templateUrl: './tracking-vehicle.component.html',
  styleUrls: ['./tracking-vehicle.component.scss']
})
export class TrackingVehicleComponent implements OnInit {
  public todoList: Array<any>;
  public newTodoText: string = '';

  public displayedColumns = ['vehicle_number', 'alert_event', 'group'];
  public dataSource: any;
  public settings: Settings;

  entry_icon = "entry";
  exit_icon = "exit";

  company_id: any;

  path: any = this.globalService.path;
  emptyData: string;
  dataSource1: any = [];

  constructor(public appSettings: AppSettings, private commonService: CommonServices,
    private globalService: GlobalServices, public dialog: MatDialog, public router: Router) {
    this.settings = this.appSettings.settings;
   

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;

    this.getVehicleList();

  }

  ngOnInit() {
    
  }



  getVehicleList() {
    this.emptyData = "Loading..";
    let obj = {
      "company_id": this.company_id,
      "size_of_page": 20,
      "offset": 1
    };
    this.commonService.getVehicleTracking(obj).subscribe((res) => {
      if (res['success'] == 1) {
        this.emptyData = "No Records Found";
        this.dataSource = new MatTableDataSource(res["data"]);
        this.dataSource1 = res["data"];
      }
      else {
        this.emptyData = "No Records Found";
        this.globalService.showErrorMessage(res['message'])
      }
    },
      (err) => {

        console.log(err);
        this.router.navigate(['/error']);
      })
  }

  openVehicleNoDialog(element): void {
    //console.log(element);
    let dialogRef = this.dialog.open(VehicleNumberDialogComponent, {
      width: '80%',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
    });
  }

  applyFilter(filterValue: string) {
    //this.dataSource.filter = filterValue.trim().toLowerCase();
    //this.dataSource.filter = filterValue;

    let strFirstThree = filterValue.length;

    if (strFirstThree >= 3) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else if (strFirstThree == 0) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    //console.log(filterValue)
  }


}
