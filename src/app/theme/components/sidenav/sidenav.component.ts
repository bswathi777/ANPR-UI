import { MatDialog } from '@angular/material';
import { LiveTrackingComponent } from '../../components/live-tracking/live-tracking.component';
import { GlobalServices } from './../../../services/global.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MenuService]
})
export class SidenavComponent implements OnInit {
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public menuItems: Array<any>;
  public settings: Settings;
  username: string;
  roles: any;
  constructor(public appSettings: AppSettings, public menuService: MenuService, 
    private globalServices: GlobalServices,
    public trackingDialog: MatDialog) {
    this.settings = this.appSettings.settings;
    
    let user = this.globalServices.getLocalItem('ANPRAuthentication', true)['data'];
    this.username = user['firstname']+" "+user['lastname'];
    this.roles = user['app_details']['roles'];
  
  }

  ngOnInit() {
    this.menuItems = this.menuService.getVerticalMenuItems();
  }

  ngDoCheck() {
    if (this.settings.fixedSidenav) {
      if (this.psConfig.wheelPropagation == true) {
        this.psConfig.wheelPropagation = false;
      }
    }
    else {
      if (this.psConfig.wheelPropagation == false) {
        this.psConfig.wheelPropagation = true;
      }
    }
  }

  public closeSubMenus() {
    let menu = document.getElementById("vertical-menu");
    if (menu) {
      for (let i = 0; i < menu.children[0].children.length; i++) {
        let child = menu.children[0].children[i];
        if (child) {
          if (child.children[0].classList.contains('expanded')) {
            child.children[0].classList.remove('expanded');
            child.children[1].classList.remove('show');
          }
        }
      }
    }
  }
  liveTracking() {
    // console.log(event)
    // debugger
    // let btoa_data = btoa(JSON.stringify(event));
    // window.location.href = this.globalService.domain + "wind-anotate?id=" + btoa_data;
    
          const dialogRef = this.trackingDialog.open(LiveTrackingComponent,
            {
              width: '90%'
            });
          dialogRef.afterClosed().subscribe(result => {
            console.log(``);
          });
        }

}
