import { Component, OnInit, Input } from '@angular/core';
import { CommonServices } from 'src/app/services/common.services';

@Component({
  selector: 'app-covid-map',
  templateUrl: './covid-map.component.html',
  styleUrls: ['./covid-map.component.scss']
})
export class CovidMapComponent implements OnInit {
  @Input() zoomSize;
  lat:number = 17.428507117378494;
  long:number = 78.40599243921739;
  mapZoom: number = 18;
  mapList=[];
  labelOptions = {
    color: 'black',
    fontFamily: '',
    fontSize: '14px',
    fontWeight: 'bold',
    text: "some text"
}

  constructor(private commonServices: CommonServices) { }

  ngOnInit() {
    this.getCompanyDetails();
    this.getCovidUserLatLng();
  }

  getCompanyDetails(){
    let obj = {};
    this.commonServices.getCompanyList(obj).subscribe(res => {
      this.mapList = res['data'];
    });
  }

  getCovidUserLatLng(){
    this.commonServices.getCovidUserLatLng().subscribe(res => {
    })
  }

}
