import { CommonServices } from './../../../services/common.services';
import { GlobalServices } from './../../../services/global.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApplicationsComponent implements OnInit {

  appname: any;
  show_app: boolean;
  menuList: any;
  show_length: any;

  arrayExp: any;

  constructor(private globalServices: GlobalServices, private commonService: CommonServices, public snackBar: MatSnackBar) {
    let user = this.globalServices.getLocalItem('ANPRAuthentication', true)['data'];
    this.appname = user['app_details']['app_name'];

    this.arrayExp = ['gradient-purple', 'gradient-indigo', 'gradient-blue'];
   
  }

  ngOnInit() {
    this.getMenuList();
  }

  getMenuList(): void {
    let obj = {
      "app_name": this.appname
    }
    this.commonService.getMenulist(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.show_app = true;
        this.menuList = res['details'];
      } else {
        this.show_app = false;
      }
    },
      err => {
        this.show_app = false;
        console.log(err);
      });
  }

  getMenuID(app_name) {
    let obj = {
      "app_name": app_name
    }
    this.commonService.getAppUrl(obj).subscribe(res => {

      if (res['success'] == '1') {
        let app_id = res['data']['app_details']['app_id'];
        let app_url = res['data']['app_details']['app_url'];

        let btoa_data = btoa(JSON.stringify(res));
        let atob_token = atob(btoa_data);

        window.location.href = app_url + "/reload?code=" + app_id + "&response_type=" + btoa_data + "&redirect_uri=" + this.globalServices.domain;

      } else if (res['success'] == '0') {
        this.snackBar.open(res['message'], "close", {
          duration: 2000,
        });
      }
    },
      err => {
        console.log(err);
      });
  }

}