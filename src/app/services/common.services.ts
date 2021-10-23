import { Injectable } from "@angular/core";
import { GlobalServices } from "./global.service";
import { HttpServices } from "./http.services";
import { Observable } from "rxjs";

@Injectable()
export class CommonServices {
  constructor(
    private http: HttpServices,
    private globalServices: GlobalServices
  ) {}
  getDashboardCount(obj) {
    let url = this.globalServices.ApiUrls().getDashboardCount;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }
  getUserlists(obj) {
    let url = this.globalServices.ApiUrls().getUserlist;
    console.log(url);
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }
  getCompanyData(obj) {
    let url = this.globalServices.ApiUrls().getCompanyData;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }
  getCameraCompany(obj) {
    let url = this.globalServices.ApiUrls().getCameraCompany;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getCompanyList(obj) {
    let url = this.globalServices.ApiUrls().getCompanyList;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getCameraList(obj) {
    let url = this.globalServices.ApiUrls().getCameraList;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }
  userCompanies(obj) {
    let url = this.globalServices.ApiUrls().userCompanies;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }
  addCompany(obj) {
    let url = this.globalServices.ApiUrls().addCompany;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  uploadLogo(obj) {
    let url = this.globalServices.ApiUrls().uploadLogo;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  addCamera(obj) {
    let url = this.globalServices.ApiUrls().addCamera;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  editCamera(obj) {
    let url = this.globalServices.ApiUrls().editCamera;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  editCompany(obj) {
    let url = this.globalServices.ApiUrls().editCompany;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  deleteCompany(obj) {
    let url = this.globalServices.ApiUrls().deleteCompany;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  addEmailDistribution(obj) {
    let url = this.globalServices.ApiUrls().addEmailDistribution;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  deleteCamera(obj) {
    let url = this.globalServices.ApiUrls().deleteCamera;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getReportList(obj) {
    let url = this.globalServices.ApiUrls().getReportList;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  downloadReports(obj) {
    let url = this.globalServices.ApiUrls().downloadReports;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getDashboardVehicleList(obj) {
    let url = this.globalServices.ApiUrls().getDashboardVehicleList;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getRegnoDropdown(obj) {
    let url = this.globalServices.ApiUrls().getRegnoDropdown;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  deleteVehicleTracking(obj) {
    let url = this.globalServices.ApiUrls().deleteVehicleTracking;
    return this.http.HttpRequest({ url, method: "D", data: obj, ...obj });
  }

  deleteReportID(obj) {
    let url = this.globalServices.ApiUrls().deleteReportID;
    return this.http.HttpRequest({ url, method: "D", data: obj, ...obj });
  }

  deleteEmailDistribution(obj) {
    let url = this.globalServices.ApiUrls().deleteEmailDistribution;
    return this.http.HttpRequest({ url, method: "D", data: obj, ...obj });
  }

  groupList(obj) {
    let url = this.globalServices.ApiUrls().groupList;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  activityLog(obj) {
    let url = this.globalServices.ApiUrls().activityLog;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getEmailDistribution(obj) {
    let url = this.globalServices.ApiUrls().getEmailDistribution;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getAppUrl(obj) {
    let url = this.globalServices.ApiUrls().getAppUrl;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getMenulist(obj) {
    let url = this.globalServices.ApiUrls().getMenulist;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  recentupdates(obj) {
    let url = this.globalServices.ApiUrls().activityLog;
    return this.http.HttpRequest({ url, method: "G", ...obj });
  }

  dailyReportGraphs(obj) {
    let url = this.globalServices.ApiUrls().dailyReportGraphs;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  monthlyReportGraphs(obj) {
    let url = this.globalServices.ApiUrls().monthlyReportGraphs;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  yearlyReportGraphs(obj) {
    let url = this.globalServices.ApiUrls().yearlyReportGraphs;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getPieSearchData(obj) {
    let url = this.globalServices.ApiUrls().getPieSearchData;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  graphsVehicleData(obj) {
    let url = this.globalServices.ApiUrls().graphsVehicleData;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getRecurringCount(obj) {
    let url = this.globalServices.ApiUrls().getRecurringCount;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  notificationList(obj) {
    let url = this.globalServices.ApiUrls().notificationList;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getVehicleTracking(obj) {
    let url = this.globalServices.ApiUrls().getVehicleTracking;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  editReportID(obj) {
    let url = this.globalServices.ApiUrls().editReportID;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  addVehicleTracking(obj) {
    let url = this.globalServices.ApiUrls().addVehicleTracking;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  deleteEmailID(obj) {
    let url = this.globalServices.ApiUrls().deleteEmailID;
    return this.http.HttpRequest({ url, method: "D", data: obj, ...obj });
  }

  getCountReports(obj) {
    let url = this.globalServices.ApiUrls().getCountReports;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  //covid services

  getCovidDailyReport(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidDailyReport;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getCovidOverallReport(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidOverallReport;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getCovidPeopleMeet(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidPeopleMeet;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getCovidMonthlyReport(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidMonthlyReport;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getCovidOverallData(): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidOverallData;
    return this.http.HttpRequest({ url, method: "G" });
  }

  getCovidOverallCount(): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidOverallCount;
    return this.http.HttpRequest({ url, method: "G" });
  }

  getCovidBuildingReport(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidBuildingReport;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  getEmailForReports(obj): Observable<any> {
    let header = this.globalServices.getAuthorization();
    let url = this.globalServices.ApiUrls().getEmailForReport;
    return this.http.HttpRequest({
      url,
      method: "G",
      headers: header,
      params: obj,
      ...obj,
    });
  }

  getCovidUserLatLng(): Observable<any> {
    let url = this.globalServices.ApiUrls().getCovidLatLng;
    return this.http.HttpRequest({ url, method: "G" });
  }

  faceRecognition(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().faceRecognition;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }

  getPrice(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getPrice;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }

  CreateTest(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().CreateTest;
    return this.http.HttpRequest({ url, method: "P", data: obj, ...obj });
  }
  getTests(obj): Observable<any> {
    let url = this.globalServices.ApiUrls().getTests;
    return this.http.HttpRequest({ url, method: "G", params: obj, ...obj });
  }
}
