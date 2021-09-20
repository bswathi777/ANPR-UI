import { CommonServices } from './../../services/common.services';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-rtsp-camera-dialog',
  templateUrl: './rtsp-camera-dialog.component.html',
  styleUrls: ['./rtsp-camera-dialog.component.scss']
})

export class RTSPDialogComponent implements OnInit {
  data: any;

  companyid: number;

  video: HTMLVideoElement;
  safeUrl: any;

  constructor(public sanitizer: DomSanitizer, public dialogRef: MatDialogRef<RTSPDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public model: any, private commonServices: CommonServices, private snackBar: MatSnackBar) {
     
    }

  ngOnInit() {
    let checkUrl = "rtsp://admin:12345@10.84.0.155:554/profile2";

    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(checkUrl);
   
  }

  close(): void {
    this.dialogRef.close();
  }

}
