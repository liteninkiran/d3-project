// Angular Imports
import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';

// Local Imports
import { ChartData, ChartType } from 'src/app/types/d3/data';
import { BarChartRendererService } from 'src/app/services/d3/bar-chart-renderer.service';
import { LineChartRendererService } from 'src/app/services/d3/line-chart-renderer.service';
import { TimeChartBaseService } from 'src/app/services/d3/time-chart-base.service';

@Component({
    selector: 'app-time-series',
    templateUrl: './time-series.component.html',
    styleUrls: ['./time-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() data: ChartData[] = [];
    @Input() width: number = 1200;
    @Input() height: number = 600;
    @Input() margin = { top: 20, right: 30, bottom: 50, left: 80 };
    @Input() showMarkers: boolean = true;
    @Input() chartType: ChartType = 'line';

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

        this.baseService.init(this.svgRef.nativeElement, this.data, this.width, this.height, this.margin);
        this.baseService.drawAxes();

        if (this.chartType === 'line') {
            this.lineChartService.draw(this.showMarkers);
        } else {
            this.barChartService.draw();
        }
    }
}
