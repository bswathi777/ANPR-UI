import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-covid-fusion-chart',
  templateUrl: './covid-fusion-chart.component.html',
  styleUrls: ['./covid-fusion-chart.component.scss']
})
export class CovidFusionChartComponent implements OnInit {
  @Input() width = "100%";
  @Input() height = "300";
  @Input() type = "mscolumn2d";
  @Input() dataFormat = "json";
  @Input() renderChart;
  @Input() dataSource;
  @Input() chatTheme;
  @Input() covidData;
  @Input() covidBuildingData;
  showOverallReport:boolean = false;
  showBuildingReport:boolean = false;

  constructor() { }

  ngOnInit() {
    this.setChart();
  }

  setChart() {
    if (this.covidBuildingData) {
      this.showBuildingReport = true;
      this.dataSource = {
        chart: {
          caption: "Safety Violation",
          subcaption: "All Cameras",
          xaxisname: "Camera",
          yaxisname: "Violating Safety Measures",
          formatnumberscale: "1",
          plottooltext:
            `<b>$dataValue</b> people were available on <b>$seriesName</b> in $label`,
          theme: this.chatTheme,
          renderAt: this.renderChart,
        },
        categories: [
          {
            category: this.covidBuildingData.data.map(info => {
              return { 'label': info.camera };
            })
          }
        ],
        dataset: [
          {
            seriesname: "Total",
            color: "#ffc868",
            data: this.covidBuildingData.data.map(info => {
              return { 'value': info.total };
            })
          },
          {
            seriesname: "No Mask",
            color: "#D50000",
            data: this.covidBuildingData.data.map(info => {
              return { 'value': info.noMask };
            })
          },
          {
            seriesname: "No Social Distance",
            color: "#8EF9FE",
            data: this.covidBuildingData.data.map(info => {
              return { 'value': info.noSocialDistance };
            })
          }
        ]
      };
    }
    else if (this.covidData != undefined) {
      this.showOverallReport = true;
      this.dataSource = {
        chart: {
          caption: "Safety Violation",
          subcaption: `overall buildings`,
          xaxisname: `Buildings`,
          yaxisname: "Violating Safety Measures",
          formatnumberscale: "1",
          plottooltext:
            `<b>$dataValue</b> people were available on <b>$seriesName</b> in $label`,
          theme: this.chatTheme,
          renderAt: this.renderChart,
        },
        categories: [
          {
            category: this.covidData.map(info => {
              return { 'label': info.building_name };
            })
          }
        ],
        dataset: [
          {
            seriesname: "Total",
            color: "#ffc868",
            data: this.covidData.map(info => {
              return { 'value': info.total };
            })
          },
          {
            seriesname: "No Mask",
            color: "#D50000",
            data: this.covidData.map(info => {
              return { 'value': info.noMask };
            })
          },
          {
            seriesname: "No Social Distance",
            color: "#8EF9FE",
            data: this.covidData.map(info => {
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
}
