import { CommonServices } from './../../../services/common.services';
import { GlobalServices } from './../../../services/global.service';
import { environment } from './../../../../environments/environment.prod';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-report-dialog',
  templateUrl: './edit-report-dialog.component.html',
  styleUrls: ['./edit-report-dialog.component.scss']
})
export class EditReportDialogComponent implements OnInit {
  vehicleurl: any;

  path: any = this.globalService.path;
  
  constructor(public dialogRef: MatDialogRef<EditReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonService: CommonServices, public globalService: GlobalServices) { 

      let dateFormat = moment(this.data.date).format('YYYY-MM-DD');

      this.vehicleurl = this.path+data.vehicle_image;

      //this.getEditReport(data)
    }

  ngOnInit() {

  }

  getEditReport(data){
    let obj = {
      "vehicle_image": data.vehicle_image,
      "vehicle_status": data.vehicle_status,
      "vehicle_reg_no": data.vehicle_reg_no,
      "vehicle_type": data.vehicle_type
    }
    this.commonService.editReportID(obj).subscribe(res => {
      if (res['success'] == '1') {
        this.globalService.showSuccessMessage(res['message']);
      } else if (res['success'] == '0') {
        this.globalService.showMessage(res['message']);
      }
    },
      err => {
        console.log(err);
      });
  }
  

  dialogClose(){
    this.dialogRef.close();
  }
}
