import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import RecordRTC from "recordrtc";
import * as moment from "moment";
import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarDirective,
} from "ngx-perfect-scrollbar";
import { Observable, Subject } from "rxjs";
import { AppSettings } from "src/app/app.settings";
import { Settings } from "src/app/app.settings.model";
interface RecordedVideoOutput {
  blob: Blob;
  url: string;
  title: string;
}
@Component({
  selector: "app-face-recognition-video",
  templateUrl: "./face-recognition-video.component.html",
  styleUrls: ["./face-recognition-video.component.scss"],
})
export class FaceRecognitionVideoComponent implements OnInit {
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
  backToTop: any;
  /**  */
  /** video recording declarations* */
  @ViewChild("videoElement", { static: true }) videoElement: any;
  video: any;
  isPlaying = false;
  displayControls = true;
  isVideoRecording = false;
  videoRecordedTime;
  videoBlobUrl;
  videoBlob;
  videoName;
  videoStream: MediaStream;
  videoConf = { video: { facingMode: "user", width: 320 }, audio: false };
  private stream;
  private recorder;
  private interval;
  private startTime;
  private _stream = new Subject<MediaStream>();
  private _recorded = new Subject<RecordedVideoOutput>();
  private _recordedUrl = new Subject<string>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();
  getRecordedUrl(): Observable<string> {
    return this._recordedUrl.asObservable();
  }

  getRecordedBlob(): Observable<RecordedVideoOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  getStream(): Observable<MediaStream> {
    return this._stream.asObservable();
  }

  constructor(
    // private commonservice: CommonServices, // private _sanitizer: DomSanitizer,
    public appSettings: AppSettings,
    private router: Router,
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef
  ) {
    this.settings = this.appSettings.settings;

    this.recordingFailed().subscribe(() => {
      this.isVideoRecording = false;
      this.ref.detectChanges();
    });

    this.getRecordedTime().subscribe((time) => {
      this.videoRecordedTime = time;
      console.log(this.videoRecordedTime, "recording times");
      this.ref.detectChanges();
    });

    this.getStream().subscribe((stream) => {
      this.videoStream = stream;
      this.ref.detectChanges();
    });

    this.getRecordedBlob().subscribe((data) => {
      this.videoBlob = data.blob;
      this.videoName = data.title;
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data.url);
      this.ref.detectChanges();
    });
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
    this.video = this.videoElement.nativeElement;
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

  startVideoRecording() {
    console.log("started");

    if (!this.isVideoRecording) {
      this.video.controls = false;
      this.isVideoRecording = true;
      this.startRecording(this.videoConf)
        .then((stream) => {
          // this.video.src = window.URL.createObjectURL(stream);
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    }
  }
  startRecording(conf: any): Promise<any> {
    var browser = <any>navigator;
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
    console.log("Recording");

    this._recordingTime.next("00:00");
    return new Promise((resolve, reject) => {
      browser.mediaDevices
        .getUserMedia(conf)
        .then((stream) => {
          this.stream = stream;
          this.record();
          resolve(this.stream);
        })
        .catch((error) => {
          this._recordingFailed.next();
          reject;
        });
    });
  }
  abortVideoRecording() {
    if (this.isVideoRecording) {
      this.isVideoRecording = false;
      this.abortRecording();
      this.video.controls = false;
    }
  }

  stopVideoRecording() {
    if (this.isVideoRecording) {
      this.stopRecording();
      this.video.srcObject = this.videoBlobUrl;
      this.isVideoRecording = false;
      this.video.controls = true;
    }
  }

  clearVideoRecordedData() {
    this.videoBlobUrl = null;
    this.video.srcObject = null;
    this.video.controls = false;
    this.ref.detectChanges();
  }
  abortRecording() {
    this.stopMedia();
  }

  private record() {
    this.recorder = new RecordRTC(this.stream, {
      type: "video",
      mimeType: "video/webm",
      bitsPerSecond: 44000,
    });
    this.recorder.startRecording();
    this.startTime = moment();
    this.interval = setInterval(() => {
      const currentTime = moment();
      const diffTime = moment.duration(currentTime.diff(this.startTime));
      const time =
        this.toString(diffTime.minutes()) +
        ":" +
        this.toString(diffTime.seconds());
      this._recordingTime.next(time);
      this._stream.next(this.stream);
    }, 500);
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = "00";
    }
    if (value < 10) {
      val = "0" + value;
    }
    return val;
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stopRecording(this.processVideo.bind(this));
    }
  }

  private processVideo(audioVideoWebMURL) {
    const recordedBlob = this.recorder.getBlob();
    this.recorder.getDataURL(function (dataURL) {});
    const recordedName = encodeURIComponent(
      "video_" + new Date().getTime() + ".webm"
    );
    this._recorded.next({
      blob: recordedBlob,
      url: audioVideoWebMURL,
      title: recordedName,
    });
    this.stopMedia();
    console.log(recordedBlob, "recorded blob");
  }

  private stopMedia() {
    if (this.recorder) {
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getVideoTracks().forEach((track) => track.stop());
        this.stream.stop();
        this.stream = null;
      }
    }
  }
}
