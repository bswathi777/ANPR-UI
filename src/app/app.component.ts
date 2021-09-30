import { Component, ViewChild } from '@angular/core';
import { AppSettings } from './app.settings';
import { Settings } from './app.settings.model';
import { GlobalServices } from './services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public settings: Settings;
  path: any = this.globalService.path;
  constructor(public appSettings: AppSettings, private globalService: GlobalServices, private router: Router) {
    this.settings = this.appSettings.settings;
  }

  getLogo() {
    
    let user = this.globalService.getLocalItem('ANPRAuthentication', true);

    if (user == null) {
      return "assets/img/mainlogo.svg";
    } else {
      let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));

      if (this.router.url === '/main-dashboard') {
        return "assets/img/mainlogo.svg";
      } else {
        if ( !company_dataitem || company_dataitem.company_logo == "") {
          return "assets/img/mainlogo.svg";
        } else {
          return (this.path + company_dataitem.company_logo);
        }
      }

    }
  }

  ngOnInit() { 
    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    console.log(company_dataitem,"company_dataitem");
    
  }
}