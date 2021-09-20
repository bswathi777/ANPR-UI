import { DataSource } from '@angular/cdk/collections';
import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { TablesService } from '../../tables/tables.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { Subscription, interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ImageDialogComponent } from '../../reports/report-dialog/report-dialog.component';
import { PlateImageDialogComponent } from '../../reports/platereport-dialog/platereport-dialog.component';
import { Router } from '@angular/router';

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-todo',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [TablesService]
})
export class VehicleListComponent implements OnInit {
  public todoList: Array<any>;
  public newTodoText: string = '';

  public displayedColumns = ['vehicle_in_time', 'vehicle_reg_no', 'vehicle_image', 'number_plate_image'];
  public dataSource: any;
  public settings: Settings;

  entry_icon = "entry";
  exit_icon = "exit";

  company_id: any;

  path: any = this.globalService.path;

  private updateSubscription: Subscription;
  dataSource1: any = [];
  emptyData: string;

  config: IntersectionObserverInit;
  placeholderOne: string;

  constructor(public appSettings: AppSettings, private commonService: CommonServices,
    private globalService: GlobalServices, public dialog: MatDialog, public router: Router) {
    this.settings = this.appSettings.settings;
   
    this.placeholderOne = '#BBBBBB';

    this.config = {
      rootMargin: '0px 0px 200px 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;

    this.getVehicleList();

    this.updateSubscription = interval(300000).subscribe(
      (val) => {
        //console.log(val);
        this.getVehicleList();
      }
    )
  }

  ngOnInit() {
    /* this.dataSource.filterPredicate = (data: Element, filter: string) => {
      console.log(data)
      return data.name == filter;
     }; */
  }

  

  getVehicleList() {
    this.emptyData = "Loading..";
    let obj = {
      company_id: this.company_id
    };
    this.commonService.getDashboardVehicleList(obj).subscribe((res) => {
      if (res['success'] == 1) {
        this.dataSource = new MatTableDataSource(res["data"]);
        this.dataSource1 = res["data"];
        this.emptyData = "No Records Found";
      }
      else {
        this.globalService.showErrorMessage(res['message']);
        this.emptyData = "No Records Found";
      }
    },
      (err) => {

        console.log(err);
        this.router.navigate(['/error']);
      })
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
  setupFilter(column: string) {
    this.dataSource.filterPredicate = (d: any, filter: string) => {
      const textToSearch = d[column] && d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    };
  }


}
