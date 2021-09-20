import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-covid-video-dialog',
  templateUrl: './covid-video-dialog.component.html',
  styleUrls: ['./covid-video-dialog.component.scss']
})
export class CovidVideoDialogComponent implements OnInit {
  public videoUrl : string;

  constructor(public dialogRef: MatDialogRef<CovidVideoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.videoUrl = environment.API_URL+this.data.VideoObject;
  }

}
