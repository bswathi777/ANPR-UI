import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-covid-monthly-chart',
  templateUrl: './covid-monthly-chart.component.html',
  styleUrls: ['./covid-monthly-chart.component.scss']

})
export class CovidMonthlyChartComponent implements OnInit {

  @Input() width = "100%";
  @Input() height = "300";
  @Input() type = "mscolumn2d";
  @Input() dataFormat = "json";
  @Input() renderChart;
  @Input() dataSource;
  @Input() chatTheme;
  @Input() covidData;
  @Input() covidMonthlyUpdate;
  showChart:boolean = false;

  constructor() { }

  ngOnInit() {
    this.setChart();
  }

  setChart() {
   if(this.covidMonthlyUpdate !=undefined){
     this.showChart = true;
    this.dataSource = {
      chart: {
        // caption: "Safety Violation",
        caption: `${this.dateTransform(this.covidMonthlyUpdate[this.covidMonthlyUpdate.length - 1].month)}-${this.dateTransform(this.covidMonthlyUpdate[0].month)}`,
        xaxisname: `Last ${this.covidMonthlyUpdate.length} Months`,
        yaxisname: "Violating Safety Measures",
        formatnumberscale: "1",
        plottooltext:
          `<b>$dataValue</b> people were available on <b>$seriesName</b> in $label`,
        theme: this.chatTheme,
        renderAt: this.renderChart,
      },
      categories: [
        {
          category: this.covidMonthlyUpdate.map(info => {
            return { 'label': this.dateTransform(info.month) };
          })
        }
      ],
      dataset: [
        {
          seriesname: "Total",
          color: "#ffc868",
          data: this.covidMonthlyUpdate.map(info => {
            return { 'value': info.total };
          })
        },
        {
          seriesname: "No Mask",
          color: "#D50000",
          data: this.covidMonthlyUpdate.map(info => {
            return { 'value': info.noMask };
          })
        },
        {
          seriesname: "No Social Distance",
          color: "#8EF9FE",
          data: this.covidMonthlyUpdate.map(info => {
            return { 'value': info.noSocialDistance };
          })
        }
      ]
    };
  }
  }
  ngOnChanges() {
    this.setChart();
  }

  dateTransform(dateString:string) {
    return moment(dateString.substr(0,2),'MM').format('MMMM');
  }
}
