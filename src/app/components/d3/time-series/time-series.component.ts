// Angular Imports
import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';

// Local Imports
import { ChartData } from 'src/app/types/d3/data';
import { TimeSeriesChartService } from 'src/app/services/d3/chart.service';

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

    @ViewChild('svgRef', { static: true }) private svgRef: ElementRef<SVGSVGElement>;

    constructor(
        private chartService: TimeSeriesChartService,
    ) {}

    public ngOnInit(): void { }

    public ngAfterViewInit(): void { }

    public ngOnChanges(_changes: SimpleChanges): void {
        this.createChart();
    }

    private createChart(): void {
        if (!this.svgRef?.nativeElement || this.data.length === 0) {
            return;
        };

        this.chartService.initChart(this.svgRef.nativeElement, this.data, this.width, this.height, this.margin);
        this.chartService.drawAxes();
        this.chartService.drawLine();
        this.chartService.drawMarkers(this.showMarkers);
    }
}
