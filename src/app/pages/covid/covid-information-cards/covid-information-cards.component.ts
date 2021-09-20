import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';


@Component({
  selector: 'app-covid-information-cards',
  templateUrl: './covid-information-cards.component.html',
  styleUrls: ['./covid-information-cards.component.scss']
})
export class CovidInformationCardsComponent implements OnInit {
  @Input() covidDailyUpdate;
  @Input() covidMonthlyUpdate;
  @Input() showInformationCards;
  constructor() {

  }

  ngOnInit() {
  }
}



