import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { Company } from './../company.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-maindashboard-dialog',
  templateUrl: './maindashboard-dialog.component.html',
  styleUrls: ['./maindashboard-dialog.component.scss']
})
export class AddCompanyDialogComponent implements OnInit {
  companyname: string;
  lat:number = 17.387140;
  long:number = 78.491684;
  mapZoom: number = 18;
  isTracking:boolean = false;


  constructor(public dialogRef: MatDialogRef<AddCompanyDialogComponent>, private globalServices: GlobalServices,
    @Inject(MAT_DIALOG_DATA) public data: Company, private commonServices: CommonServices, private snackBar: MatSnackBar) {

      let user = this.globalServices.getLocalItem('ANPRAuthentication', true)["data"];
      this.companyname = user.company_name;

      //console.log(data)

      
      

  }

  ngOnInit() {
    if (this.data) {
      this.data;
    }
    else {
      this.data = new Company();
    }
  }

  addCompanyForm(form: NgForm) {

    //console.log(form)
    //console.log(this.data)

  }

  getCurrentLocation(){
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.long = position.coords.longitude;
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  setSave(data) {
    let obj = {
      "company_name": this.companyname,
      "company_location": data.company_location,
      "company_logo": "",
      "latitude":this.lat,
      "longitude":this.long
    }

    this.commonServices.addCompany(obj).subscribe(res => {
      if (res['success'] == 1) {
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
        this.dialogRef.close();

      } else {
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
      }
    },
      err => {
        console.log(err);
      });
  }

  setUpdate(data) {
    let obj = {
      "id": data.id,
      "company_name": this.companyname,
      "company_location": data.company_location,
      "company_logo": ""
    }

    this.commonServices.editCompany(obj).subscribe(res => {
      if (res['success'] == 1) {
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
        this.dialogRef.close();

      } else {
        this.snackBar.open(res["message"], "close", {
          duration: 2000,
        });
      }
    },
      err => {
        console.log(err);
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  markerChange(markerEvent){
    this.lat = markerEvent.coords.lat;
    this.long = markerEvent.coords.lng;
  }

}
