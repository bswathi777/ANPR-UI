import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { CovidReportDialogComponent } from '../covid-report-dialog/covid-report-dialog.component';
import { CommonServices } from 'src/app/services/common.services';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-covid-overall-report',
  templateUrl: './covid-overall-report.component.html',
  styleUrls: ['./covid-overall-report.component.scss']
})
export class CovidOverallReportComponent implements OnInit {
  data: any = {}; 
  bannerType:string;
  public overallRes;
  public covidList;
  public totalSize = 0;
  public pageNumber = 0;
  public pageSize = 10;
  noMask:boolean = false;
  dataObj = {};
  public mask = 0;
  public social = 0;
  public startDateTime:any = 0;
  public endDateTime:any = 0
  noSocialDistance:boolean = false;
  constructor(public dialog: MatDialog,private commonService:CommonServices,
    public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.dataObj = {
      "company_id": 0,
      "camera_id": 0,
      "no_mask": this.mask,
      "no_social_distance": this.social,
      "start_date": 0,
      "end_date": 0,
      "page_no": this.pageNumber,
      "limit" : this.pageSize
    }
    this.bannerType = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.bannerType == '1'){
      this.noMask = true;
      this.noSocialDistance  = true;
      this.dataObj['no_mask'] = 1;
      this.dataObj['no_social_distance'] = 1;
    }
    else if(this.bannerType == '2'){
      this.noMask = true;
      this.dataObj['no_mask'] = 1;
    }
    else{
      this.noSocialDistance = true;
      this.dataObj['no_social_distance'] = 1;
    }
    this.getReportdata(this.dataObj);
  }

  sendReport(): void {
    let dialogRef = this.dialog.open(CovidReportDialogComponent, {
      data: 'test',
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onDate(event) {
    this.startDateTime = moment(event.value[0]).format('YYYY-MM-DD HH:mm:ss');
    this.endDateTime = moment(event.value[1]).format('YYYY-MM-DD HH:mm:ss');
    console.log('st' + this.startDateTime, 'end' + this.endDateTime);
  }


  NoMask(event){
    this.mask = event.checked ? 1 : 0
    this.dataObj = {
      "company_id": 0,
      "camera_id": 0,
      "no_mask": this.mask,
      "no_social_distance": this.social,
      "start_date": 0,
      "end_date": 0,
      "page_no": this.pageNumber,
      "limit" : this.pageSize
    }
    this.getReportdata(this.dataObj);
  }

  getReportdata(data){
    this.commonService.getCovidOverallReport(data).subscribe(res => {
      this.overallRes = res['data'];
      this.totalSize = res['count'];
      this.covidList = new MatTableDataSource(this.overallRes);
    })
  }

  PageChange(event){
    this.pageNumber = event.page_no;
    this.pageSize = event.limit;
    this.totalSize
    this.dataObj = {
      "company_id": 0,
      "camera_id": 0,
      "no_mask": this.mask,
      "no_social_distance": this.social,
      "start_date": 0,
      "end_date": 0,
      "page_no": this.pageNumber,
      "limit" : this.pageSize
    }
    this.getReportdata(this.dataObj);
  }

  NoSocialDistance(event){
    this.social = event.checked ? 1 : 0
    this.dataObj = {
      "company_id": 0,
      "camera_id": 0,
      "no_mask": this.mask,
      "no_social_distance": this.social,
      "start_date": 0,
      "end_date": 0,
      "page_no": this.pageNumber,
      "limit" : this.pageSize
    }
    this.getReportdata(this.dataObj);
  }

}
