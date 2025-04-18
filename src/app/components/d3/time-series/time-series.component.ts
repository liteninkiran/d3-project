// Angular Imports
import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';

// D3 Imports
import * as d3 from 'd3';
import { ScaleContinuousNumeric, ScaleTime } from 'd3';

// Local Imports
import { ChartData } from 'src/app/types/d3/data';
import { createLine, createXAxis, createYAxis } from './time-series.utils';

@Component({
    selector: 'app-time-series',
    templateUrl: './time-series.component.html',
    styleUrls: ['./time-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesComponent implements OnInit, AfterViewInit {

    @Input() data: ChartData[] = [];
    @Input() width: number = 1200;
    @Input() height: number = 600;
    @Input() margin = { top: 20, right: 30, bottom: 50, left: 80 };
    @Input() xAxisLabel: string = '';
    @Input() yAxisLabel: string = '';
    @Input() showMarkers: boolean = true;

    @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
    @ViewChild('tooltip', { static: true }) private tooltipRef: ElementRef;

    private svg: any;
    private g: any;

    constructor() { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void {
        this.createChart();
    }

    private createChart(): void {
        const { margin, width, height } = this;
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Create the SVG element
        this.svg = d3.select(this.chartContainer.nativeElement)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create a group element to hold chart content
        this.g = this.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Parse date from string to Date object
        const parseDate = d3.timeParse('%Y-%m-%d');

        // Map the date from string to Date object
        this.data.forEach(d => {
            d.date = parseDate(d.date);
        });

        // Create scales based on data
        const xScale = d3.scaleTime()
            .range([0, chartWidth])
            .domain(d3.extent(this.data, (d) => d.date));

        const yScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, d3.max(this.data, (d) => d.value)]);

        // Create the line path (for a line chart)
        createLine(this.g, this.data, xScale, yScale, this.showMarkers);

        // Add axes
        createXAxis(this.g, xScale, chartWidth, chartHeight, this.xAxisLabel);
        createYAxis(this.g, yScale, chartHeight, this.yAxisLabel);
    }
}
