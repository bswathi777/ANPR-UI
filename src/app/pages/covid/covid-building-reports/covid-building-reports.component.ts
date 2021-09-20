import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CovidMapDialogComponent } from '../covid-map-dialog/covid-map-dialog.component';
import { MatDialog } from '@angular/material';



@Component({
  selector: 'app-covid-building-reports',
  templateUrl: './covid-building-reports.component.html',
  styleUrls: ['./covid-building-reports.component.scss']
})
export class CovidBuildingReportsComponent implements OnInit {

  @Input() covidData;
  @Input() covidBuildingData;
  @Output() onMatTabClick: EventEmitter<{ index: number, bid: number }> = new EventEmitter();
  buildingsData = [];

  selectedBuilding: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  overallGreenko(event) {
    if (event.index == 0) {
      this.onMatTabClick.emit({ 'index': event.index, 'bid': 0 });
    }
    else {
      this.onMatTabClick.emit({ 'index': event.index, 'bid': this.selectedBuilding });
    }
  }

  onBuildingChange(val) {
    this.onMatTabClick.emit({ 'index': 1, 'bid': this.selectedBuilding });
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.covidData) {
      this.buildingsData = [...new Set(this.covidData.map(bInfo => {
        return { 'id': bInfo.building_id, 'name': bInfo.building_name };
      }))]
      if (change['covidData']) {
        this.selectedBuilding = this.buildingsData[0].id;
      }
    }
  }
  openMapDialog(): void {
    let dialogRef = this.dialog.open(CovidMapDialogComponent, {
      data: "",
      width: '90%',
      height: '550px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
