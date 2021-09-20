import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonServices } from 'src/app/services/common.services';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';
import { GlobalServices } from 'src/app/services/global.service';
import * as moment from 'moment';

@Component({
  selector: 'app-covid19',
  templateUrl: './covid19.component.html',
  styleUrls: ['./covid19.component.scss']
})
export class Covid19Component implements OnInit {
  public companyId: number;
  public userMeets = [];
  public showInformationCards: boolean = false;
  public bannerData = [
    {
      "class": "gradient-orange tile p-2",
      "icon": "timeline",
      "prop": "total"
    },
    {
      "class": "gradient-red tile p-2",
      "icon": "public_off",
      "prop": "no mask"
    },
    {
      "class": "gradient-gray tile p-2",
      "icon": "group",
      "prop": "no social distance"
    }
  ];
  public covidOverallData$: any;
  public covidBuildingData: any;
  public covidDailyUpdate: any;
  public covidMonthlyUpdate: any;
  public bannerType: number;
  public overallRes;
  public covidList;

  constructor(private router: Router, private route: ActivatedRoute,
    private commonService: CommonServices, private globalServices: GlobalServices) {
    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.companyId = company_dataitem.id;
  }

  ngOnInit() {
    this.getCovidDailyUpdate(0);
    this.getCovidMonthlyUpdate(0);
    this.getCovidOverallData();
    this.getOverallCount();
    this.getOverallReportData();
    this.getPeoplemeets();
  }

  showReportData(index: number) {
    this.bannerType = index + 1;
    this.router.navigate([`../reports/${this.bannerType}`], { relativeTo: this.route });
  }

  getCovidDailyUpdate(bid: number) {
    let dataObj = {
      "building_id": bid
    }
    this.commonService.getCovidDailyReport(dataObj).subscribe(dailyRes => {
      this.covidDailyUpdate = dailyRes['data'];
    })
  }

  getOverallReportData() {
    let dataObj =
    {
      "company_id": 0,
      "camera_id": 0,
      "no_mask": 1,
      "no_social_distance": 1,
      "start_date": 0,
      "end_date": 0,
      "page_no": 0,
      "limit": 10
    };
    this.commonService.getCovidOverallReport(dataObj).subscribe(res => {
      this.overallRes = res['data'];
      this.covidList = new MatTableDataSource(this.overallRes);
    })
  }


  getCovidMonthlyUpdate(bid: number) {
    let dataObj = {
      "building_id": bid
    }
    this.commonService.getCovidMonthlyReport(dataObj).subscribe(monthlyRes => {
      this.covidMonthlyUpdate = monthlyRes['data'];
    })
  }

  getCovidOverallData() {
    this.commonService.getCovidOverallData().subscribe(res => {
      this.covidOverallData$ = res['data'];
    })
  }

  getPeoplemeets() {
    let user = this.globalServices.getLocalItem('ANPRAuthentication', true)['data'];
    let obj = {
      "user_id": user['employee_id'],
      "date": moment(new Date()).format(`YYYY-MM-DD`)
    }
    this.commonService.getCovidPeopleMeet(obj).subscribe(res => {
      this.userMeets = [];
      let meetingInfo = res['data'];
      if (meetingInfo.length != 0) {
        // console.log(meetingInfo);
        let rootUser = {}
        rootUser['id'] = meetingInfo.userId;
        rootUser['Label'] = meetingInfo.name;
        rootUser["fill"] = "red";
        rootUser["branch"] = "Root";
        this.userMeets.push(rootUser);
        meetingInfo.meetings.map((meetedUser) => {
         this.userMeets.push({ 'id': meetedUser.userId, 'Label': meetedUser.name, 'parentId': rootUser['id'], 'branch': 'Left' })
        });
      }
    })
  }

  getOverallCount() {
    this.commonService.getCovidOverallCount().subscribe(count => {
      if (count != undefined) {
        this.bannerData.map((banner, index) => {
          if (banner.prop == 'total') {
            this.bannerData[index]['value'] = count['data'].total;
          }
          else if (banner.prop == 'no mask') {
            this.bannerData[index]['value'] = count['data'].noMask;
          }
          else
            this.bannerData[index]['value'] = count['data'].noSocialDistance;
        })
      }
    })
  }

  MatTabClick(event) {
    switch (event.index) {
      case 0:
        this.showInformationCards = false;
        this.getCovidOverallData();
        this.getCovidDailyUpdate(event.bid);
        this.getCovidMonthlyUpdate(event.bid);
        break;
      case 1:
        this.showInformationCards = false;
        let dataObj1 = {
          "building_id": event.bid
        }
        this.commonService.getCovidBuildingReport(dataObj1).subscribe(res => {
          this.covidBuildingData = res;
        });
        this.getCovidDailyUpdate(event.bid);
        this.getCovidMonthlyUpdate(event.bid);
        break;
      case 2:
        this.showInformationCards = true;
        this.getPeoplemeets();
      default:
        break;
    }
  }

}
