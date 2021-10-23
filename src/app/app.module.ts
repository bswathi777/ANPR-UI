import { CacheInterceptor } from "./services/cache-interceptor";
import { DoubleRowPaginatorComponent } from "./pages/double-row-paginator/double-row-paginator.component";
import { RTSPsDialogComponent } from "./pages/rtsps-camera-dialog/rtsps-camera-dialog.component";
import { RTSPDialogComponent } from "./pages/rtsp-camera-dialog/rtsp-camera-dialog.component";
import { PlateImageDialogComponent } from "./pages/reports/platereport-dialog/platereport-dialog.component";
import { GraphListDialogComponent } from "./pages/dashboard/list-dialog/list-dialog.component";
import { AddCameraDialogComponent } from "./pages/cameraid-dashboard/add-dialog/cameraid-dialog.component";
import { HttpServices } from "./services/http.services";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayContainer } from "@angular/cdk/overlay";
import { CustomOverlayContainer } from "./theme/utils/custom-overlay-container";
import { NgxPaginationModule } from "ngx-pagination";

import { AgmCoreModule } from "@agm/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true,
};

import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { SharedModule } from "./shared/shared.module";
import { PipesModule } from "./theme/pipes/pipes.module";
import { routing } from "./app.routing";

import { AppSettings } from "./app.settings";
import { AppComponent } from "./app.component";
import { PagesComponent } from "./pages/pages.component";
import { SearchComponent } from "./pages/search/search.component";
import { NotFoundComponent } from "./pages/errors/not-found/not-found.component";
import { ErrorComponent } from "./pages/errors/error/error.component";

import { SidenavComponent } from "./theme/components/sidenav/sidenav.component";
import { VerticalMenuComponent } from "./theme/components/menu/vertical-menu/vertical-menu.component";
import { HorizontalMenuComponent } from "./theme/components/menu/horizontal-menu/horizontal-menu.component";
import { FullScreenComponent } from "./theme/components/fullscreen/fullscreen.component";
import { ApplicationsComponent } from "./theme/components/applications/applications.component";
import { UserMenuComponent } from "./theme/components/user-menu/user-menu.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { GlobalServices } from "./services/global.service";
import { CommonServices } from "./services/common.services";
import { AuthguardService } from "./services/auth.guard.services";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MainDashboardComponent } from "./pages/main-dashboard/main-dashboard.component";
import { CameraDashboardComponent } from "./pages/cameraid-dashboard/cameraid-dashboard.component";
import { ConfirmDeleteComponent } from "./pages/confirm-delete/confirm-delete.component";
import { AddCompanyDialogComponent } from "./pages/main-dashboard/add-dialog/maindashboard-dialog.component";
import { ImageDialogComponent } from "./pages/reports/report-dialog/report-dialog.component";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { VehicleNumberDialogComponent } from "./pages/reports/vehicleno-dialog/vehicleno-dialog.component";
import { UploadLogoDialogComponent } from "./pages/main-dashboard/uploadlogo/uploadlogo.component";
import { EmailDistributionComponent } from "./pages/email-distribution/email-distribution.component";
import { VehicleTrackingComponent } from "./pages/vehicle-tracking/vehicle-tracking.component";
import { AddTrackingVehicleComponent } from "./pages/vehicle-tracking/add-trackingvehicle/add-trackingvehicle.component";
import { MessagesComponent } from "./theme/components/messages/messages.component";
import { SatPopoverModule } from "@ncstate/sat-popover";

import { MatVideoModule } from "mat-video";
import { TilesListDialogComponent } from "./pages/dashboard/tileslist-dialog/tileslist-dialog.component";
import { EditReportDialogComponent } from "./pages/reports/edit-report-dialog/edit-report-dialog.component";
import { EditForm } from "./pages/reports/edit-report";
import { CustomHttpInterceptorService } from "./services/http-interceptor";
import { NgxLazyImagesModule } from "ngx-lazy-loading-images";
import { APP_BASE_HREF } from "@angular/common";
import { CameraAccessDialogComponent } from "./pages/main-dashboard/camera-access-dialog/camera-access-dialog.component";
import { EditCommentComponent } from "./edit-comment/edit-comment.component";
import { LiveTrackingComponent } from "./theme/components/live-tracking/live-tracking.component";
import { FaceRecognitionComponent } from "./pages/face-recognition/face-recognition.component";
import { WebcamModule } from "ngx-webcam";
import { FaceRecognitionVideoComponent } from "./pages/face-recognition-video/face-recognition-video.component";
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBNcjxo_35qnEG17dQvvftWa68eZWepYE0",
    }),
    PerfectScrollbarModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    SharedModule,
    PipesModule,
    routing,
    NgxLazyImagesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatVideoModule,
    SatPopoverModule,
    WebcamModule,
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    ReportsComponent,
    SearchComponent,
    NotFoundComponent,
    ErrorComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    ImageDialogComponent,
    DoubleRowPaginatorComponent,

    ConfirmDeleteComponent,
    MainDashboardComponent,
    FaceRecognitionComponent,
    FaceRecognitionVideoComponent,
    AddCompanyDialogComponent,

    CameraDashboardComponent,
    AddCameraDialogComponent,
    VehicleNumberDialogComponent,
    GraphListDialogComponent,
    PlateImageDialogComponent,
    UploadLogoDialogComponent,
    RTSPDialogComponent,

    EmailDistributionComponent,
    VehicleTrackingComponent,
    AddTrackingVehicleComponent,
    RTSPsDialogComponent,
    TilesListDialogComponent,
    EditReportDialogComponent,
    EditForm,
    CameraAccessDialogComponent,
    EditCommentComponent,
    LiveTrackingComponent,
    FaceRecognitionVideoComponent,
  ],
  providers: [
    GlobalServices,
    CommonServices,
    HttpServices,
    AuthguardService,
    AppSettings,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: APP_BASE_HREF, useValue: "/ui" },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddCompanyDialogComponent,
    AddCameraDialogComponent,
    ConfirmDeleteComponent,
    ImageDialogComponent,
    VehicleNumberDialogComponent,
    GraphListDialogComponent,
    PlateImageDialogComponent,
    UploadLogoDialogComponent,
    AddTrackingVehicleComponent,
    RTSPDialogComponent,
    RTSPsDialogComponent,
    TilesListDialogComponent,
    EditReportDialogComponent,
    CameraAccessDialogComponent,
    LiveTrackingComponent,
  ],
})
export class AppModule {}
