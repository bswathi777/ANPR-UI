import { GlobalServices } from './../../services/global.service';
import { CommonServices } from './../../services/common.services';
import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Company } from './company.model';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { AddCompanyDialogComponent } from './add-dialog/maindashboard-dialog.component';
import { UploadLogoDialogComponent } from './uploadlogo/uploadlogo.component';
import { CameraAccessDialogComponent } from './camera-access-dialog/camera-access-dialog.component';

const incr = 1;

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainDashboardComponent implements OnInit {
  public companyList: Company[];
  public searchText: string;
  public page: any;
  public showSearch: boolean = false;

  path: any = this.globalServices.path;

  progress = 0;

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
  total: any;

  dialogRef: MatDialogRef<ConfirmDeleteComponent>;

  constructor(public appSettings: AppSettings, 
    public router: Router, public dialog: MatDialog, 
    private commonServices: CommonServices, 
    private globalServices: GlobalServices, 
    private snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;
  }

  getLogo(logo): string {
    if (logo == "") {
      return "assets/img/mainlogo.svg";
    } else {
      return (this.path + logo);
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

    this.getLists();
  }

  getLists() {
    let obj = {}
    this.commonServices.getCompanyList(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.companyList = res['data'];
        console.log(this.companyList,'data');
        
        this.total = res['count'];
        

      } else if (res['success'] == '0') {
        this.companyList = [];

      }
    },
      err => {
        console.log(err);
        this.router.navigate(['/error']);
      });
  }

  public onPageChanged(event) {
    this.page = event;
    this.getLists();
    document.getElementById('main').scrollTop = 0;
  }


  uploadImage(list) {
    let dialogRef = this.dialog.open(UploadLogoDialogComponent, {
      data: list
    });
    dialogRef.afterClosed().subscribe(company => {

      this.getLists();
    });
    this.showSearch = false;
  }



  public openCompanyDialog(company) {
    let dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      data: company,
      width:"50%",
      height:"90%"
    });
    dialogRef.afterClosed().subscribe(company => {

      this.getLists();
    });
    this.showSearch = false;
  }

  public openCameraDialog(company) {
    let dialogRef = this.dialog.open(CameraAccessDialogComponent, {
      width: '',
      height: '',
      data: company
    });
  }


  deleteCompany(company) {
    //console.log(company);
    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.title = company.company_name + ", " + company.company_location;
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"
    this.dialogRef.componentInstance.note = "";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let obj = {
          "id": company.id
        }
        this.commonServices.deleteCompany(obj).subscribe(res => {
          if (res['success'] == '1') {
            this.snackBar.open(res["message"], "close", {
              duration: 2000,
            });

            this.getLists();

          } else if (res['success'] == '0') {
            this.snackBar.open(res["message"], "close", {
              duration: 2000,
            });
          }
        },
          err => {
            console.log(err);
          });

      }
      this.dialogRef = null;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => { this.settings.loadingSpinner = false }, 300);
    //this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
      if (window.innerWidth <= 960) {
        this.sidenav.close();
      }
    });

  }

  styleObject(list){
    if (list.camera_status == true) {
      return {'cursor': 'pointer'}
    }else{
      return {}
    }

  }

  showDashboard(list) {
console.log(list,'list');

    if (list.camera_status == true) {

      localStorage.setItem('company_dataitem', JSON.stringify(list));
      // let domain = this.globalServices.domain + '/dashboard';
      // window.location.href = domain;
    }else{

    }
  }

  openCamera(list) {
    //console.log(list)
    this.router.navigate(['/cameraid-dashboard'], { queryParams: { id: list.id } });
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    if (this.menuOption == 'horizontal') {
      this.settings.fixedSidenav = false;
    }
    this.router.navigate(['/main-dashboard']);
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
      if (ps.elementRef.nativeElement.id == 'main') {
        ps.scrollToTop(0, 250);
      }
    });
  }

  public closeSubMenus() {
    if (this.settings.menu == "vertical") {

    }
  }
  testmethod(){
    this.router.navigateByUrl('face-recognition')
  }
}