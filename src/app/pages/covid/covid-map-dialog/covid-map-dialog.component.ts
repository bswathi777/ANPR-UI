import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-covid-map-dialog',
  templateUrl: './covid-map-dialog.component.html',
  styleUrls: ['./covid-map-dialog.component.scss']
})
export class CovidMapDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CovidMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
