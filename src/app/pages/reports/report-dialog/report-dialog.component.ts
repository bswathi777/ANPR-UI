import { GlobalServices } from './../../../services/global.service';
import { environment } from './../../../../environments/environment.prod';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {
  vehicleurl: any;

  path: any = this.globalService.path;
  
  constructor(public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public globalService: GlobalServices) { 
      //console.log(data)

      //this.vehicleurl = environment.API_URL+data.vehicle_image;
      this.vehicleurl = this.path+data.vehicle_image;
    }

  ngOnInit() {
  }
  

  dialogClose(){
    this.dialogRef.close();
  }
}
