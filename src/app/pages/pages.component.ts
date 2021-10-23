import { CommonServices } from './../services/common.services';
import { GlobalServices } from './../services/global.service';
import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { rotate } from '../theme/utils/app-animation';
import { MenuService } from '../theme/components/menu/menu.service';
import { Company } from './main-dashboard/company.model';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [rotate],
  providers: [MenuService]
})
export class PagesComponent implements OnInit {
  @ViewChild('sidenav', { static: false }) sidenav: any;
  @ViewChild('backToTop', { static: false }) backToTop: any;
  @ViewChildren(PerfectScrollbarDirective) pss: QueryList<PerfectScrollbarDirective>;
  public optionsPsConfig: PerfectScrollbarConfigInterface = {};
  public settings: Settings;
  public showSidenav: boolean = false;
  public showInfoContent: boolean = false;
  public toggleSearchBar: boolean = false;
  private defaultMenu: string; //declared for return default menu when window resized 
  public menus = ['vertical', 'horizontal'];
  public menuOption: string;
  public menuTypes = ['default', 'compact', 'mini'];
  public menuTypeOption: string;

  path: any = this.globalService.path;

  p: number;
  
  config: any;
  total: any;
  activityLog: any;
  branchname: string;

  constructor(public appSettings: AppSettings, public router: Router, 
    private menuService: MenuService, 
    private commonService: CommonServices,
    private globalService: GlobalServices) {
    this.settings = this.appSettings.settings;

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    //console.log(company_dataitem);

    this.branchname = company_dataitem.company_location ;
    

    this.config = {
      itemsPerPage: 10,
      currentPage: 1
    };

    this.activitylogupdates(1);
  }

  getLogo() {
    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    if (company_dataitem.company_logo == "") {
      return "assets/img/mainlogo.svg";
    } else {
      return (this.path + company_dataitem.company_logo);
    }
  }

  ngOnInit() {
    this.optionsPsConfig.wheelPropagation = false;
    if (window.innerWidth <= 960) {
      this.settings.menu = 'vertical';
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;
  }

  ngAfterViewInit() {
    setTimeout(() => { this.settings.loadingSpinner = false }, 300);
    this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
      if (window.innerWidth <= 960) {
        this.sidenav.close();
      }
    });
    if (this.settings.menu == "vertical")
      this.menuService.expandActiveSubMenu(this.menuService.getVerticalMenuItems());
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  pageChanged(event) {
    this.config.currentPage = event;
    //event == p;
    this.activitylogupdates(event);
  }

  activitylogupdates(pageSize) {
    let obj = {
      "size_of_page": 10,
      "offset": pageSize
    }
    this.commonService.activityLog(obj).subscribe((res) => {
      this.activityLog = res['data'];

      this.total = res['count'];

      this.config = {
        itemsPerPage: 10,
        currentPage: pageSize,
        totalItems: this.total
      };
    })
  }

  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    if (this.menuOption == 'horizontal') {
      this.settings.fixedSidenav = false;
    }
    this.router.navigate(['/dashboard']);
  }

  public chooseMenuType() {
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }

  public closeInfoContent(showInfoContent) {
    this.showInfoContent = !showInfoContent;
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    if (window.innerWidth <= 960) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = 'vertical'
    }
    else {
      (this.defaultMenu == 'horizontal') ? this.settings.menu = 'horizontal' : this.settings.menu = 'vertical'
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public onPsScrollY(event) {
    (event.target.scrollTop > 300) ? this.backToTop.nativeElement.style.display = 'flex' : this.backToTop.nativeElement.style.display = 'none';
  }

  public scrollToTop() {
    this.pss.forEach(ps => {
      ps.scrollToTop(0, 250);
      /* if (ps.elementRef.nativeElement.id == 'main') {
        ps.scrollToTop(0, 250);
      } */
    });
  }

  public closeSubMenus() {
    if (this.settings.menu == "vertical") {
      this.menuService.closeAllSubMenus();
    }
  }
}