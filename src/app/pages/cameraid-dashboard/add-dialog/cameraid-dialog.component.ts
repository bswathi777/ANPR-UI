import { CommonServices } from './../../../services/common.services';
import { Camera } from './../camera.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cameraid-dialog',
  templateUrl: './cameraid-dialog.component.html',
  styleUrls: ['./cameraid-dialog.component.scss']
})

export class AddCameraDialogComponent implements OnInit {
  data: any;
  companyid: number;

  constructor(public dialogRef: MatDialogRef<AddCameraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public model: any, private commonServices: CommonServices, private snackBar: MatSnackBar) {
      //console.log(model);
       this.data = this.model.obj;
       this.companyid = this.model.companyid;
    }

  ngOnInit() {
    if (this.model.obj) {
      this.data;
    }
    else {
      this.data = new Camera();
    }
  }

  setSave(data) {

    let obj = {
      "company_id": this.model.companyid,
      "camera_id": data.camera_id,
      "camera_location": data.camera_location,
      "camera_name": data.camera_name,
      "camera_ip": data.camera_ip
    }

    this.commonServices.addCamera(obj).subscribe(res => {
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

  addCameraForms(form: NgForm){
    
  }

  setUpdate(data) {

    let obj = {
      "id": data.id,
      "camera_id": data.camera_id,
      "camera_location": data.camera_location,
      "camera_name": data.camera_name,
      "camera_ip": data.camera_ip
    }

    this.commonServices.editCamera(obj).subscribe(res => {
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

}
