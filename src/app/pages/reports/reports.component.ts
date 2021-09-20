import { ConfirmDeleteComponent } from './../confirm-delete/confirm-delete.component';
import { PlateImageDialogComponent } from './platereport-dialog/platereport-dialog.component';
import { ImageDialogComponent } from './report-dialog/report-dialog.component';
import { environment } from './../../../environments/environment.prod';
import { Settings } from './../../app.settings.model';
import { AppSettings } from './../../app.settings';
import { Component, ViewChild, AfterViewInit, OnInit, ViewChildren, QueryList, ContentChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialogRef } from '@angular/material';
import { CommonServices } from '../../services/common.services';
import { GlobalServices } from '../../services/global.service';
import { MatDialog } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { VehicleNumberDialogComponent } from './vehicleno-dialog/vehicleno-dialog.component';
import { Router } from '@angular/router';
import { EditReportDialogComponent } from './edit-report-dialog/edit-report-dialog.component';
import { PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { interval } from 'rxjs';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export interface Regno {
  vehicle_reg_no: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  // changeDetection:ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit, AfterViewInit {

  anprList: any = [];
  pdfDoc: any;
  dialogRef: MatDialogRef<ConfirmDeleteComponent>;
  regnos: Observable<Regno[]>;
  myControl = new FormControl();
  options: Regno[] = []

  dataloading: boolean;

  public pageSize = 25;
  public currentPage = 0;
  public totalSize = 0;

  pageSizeOptions: number[];

  updateSubscription: Subscription;

  emptyData: string = "Loading..";

  path: any = this.globalService.path;

  isDisabledDate: boolean = false;
  isDisabledDateTime: boolean = false;

  public max;
  public maxDate: any = new Date();

  entry_icon = "entry";
  exit_icon = "exit";

  bikeChecked: boolean = false;
  carChecked: boolean = false;


  @ContentChild(MatPaginator, { static: true }) matpaginator: MatPaginator;

  // 'vehicle_licence_no',
  public displayedColumns = ['date', 'vehicle_reg_no', 'api_vehicle_reg_no', 'model_vehicle_reg_no', 'vehicle_type', 'vehicle_in_time', 'vehicle_image', 'number_plate_image', 'action', 'comments'];

  public settings: Settings;

  data: any = {};
  public todayDate: any = new Date();
  anprListData: any = [];
  date1: FormControl;

  date = new Date();
  ngModelDate: Date;

  company_id: any;

  defaultImage = "assets/img/page_loading.gif";

  config: IntersectionObserverInit;
  placeholderOne: string;

  show_err_msg: boolean;

  isTimerStart: boolean = false;
  source;
  subscribe;
  previousDate;
  currentDate;

  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;

  constructor(public appSettings: AppSettings,
    private commonService: CommonServices,
    private globalService: GlobalServices,
    public dialog: MatDialog,
    public router: Router,
    public cd: ChangeDetectorRef) {
    this.settings = this.appSettings.settings;

    this.placeholderOne = '#BBBBBB';

    this.config = {
      rootMargin: '0px 0px 200px 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;



  }

  ngOnInit() {
    this.previousDate = new Date();

    this.anprList.paginator = this.matpaginator;
    this.anprListData.paginator = this.matpaginator;
    this.data.date = new Date();
    this.paginationData();
    let dateFormat = moment(this.data.date).format('YYYY-MM-DD');
    let dataObj = {
      date: dateFormat
    }

    this.getVehicleList(dataObj);

    this.regnos = this.myControl.valueChanges
      .pipe(
        startWith<string | Regno>(''),
        map(value => typeof value === 'string' ? value : value.vehicle_reg_no),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    //this.getDataMessage();

  }

  ngOnChanges() {
    this.cd.detectChanges();
  }

  update(el: any, pop_data: string) {
    if (pop_data == "success") {
      let dateFormat;
      if (this.data.date == "") {
        dateFormat = "";
      } else {
        dateFormat = moment(this.data.date).format('YYYY-MM-DD');
      }

      let dataObj = {
        date: dateFormat
      }
      this.getVehicleList(dataObj);
    }
  }

  onDate(ev) {
    let date = ev.value;
    let dateFormat;

    if (ev.value == null) {
      dateFormat = "";
    } else {
      dateFormat = moment(date).format('YYYY-MM-DD');
    }

    this.data.range = "";

    let dataObj = {
      "date": dateFormat,
      "reg_number": this.data.reg_number || '',
      "from_time": '',
      "to_time": ''
    }
    this.getVehicleList(dataObj);
  }

  onStartDateSelect(event) {

    let fromDate;
    let toDate;

    if (event.value[0] != null && event.value[1] != null) {
      this.data.date = "";

      fromDate = moment(event.value[0]).format('YYYY-MM-DD HH:mm:ss');
      toDate = moment(event.value[1]).format('YYYY-MM-DD HH:mm:ss');

      let dataObj = {
        "date": '',
        "from_time": fromDate || '',
        "to_time": toDate || ''
      }

      this.getVehicleList(dataObj);

    } else {
      fromDate = "";
      toDate = "";
      this.globalService.showMessage("From Date and To Date field are mandatory")
    }
  }

  showBikeData(event) {
    this.getCheckboxChange();
  }

  showCarData(event) {
    this.getCheckboxChange();
  }

  showEntryData(event) {
    this.getCheckboxChange();
  }

  showExitData(event) {
    this.getCheckboxChange();
  }

  getCheckboxChange() {
    let range = this.data.range;
    let dateFormat;

    let fromDate, toDate;

    if (this.data.date == undefined || this.data.date == '') {
      dateFormat = '';
    } else {
      dateFormat = moment(this.data.date).format('YYYY-MM-DD');
    }

    if (this.data.range == undefined) {
      fromDate = '';
      toDate = '';
    } else {
      fromDate = moment(range[0]).format('YYYY-MM-DD HH:mm:ss');
      toDate = moment(range[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    let dataObj;

    if (this.data.date != '') {

      dataObj = {
        "date": dateFormat || '',
        "from_time": '',
        "to_time": '',
        "bike": this.data.bike,
        "car": this.data.car,
        "entry": this.data.entry,
        "exit": this.data.exit
      }
    } else {
      dataObj = {
        "date": '',
        "from_time": fromDate || '',
        "to_time": toDate || '',
        "bike": this.data.bike,
        "car": this.data.car,
        "entry": this.data.entry,
        "exit": this.data.exit
      }
    }

    this.getVehicleList(dataObj);
  }

  handlePage(e: any) {
    console.log(e)
    this.currentPage = e.pageIndex;
    this.pageSize = e.pageSize;
    let range = this.data.range;
    let dateFormat;

    let fromDate, toDate;

    if (this.data.date == undefined || this.data.date == '') {
      dateFormat = '';
    } else {
      dateFormat = moment(this.data.date).format('YYYY-MM-DD');
    }

    if (this.data.range == undefined) {
      fromDate = '';
      toDate = '';
    } else {
      fromDate = moment(range[0]).format('YYYY-MM-DD HH:mm:ss');
      toDate = moment(range[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    let dataObj;

    if (this.data.date != '') {

      dataObj = {
        "date": dateFormat || '',
        "from_time": '',
        "to_time": '',
        "bike": this.data.bike,
        "car": this.data.car,
        "entry": this.data.entry,
        "exit": this.data.exit,
        "size": e.pageSize,
        "offset": e.pageIndex + 1
      }
    } else {
      dataObj = {
        "date": '',
        "from_time": fromDate || '',
        "to_time": toDate || '',
        "bike": this.data.bike,
        "car": this.data.car,
        "entry": this.data.entry,
        "exit": this.data.exit,
        "size": e.pageSize,
        "offset": e.pageIndex + 1
      }
    }
    this.getVehicleList(dataObj);
  }

  editReport(data) {
    let dialogRef = this.dialog.open(EditReportDialogComponent, {
      width: '90%',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }

  /* Update comment section  */
  updateComment(el: any, pop_data: string) {
    console.log(pop_data)
    if (pop_data == "success") {
      let dateFormat;
      if (this.data.date == "") {
        dateFormat = "";
      } else {
        dateFormat = moment(this.data.date).format('YYYY-MM-DD');
      }

      let dataObj = {
        date: dateFormat
      }
      this.getVehicleList(dataObj);
    }
  }

  deleteReport(data) {

    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: false
    });
    let vehicle = data.vehicle_reg_no;
    let vehicleno = vehicle.toUpperCase();


    this.dialogRef.componentInstance.title = "Vehicle No: " + vehicleno;
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?";
    this.dialogRef.componentInstance.note = "";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let obj = {
          "hour": data.hour,
          "minute": data.minute,
          "date": data.date_field,
          "vehicle_reg_no": data.vehicle_reg_no
        }
        this.commonService.deleteReportID(obj).subscribe(res => {
          if (res['success'] == '1') {

            this.globalService.showSuccessMessage(res['message']);
            let dateFormat = moment(this.data.date).format('YYYY-MM-DD');
            let dataObj = {
              date: dateFormat
            }


            // this.getVehicleList(dataObj);


            /*  this.anprList = this.anprList.filter((value,key)=>{
               return value.vehicle_reg_no != data.vehicle_reg_no;
             }); */
            console.log(this.anprListData.length);
            this.anprListData = this.anprListData.filter((value, key) => {
              return value.vehicle_reg_no != data.vehicle_reg_no;
            });
            console.log(this.anprListData.length);

            this.anprList = new MatTableDataSource(this.anprListData);

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


  getVehicleList(data: any) {


    this.anprList = new MatTableDataSource([]);
    this.anprListData = [];
    this.emptyData = "Loading..";
    this.dataloading = false;

    let obj;

    obj = {
      "company_id": this.company_id,
      "date": data.date || '',
      "reg_number": data.reg_number || this.data.reg_number || "",
      "from_time": data.from_time || '',
      "to_time": data.to_time || '',
      "bike": data.bike || this.data.bike || false,
      "car": data.car || this.data.car || false,
      "entry": data.entry || this.data.entry || false,
      "exit": data.exit || this.data.exit || false,
      "size_of_page": data.size || 25,
      "offset": data.offset || 1
    };

    this.getDownloadReport(obj);

    this.commonService.getReportList(obj).subscribe((res) => {
      if (res['success'] == 1) {

        this.anprList = new MatTableDataSource(res["data"]);
        this.anprListData = res["data"];
        this.totalSize = res["count"];

        this.paginationData();

        if (this.totalSize == 0) {
          this.dataloading = false;
          this.emptyData = "No Records Found";
        } else if (this.totalSize < 25) {
          this.currentPage = 0;
          this.dataloading = true;
        } else {
          this.dataloading = true;
        }
      }
      else if (res['success'] == 0) {

        this.anprListData = [];

        this.emptyData = res['message'];
        this.dataloading = false;
      }

      // start interval
      if (!this.isTimerStart) {
        this.source = interval(2 * 60 * 1000);
        console.log("interval started", new Date());
        // this.previousDate = this.currentDate;
        this.subscribe = this.source.subscribe(val => {
          this.currentDate = new Date();
          console.log("In Time Interval previousdate && current Date--->", this.previousDate + "current date", this.currentDate)
          let fromDate = moment(this.previousDate).format('YYYY-MM-DD HH:mm:ss');
          let toDate = moment(this.currentDate).format('YYYY-MM-DD HH:mm:ss');

          let dataObj = {
            "date": '',
            "from_time": fromDate || '',
            "to_time": toDate || ''
          }

          this.isTimerStart = true;
          this.getVehicleListInTimer(dataObj);
        });


      }
    },
      (err) => {
        this.dataloading = false;
        console.log(err);
        this.router.navigate(['/error']);

      })
  }

  getVehicleListInTimer(data: any) {
    console.log("called vehicle list from timer ");

    /*  this.anprList = new MatTableDataSource([]);
     this.anprListData = [];
     this.emptyData = "Loading..";
     this.dataloading = false; */

    let obj;

    obj = {
      "company_id": this.company_id,
      "date": data.date || '',
      "reg_number": data.reg_number || this.data.reg_number || "",
      "from_time": data.from_time || '',
      "to_time": data.to_time || '',
      "bike": data.bike || this.data.bike || false,
      "car": data.car || this.data.car || false,
      "entry": data.entry || this.data.entry || false,
      "exit": data.exit || this.data.exit || false,
      "size_of_page": data.size || 25,
      "offset": data.offset || 1
    };

    this.getDownloadReport(obj);

    this.commonService.getReportList(obj).subscribe((res) => {
      if (res['success'] == 1) {
        console.log("Latest data is there");
        if (res.count != 0) {
          console.log(this.anprListData.length);
          res.data.forEach(element => {
            this.anprListData.push(element);
          });
          console.log(this.anprListData.length);
          this.anprList = new MatTableDataSource(this.anprListData);
        } else {
          let obj = {
            "camera_location": "Cyber Towers",
            "camera_name": "reolink511w",
            "date": 1594826752046,
            "date_field": "2020-07-13",
            "day": "Wednesday",
            "driver_image": "",
            "duration_time": "00:00:00",
            "hour": "15",
            "minute": "25",
            "month": "July",
            "number_plate_image": "ANPR/GREENKO CYBER TOWERS/Cyber Towers/2020/July/cropped_2020-07-15/2020-07-15T15_25_52$046404.jpg",
            "vehicle": "car_temppp",
            "vehicle_image": "ANPR/GREENKO CYBER TOWERS/Cyber Towers/2020/July/2020-07-15/2020-07-15T15_25_52$046404.jpg",
            "vehicle_in_time": "2020-07-15 15:25:52.046404",
            "vehicle_licence_no": "",
            "vehicle_out_time": "00:00:00",
            "vehicle_reg_no": "Reg_no",
            "vehicle_status": "entry",
            "vehicle_type": "private",
            "year": "2020"
          }
          console.log(this.anprListData.length);
         /*  this.anprListData.unshift(obj);
          this.anprList = new MatTableDataSource(this.anprListData); */
          console.log(this.anprListData.length);
          console.log("no new data ");
        }
      }
      else if (res['success'] == 0) {
        console.log("no latest data");
      }

    },
      (err) => {
        // this.dataloading = false;
        console.log(err);
        // this.router.navigate(['/error']);

      })
  }




  getDownloadReport(obj) {
    this.commonService.downloadReports(obj).subscribe((res) => {
      if (res['success'] == 1) {
        this.pdfDoc = res['file_path'];
      }
      else {
        this.globalService.showErrorMessage(res['message']);
      }
    },
      (err) => {
        this.dataloading = false;
        console.log(err);
      })
  }

  paginationData() {
    if (this.totalSize <= 25) {
      this.pageSizeOptions = [25];
    } else if (this.totalSize > 100) {
      this.pageSizeOptions = [25, 50, 100];
    } else if (this.totalSize > 25 || this.totalSize <= 50) {
      this.pageSizeOptions = [25, 50];
    } else {
      this.pageSizeOptions = [25, 50, 100];
    }
  }

  ngAfterViewInit() {
    this.anprList.paginator = this.matpaginator;
  }

  displayFn(user) {
    return user;
  }

  vehicleDataChanged(newObj) {
    let strFirstThree = newObj.length;
    let range = this.data.range;
    let date = this.data.date;

    let dateFormat;
    if (date == undefined) {
      dateFormat = '';
    } else {
      dateFormat = moment(date).format('YYYY-MM-DD');
    }

    if (strFirstThree >= 3) {
      let dataObj;
      if (range == undefined || range == '') {
        dataObj = {
          "date": dateFormat,
          "from_time": '',
          "to_time": '',
          "reg_number": newObj || ''
        }
      } else {
        let fromDate = moment(range[0]).format('YYYY-MM-DD HH:mm:ss');
        let toDate = moment(range[1]).format('YYYY-MM-DD HH:mm:ss');
        dataObj = {
          "date": '',
          "from_time": fromDate,
          "to_time": toDate,
          "reg_number": newObj || ''
        }
      }

      this.getVehicleList(dataObj);

    } else if (strFirstThree == 0) {
      let dataObj;
      if (range == undefined || range == '') {
        dataObj = {
          "date": dateFormat,
          "from_time": '',
          "to_time": '',
          "reg_number": newObj || ''
        }
      } else {
        let fromDate = moment(range[0]).format('YYYY-MM-DD HH:mm:ss');
        let toDate = moment(range[1]).format('YYYY-MM-DD HH:mm:ss');
        dataObj = {
          "date": '',
          "from_time": fromDate,
          "to_time": toDate,
          "reg_number": newObj || ''
        }
      }

      this.getVehicleList(dataObj);
    }

  }

  dataChanged(newObj) {

    let obj = {
      "vehicle_reg_no": newObj
    }
    this.commonService.getRegnoDropdown(obj).subscribe(
      res => {
        if (res['success'] == 1) {
          this.options = res['data'];
        } else {
          this.options = [];
          this.getVehicleList({});
        }
      },
      err => {
        console.log(err);
      });
  }

  selectRegnoOption(value) {

    let regno = value.vehicle_reg_no;

    let dateFormat;

    if (this.data.date == undefined) {
      dateFormat = '';
    } else {
      dateFormat = moment(this.data.date).format('YYYY-MM-DD');
    }

    let dataObj = {
      "date": dateFormat,
      "reg_number": regno || ''
    }

    this.getVehicleList(dataObj);
  }

  private _filter(name: string): Regno[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.vehicle_reg_no.toLowerCase().indexOf(filterValue) === 0);
  }

  openDialog(element): void {
    let dialogRef = this.dialog.open(ImageDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDialog1(element): void {
    let dialogRef = this.dialog.open(PlateImageDialogComponent, {
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openVehicleNoDialog(element): void {
    let dialogRef = this.dialog.open(VehicleNumberDialogComponent, {
      width: "90%",
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  docdownload() {
    if (this.pdfDoc != undefined) {
      let link = document.createElement("a");
      link.download = 'Report';
      let res = environment.API_URL + this.pdfDoc;
      link.href = res;
      window.open(res, '_blank');
    } else {
      this.globalService.showErrorMessage("No File Found");
    }
  }


  /* onDestroy hook */
  ngOnDestroy(): void {
    console.log("In destroy method")
    this.subscribe.unsubscribe();

  }

}