import { Component, OnInit, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-covid-daily-chart',
  templateUrl: './covid-daily-chart.component.html',
  styleUrls: ['./covid-daily-chart.component.scss'],
  providers: [DatePipe]
})
export class CovidDailyChartComponent implements OnInit {

  @Input() width = "100%";
  @Input() height = "300";
  @Input() type = "mscolumn2d";
  @Input() dataFormat = "json";
  @Input() renderChart;
  @Input() dataSource;
  @Input() chatTheme;
  @Input() covidData;
  @Input() covidDailyUpdate;
  showChart:boolean = false;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.setChart();
  }

  setChart() {
    if (this.covidDailyUpdate != undefined) {
      this.showChart = true;
      this.dataSource = {
        chart: {
          // caption: "Safety Violation",
          caption: `${this.dateTransform(this.covidDailyUpdate[this.covidDailyUpdate.length - 1].date)}-${this.dateTransform(this.covidDailyUpdate[0].date)}`,
          xaxisname: `Last ${this.covidDailyUpdate.length} Days`,
          yaxisname: "Violating Safety Measures",
          formatnumberscale: "1",
          plottooltext:
            `<b>$dataValue</b> people were available on <b>$seriesName</b> in $label`,
          theme: this.chatTheme,
          renderAt: this.renderChart,
        },
        categories: [
          {
            category: this.covidDailyUpdate.map(info => {
              return { 'label': this.dateTransform(info.date) };
            })
          }
        ],
        dataset: [
          {
            seriesname: "Total",
            color: "#ffc868",
            data: this.covidDailyUpdate.map(info => {
              return { 'value': info.total };
            })
          },
          {
            seriesname: "No Mask",
            color: "#D50000",
            data: this.covidDailyUpdate.map(info => {
              return { 'value': info.noMask };
            })
          },
          {
            seriesname: "No Social Distance",
            color: "#8EF9FE",
            data: this.covidDailyUpdate.map(info => {
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
  dateTransform(dateString) {
    return this.datePipe.transform(dateString, 'MMMM d')
  }
}
