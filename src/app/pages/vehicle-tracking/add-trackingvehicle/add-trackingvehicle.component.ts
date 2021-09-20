import { GlobalServices } from './../../../services/global.service';
import { CommonServices } from './../../../services/common.services';
import { Validators, NgForm, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface VehicleNo {
  vehicle_reg_no: string;
}

@Component({
  selector: 'app-add-trackingvehicle',
  templateUrl: './add-trackingvehicle.component.html',
  styleUrls: ['./add-trackingvehicle.component.scss']
})
export class AddTrackingVehicleComponent implements OnInit {

  data: any = {};

  vehicleNos: Observable<VehicleNo[]>;
  myControl = new FormControl();
  options: VehicleNo[] = []
  groups: any;
  company_id: any;

  constructor(public dialogRef: MatDialogRef<AddTrackingVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data1: any, private commonService: CommonServices, private globalService: GlobalServices, ) {
    this.data.notification_type = "email";
    this.data.entry = false;
    this.data.exit = false;

    let company_dataitem = JSON.parse(localStorage.getItem('company_dataitem'));
    this.company_id = company_dataitem.id;
  }

  ngOnInit() {

    this.getGroupList();

    this.vehicleNos = this.myControl.valueChanges
      .pipe(
        startWith<string | VehicleNo>(''),
        map(value => typeof value === 'string' ? value : value.vehicle_reg_no),
        map(name => name ? this._filter(name) : this.options.slice())
      );
  }

  private _filter(name: string): VehicleNo[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.vehicle_reg_no.toLowerCase().indexOf(filterValue) === 0);
  }

  addTrackingForm(form: NgForm) {
    /* if (form.invalid) {
      return false
    } */


  }

  setSave(data) {
    //console.log(data);


    let arr = [];
    let notificationtype;

    if (data.notification_type == true || data.notification_type == "email") {
      notificationtype = "email";
    } else {
      notificationtype = "";
    }



    if (data.entry == true && data.exit == true) {
      arr.push("entry", "exit");
    } else if (data.entry == true && data.exit == false) {
      arr.push("entry");
    } else if (data.entry == false && data.exit == true) {
      arr.push("exit");
    }

    console.log(data.vehicle_number.length)

    if (arr.length == 0 || notificationtype == "") {
      this.globalService.showMessage("Please select Notification Type & Alert Event")
    } else {
      let vehicleno_length = data.vehicle_number.length

      if (vehicleno_length == 10) {

        let obj = {
          "company_id": this.company_id,
          "vehicle_number": data.vehicle_number,
          "name": data.name,
          "group": data.group,
          "alert_event": arr,
          "notification_type": data.notification_type,
          "email": data.email,
          "comments": data.comments || '',
        }

        this.commonService.addVehicleTracking(obj).subscribe(
           res => {
             if (res['success'] == 1) {
               this.dialogRef.close();
               this.globalService.showSuccessMessage(res['message']);
             } else {
               this.globalService.showMessage(res['message']);
             }
           },
           err => {
             console.log(err);
           });

      } else {
        this.globalService.showMessage("Please enter proper Vehicle Number");
      }


    }

  }



  displayFn(vehicleNo) {
    return vehicleNo;
  }

  dataChanged(newObj) {


    let obj = {
      "company_id": this.company_id,
      "vehicle_reg_no": newObj || ''
    }
    this.commonService.getRegnoDropdown(obj).subscribe(
      res => {
        if (res['success'] == 1) {
          this.options = res['data'];
        } else {
          this.options = [];
        }
      },
      err => {
        console.log(err);
      });
  }

  getGroupList() {
    let obj = {}
    this.commonService.groupList(obj).subscribe(
      res => {
        if (res['success'] == 1) {
          this.groups = res['data'];
        } else {
          this.groups = [];
        }
      },
      err => {
        console.log(err);
      });
  }



  close() {
    this.dialogRef.close();
  }
}
