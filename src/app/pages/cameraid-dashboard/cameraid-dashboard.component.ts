
import { state } from '@angular/animations';
import { ConfirmDeleteComponent } from './../confirm-delete/confirm-delete.component';
import { CommonServices } from './../../services/common.services';
import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PerfectScrollbarDirective, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Camera } from './camera.model';
import { AddCameraDialogComponent } from './add-dialog/cameraid-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { RTSPDialogComponent } from '../rtsp-camera-dialog/rtsp-camera-dialog.component';

@Component({
  selector: 'app-cameraid-dashboard',
  templateUrl: './cameraid-dashboard.component.html',
  styleUrls: ['./cameraid-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CameraDashboardComponent implements OnInit {
  public cameraList: Camera[];
  public searchText: string;
  public page: any;
  public showSearch: boolean = false;

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
  companyid: string;

  

  constructor(private route: ActivatedRoute, public appSettings: AppSettings, public router: Router, public dialog: MatDialog, private commonServices: CommonServices, private snackBar: MatSnackBar) {
    this.settings = this.appSettings.settings;

    
    
  }

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      this.companyid = params.get("id");

    });

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
    let obj = {
      company_id: this.companyid,
    }
    this.commonServices.getCameraList(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.cameraList = res['data'];
        this.total = res['count'];

      } else if (res['success'] == '0') {
        this.cameraList = [];
        
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

  public openCameraDialog(camera) {
    let dialogRef = this.dialog.open(AddCameraDialogComponent, {
      data: {obj:camera, companyid:this.companyid}
    });
    dialogRef.afterClosed().subscribe(user => {
     
      this.getLists();
    });
    this.showSearch = false;
  }

  getLiveVideo() {
    let dialogRef = this.dialog.open(RTSPDialogComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(user => {
     
      this.getLists();
    });
    this.showSearch = false;
  }

  deleteCamera(camera) {
    //console.log(camera)
    this.dialogRef = this.dialog.open(ConfirmDeleteComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.title = camera.camera_location, camera.camera_id;
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"
    this.dialogRef.componentInstance.note = "";

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let obj = {
          "id": camera.id
        }
        this.commonServices.deleteCamera(obj).subscribe(res => {
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

  public toggleSidenav() {
    this.sidenav.toggle();
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
      if (ps.elementRef.nativeElement.id == 'main') {
        ps.scrollToTop(0, 250);
      }
    });
  }



  public closeSubMenus() {
    if (this.settings.menu == "vertical") {

    }
  }
}