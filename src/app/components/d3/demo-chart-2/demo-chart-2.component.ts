import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartOptions2 } from '../chart-settings-2/chart-settings-2.component';
import { ChartData2 } from 'src/app/types/d3/data';
import { TimeSeriesBaseService } from 'src/app/services/d3/time-series-base.service';
import * as d3 from 'd3';

@Component({
    selector: 'app-demo-chart-2',
    templateUrl: './demo-chart-2.component.html',
    styleUrls: ['./demo-chart-2.component.scss'],
})
export class DemoChart2Component implements OnInit, OnChanges {

    @Input() chartOptions: ChartOptions2;
    @Input() chartData: ChartData2[] = [];

    @ViewChild('divRef', { static: true }) private divRef: ElementRef<HTMLDivElement>;

    // Axes
    public xAxis: d3.Axis<Date | d3.NumberValue>;
    public yAxis: d3.Axis<d3.NumberValue>;

    // Line generator
    public line: d3.Line<any>;

    constructor(
        private service: TimeSeriesBaseService,
    ) { } 

    public ngOnInit(): void {
        console.log('ngOnInit');
        const div = this.divRef.nativeElement;
        this.service.setupChart(div, this.chartData, this.chartOptions);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // Ignore the first change as this will be triggered before 
        // ngOnInit() and we need to setup the chart first
        console.log('ngOnChanges', changes);
        if (this.firstChange(changes, 'chartOptions')) {
            console.log('ngOnChanges', 'Returning on first change');
            return;
        }
        this.service.updateChart(this.chartData, this.chartOptions);
    }

    private firstChange(changes: SimpleChanges, key: string): boolean {
        return changes[key] && changes[key].firstChange;
    }
}
