import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';

import { DashboardService } from './dashboard.srevice';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .mat-raised-button {
        margin-right: 8px;
        margin-top: 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  piaChartCategory = null;
  piaChartFamCate = null;
  chartLine = null;
  piaChartValueFamCate = null;

  stats = [

  ];
  constructor(
    private dashboardSrv: DashboardService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {


  }

  ngAfterViewInit() {
    // this.ngZone.runOutsideAngular(() => this.initChart());
    // this.initChart();
  }

  ngOnDestroy() {
    // if (this.piaChartCategory) {
    //   this.piaChartCategory.destroy();
    // }
    // if (this.piaChartFamCate) {
    //   this.piaChartFamCate.destroy();
    // }
    // if (this.chartLine) {
    //   this.chartLine.destroy();
    // }
    // if (this.piaChartValueFamCate) {
    //   this.piaChartValueFamCate.destroy();
    // }
  }

  initChart() {

    // thống kê số lượn theo đơn vị
    this.dashboardSrv.getData({}).subscribe((res: any) => {
      var Stats = res.Data.Stats;
      var colors = [, , 'bg-green-500', 'bg-teal-500', 'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-teal-500']

      Stats.forEach((obj, idx) => {
        this.stats.push(
          {
            title: obj.Name,
            amount: obj.Value,
            progress: {
              value: (obj.Value / Stats[0].Value) * 100,
            },
            color: 'bg-blue-500',
          }
        );
      });
      var series = [];
      var labels = []
      var DataByCategories = res.Data.DataByCategories
      DataByCategories.forEach(obj => {
        series.push(obj.Value);
        labels.push(obj.Name);
      });
      var chartOption =
      {
        series: series,
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: labels,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
      this.piaChartCategory = new ApexCharts(document.querySelector('#piaChartCategory'), chartOption);
      this.piaChartCategory.render();


      var seriesF = [];
      var labelsF = [];
      var DataByFamCates = res.Data.DataByFamCates
      DataByFamCates.forEach(obj => {
        seriesF.push(obj.Value);
        labelsF.push(obj.Name);
      });
      var chartOptionFamCate =
      {
        series: seriesF,
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: labelsF,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      };
      this.piaChartFamCate = new ApexCharts(document.querySelector('#piaChartFamCate'), chartOptionFamCate);
      this.piaChartFamCate.render();


      var seriesLineAll = [];
      var seriesLineNew = [];
      var labelsLine = [];
      var DataLineChart = res.Data.DataLineChart
      DataLineChart.forEach(obj => {
        seriesLineAll.push(obj.CountAll);
        seriesLineNew.push(obj.CountNew);
        labelsLine.push(obj.Name);
      });
      
      var options = {
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
        series: [{
          name: 'Tổng số lượng tài sản',
          type: 'column',
          data: seriesLineAll
        }, {
          name: 'Số tài sản mới',
          type: 'line',
          data: seriesLineNew
        }],
        chart: {
          height: 300,
          type: 'line',
        },
        stroke: {
          width: [0, 4]
        },
        title: {
          text: ''
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1]
        },
        labels: labelsLine,
        xaxis: {
        },
        yaxis: [{
          title: {
            text: 'Tổng số tài sản',
          },

        }, {
          opposite: true,
          title: {
            text: 'Tài sản mới'
          }
        }]
      };
      this.chartLine = new ApexCharts(document.querySelector("#chartLine"), options);
      this.chartLine.render();

      this.cdr.detectChanges();
    });

  }
}
