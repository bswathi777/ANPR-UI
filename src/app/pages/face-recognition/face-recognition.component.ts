import {
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { CommonServices } from "src/app/services/common.services";
import { Settings } from "src/app/app.settings.model";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import { AppSettings } from "src/app/app.settings";
import { NavigationEnd, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { DomSanitizer } from "@angular/platform-browser";
@Component({
  selector: "app-face-recognition",
  templateUrl: "./face-recognition.component.html",
  styleUrls: ["./face-recognition.component.scss"],
})
export class FaceRecognitionComponent implements OnInit {
  /**  */
  @ViewChild("sidenav", { static: false }) sidenav: any;
  // @ViewChild('backToTop', { static: false }) backToTop: any;
  @ViewChildren(PerfectScrollbarDirective)
  pss: QueryList<PerfectScrollbarDirective>;
  public optionsPsConfig: PerfectScrollbarConfigInterface = {};
  public settings: Settings;
  public showSidenav: boolean = false;
  public toggleSearchBar: boolean = false;
  private defaultMenu: string; //declared for return default menu when window resized
  public menus = ["vertical", "horizontal"];
  public menuOption: string;
  public menuTypes = ["default", "compact", "mini"];
  public menuTypeOption: string;
  public showInfoContent: boolean = false;
  /**  */
  backToTop: any;
  snapshots: any = [];
  personIdentity: any;
  public showWebcam = true;
  onSubmitLoading: boolean;
  // public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public facingMode: string = "environment";
  public errors: WebcamInitError[] = [];
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  imageUrl: string;
  imageBinary: any;
  imageBase64String: string;

  constructor(
    private commonservice: CommonServices, // private _sanitizer: DomSanitizer,
    public appSettings: AppSettings,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.optionsPsConfig.wheelPropagation = false;
    if (window.innerWidth <= 960) {
      this.settings.menu = "vertical";
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
    }
    this.menuOption = this.settings.menu;
    this.menuTypeOption = this.settings.menuType;
    this.defaultMenu = this.settings.menu;
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return;
    }

    // List cameras and microphones.

    navigator.mediaDevices
      .enumerateDevices()
      .then(function (devices) {
        devices.forEach(function (device) {
          console.log(
            device.kind + ": " + device.label + " id = " + device.deviceId
          );
        });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }
  /**  */
  ngAfterViewInit() {
    setTimeout(() => {
      this.settings.loadingSpinner = false;
    }, 300);
    //this.backToTop.nativeElement.style.display = 'none';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
      if (window.innerWidth <= 960) {
        this.sidenav.close();
      }
    });
  }
  @HostListener("window:resize")
  public onWindowResize(): void {
    if (window.innerWidth <= 960) {
      this.settings.sidenavIsOpened = false;
      this.settings.sidenavIsPinned = false;
      this.settings.menu = "vertical";
    } else {
      this.defaultMenu == "horizontal"
        ? (this.settings.menu = "horizontal")
        : (this.settings.menu = "vertical");
      this.settings.sidenavIsOpened = true;
      this.settings.sidenavIsPinned = true;
    }
  }

  public onPsScrollY(event) {
    event.target.scrollTop > 300
      ? (this.backToTop.nativeElement.style.display = "flex")
      : (this.backToTop.nativeElement.style.display = "none");
  }

  public scrollToTop() {
    this.pss.forEach((ps) => {
      if (ps.elementRef.nativeElement.id == "main") {
        ps.scrollToTop(0, 250);
      }
    });
  }

  public closeSubMenus() {
    if (this.settings.menu == "vertical") {
    }
  }
  public toggleSidenav() {
    this.sidenav.toggle();
  }
  public chooseMenu() {
    this.settings.menu = this.menuOption;
    this.defaultMenu = this.menuOption;
    if (this.menuOption == "horizontal") {
      this.settings.fixedSidenav = false;
    }
    this.router.navigate(["/dashboard"]);
  }

  public chooseMenuType() {
    this.settings.menuType = this.menuTypeOption;
  }

  public changeTheme(theme) {
    this.settings.theme = theme;
  }
  /**  */
  public handleInitError(error: WebcamInitError): void {
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === "NotAllowedError"
    ) {
      this.snackBar.open("Camera access is not allowed by user!", "close", {
        duration: 9000,
      });
      console.warn("Camera access was not allowed by user!");
    }
    this.errors.push(error);
  }
  public triggerSnapshot(): void {
    this.trigger.next();
    this.personIdentity = [];
  }
  public handleImage(webcamImage: WebcamImage): void {
    console.log("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
    this.snapshots = [];
    this.snapshots.push(this.webcamImage.imageAsDataUrl);
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== "") {
      result.facingMode = { ideal: this.facingMode };
    }

    return result;
  }
  saveImage() {
    console.log(this.snapshots);
    const file = new File(
      [this.convertDataUrlToBlob(this.snapshots[0])],
      "screenShot.jpg",
      { type: `image/jpeg` }
    );
    console.log(file);
    this.onSubmitLoading = true;
    let formData = new FormData();
    formData.append("image", file);
    this.commonservice.faceRecognition(formData).subscribe((res) => {
      this.personIdentity = res.data;
      console.log(this.personIdentity);
      this.onSubmitLoading = false;
    });
  }
  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}
