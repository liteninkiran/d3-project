// Angular Imports
import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';

// Local Imports
import { ChartData } from 'src/app/types/d3/data';
import { BarChartRendererService } from 'src/app/services/d3/bar-chart-renderer.service';
import { LineChartRendererService } from 'src/app/services/d3/line-chart-renderer.service';
import { TimeChartBaseService } from 'src/app/services/d3/time-chart-base.service';
import { ChartControl } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-time-series',
    templateUrl: './time-series.component.html',
    styleUrls: ['./time-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() data: ChartData[] = [];
    @Input() chartOptions: ChartControl;

    @ViewChild('svgRef', { static: true }) private svgRef: ElementRef<SVGSVGElement>;

    constructor(
        private baseService: TimeChartBaseService,
        private lineChartService: LineChartRendererService,
        private barChartService: BarChartRendererService,
    ) { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void { }

    public ngOnChanges(_changes: SimpleChanges): void {
        this.createChart();
    }

    private createChart(): void {
        if (!this.svgRef?.nativeElement || this.data.length === 0) return;

        this.baseService.init(
            this.svgRef.nativeElement,
            this.data,
            this.chartOptions.chartWidth,
            this.chartOptions.chartHeight,
            this.chartOptions.margins
        );
        this.baseService.drawAxes();

        if (this.chartOptions.chartType === 'line') {
            this.lineChartService.drawLine(this.chartOptions.markers);
        } else {
            this.barChartService.drawBar();
        }
    }
}
