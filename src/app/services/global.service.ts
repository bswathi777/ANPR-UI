import { Injectable, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable()
export class GlobalServices implements OnInit {
  //currentDomain = 'http://' + window.location.host + '/ui';
  //public domain = 'http://' + window.location.host;

  public currentDomain = window.location.origin + "/ui";
  public domain = window.location.origin;

  pageSize = 25;
  pageSizeOptions = [25, 50, 100];

  sso_url: any = environment.SSO_URL;
  path: any = environment.API_URL;

  constructor(public snackBar: MatSnackBar, private router: Router) {}

  ApiUrls() {
    return {
      //sso
      getMenulist: this.sso_url + "application_list",
      getAppUrl: this.sso_url + "userprojects",
      getUserlist: this.sso_url + "userlist",

      //company
      // 'getCompanyList': environment.API_URL + 'user_company_data',
      getCompanyList: environment.API_URL + "companysdata",
      addCompany: environment.API_URL + "inserting/company/data",
      editCompany: environment.API_URL + "editcompany",
      deleteCompany: environment.API_URL + "deletecompany",
      uploadLogo: environment.API_URL + "companys/logo",
      getCompanyData: environment.API_URL + "companysdata",
      userCompanies: environment.API_URL + "insert_user_companies",

      //camera details
      getCameraList: environment.API_URL + "user_camera_data",
      addCamera: environment.API_URL + "inserting/camera/data",
      editCamera: environment.API_URL + "editcamera",
      deleteCamera: environment.API_URL + "deletecamera",
      getCameraCompany: environment.API_URL + "get_camera_by_company",

      //dashboard
      getDashboardCount: environment.API_URL + "vehicles/count",
      getDashboardVehicleList:
        environment.API_URL + "data_retrival_vehicles_data",
      dailyReportGraphs: environment.API_URL + "daily/vehicledata",
      monthlyReportGraphs: environment.API_URL + "monthly/vehicledata",
      yearlyReportGraphs: environment.API_URL + "yearly/vehicledata",
      getPieSearchData: environment.API_URL + "pie/vehicledata",
      graphsVehicleData: environment.API_URL + "graph/vehicledata",
      getRecurringCount: environment.API_URL + "recurring/vehicledata",
      getCountReports: environment.API_URL + "vehicles/count/data",

      //covid19

      getCovidDailyReport: environment.API_URL + "covid19_last7days_count",
      getCovidMonthlyReport: environment.API_URL + "covid19_last5months_count",
      getCovidOverallData: environment.API_URL + "covid19_all_buildings_data",
      getCovidOverallReport: environment.API_URL + "covid19datalisting",
      getCovidPeopleMeet: environment.API_URL + "user_meets",
      getCovidOverallCount: environment.API_URL + "covid19_all_data",
      getCovidLatLng: environment.API_URL + "covid19_user_lat_long_data",
      getCovidBuildingReport:
        environment.API_URL + "covid19_cameras_by_bulding",
      getEmailForReport: this.sso_url + "userlist",

      //Report
      getReportList: environment.API_URL + "retrival/data",
      downloadReports: environment.API_URL + "download",
      getRegnoDropdown: environment.API_URL + "registernumber/dropdown",
      deleteReportID: environment.API_URL + "delete/data",
      editReportID: environment.API_URL + "edit/data",

      //Tracking Vehicle
      getVehicleTracking: environment.API_URL + "retrivaltrackvehicle",
      groupList: environment.API_URL + "dropdowngroup",
      addVehicleTracking: environment.API_URL + "addvehicle",
      deleteVehicleTracking: environment.API_URL + "deletetrackingvehicle",
      deleteEmailID: environment.API_URL + "deleteemail",

      //Email Distribution
      getEmailDistribution: environment.API_URL + "retrivalemail",
      addEmailDistribution: environment.API_URL + "addemail",
      deleteEmailDistribution: environment.API_URL + "deleteemail",

      //List
      notificationList: environment.API_URL + "notification",
      activityLog: environment.API_URL + "activity_log",

      //face recognition
      faceRecognition: environment.API_URL + "face_identification",
    };
  }

  isHasLoggedInSession() {
    let data = this.getLocalItem("ANPRAuthentication", true);
    return data ? true : false;
  }

  public setLocalItem(key, value, encoded) {
    value = JSON.stringify(value);
    if (encoded) {
      value = btoa(value);
    }
    localStorage.setItem(key, value);
  }

  ngOnInit() {}

  public init = function () {
    this.apiToken = "";
    this.authentication = null;
    var data = this.getLocalItem("ANPRAuthentication", true);
    if (data) {
      this.token = data["data"]["token"];
    }
  };
  public getLocalItem = function (key, decoded) {
    var value = localStorage.getItem(key);
    value = value ? JSON.parse(decoded ? atob(value) : value) : null;
    return value;
  };

  public removeLocalItem = function (key) {
    localStorage.removeItem(key);
  };

  invalidApiToken(): void {
    this.logout();
  }

  public logout() {
    localStorage.removeItem("ANPRAuthentication");
    localStorage.clear();
    window.location.href = this.domain + "/logout";
    this.init();
  }

  public showSuccessMessage(obj: any) {
    this.snackBar.open(obj, "Close", {
      duration: 3000,
      verticalPosition: "top",
      panelClass: ["snack-success"],
    });
  }

  public showMessage(obj: any) {
    this.snackBar.open(obj, "Close", {
      duration: 3000,
      verticalPosition: "top",
    });
  }

  public getAuthorization = function () {
    var data = this.getLocalItem("ANPRAuthentication", true)["data"];
    //debugger
    if (data) {
      this.token = data["token"];
    }
    let authorization = {
      Authorization: "Token " + this.token,
    };
    return authorization;
  };

  public getLoginAuthorization = function (val) {
    val = btoa(val);
    let authorization = {
      Authorization: "Token " + val,
      "Client-Type": "WEB",
      "App-Id": "ANPR",
    };
    return authorization;
  };

  public showErrorMessage(obj) {
    if (obj.status != undefined && obj.status == 0) {
      this.snackBar.open("Unable to connect server", "Close", {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ["snack-error"],
      });
      //this.logout();
    } else if ((obj.status && undefined) || obj.status == 500) {
      this.snackBar.open(obj["statusText"], "Close", {
        duration: 2000,
        verticalPosition: "top",
        panelClass: ["snack-error"],
      });
    } else {
      this.snackBar.open(obj, "Close", {
        duration: 3000,
        verticalPosition: "top",
        panelClass: ["snack-error"],
      });
    }
  }

  public userManagementPage() {
    let btoa_domain = btoa(JSON.stringify(this.currentDomain));
    window.location.href =
      this.domain + "/user-management?redirect=" + btoa_domain;
  }
}
