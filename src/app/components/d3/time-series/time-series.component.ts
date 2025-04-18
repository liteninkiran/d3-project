// Angular Imports
import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';

// D3 Imports
import * as d3 from 'd3';
import { ScaleContinuousNumeric, ScaleTime } from 'd3';

type ChartData = {
    date: any;
    value: number;
}

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
    @Input() margin = { top: 20, right: 30, bottom: 40, left: 80 };
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
        this.createLine(xScale, yScale);

        // Add axes
        this.createAxes(xScale, yScale, chartWidth, chartHeight);
    }

    private createLine(
        xScale: ScaleTime<number, number, never>,
        yScale: ScaleContinuousNumeric<number, number, never>
    ): void {
        const line = d3.line<ChartData>()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value));

        // Draw the line
        this.g.append('path')
            .data([this.data])
            .attr('class', 'line')
            .attr('d', line)
            .style('stroke', 'steelblue')
            .style('fill', 'none')
            .style('stroke-width', 2);

        // Draw markers
        if (this.showMarkers) {
            const tooltip = d3.select(this.tooltipRef.nativeElement);
            const markers = this.g.selectAll('.marker')
                .data(this.data)
                .enter()
                .append('circle')
                .attr('class', 'marker')
                .attr('cx', d => xScale(d.date))
                .attr('cy', d => yScale(d.value))
                .attr('r', 4)
                .attr('fill', 'steelblue')
                .attr('stroke', 'white')
                .attr('stroke-width', 0)
                .style('cursor', 'pointer');

            markers.on('mouseover', function (event: MouseEvent, d: ChartData) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8);

                tooltip
                    .style('opacity', 1)
                    .html(`<strong>${d3.timeFormat('%d/%m/%Y')(d.date)}</strong><br>Value: ${d.value}`);
            });

            markers.on('mousemove', function (event: MouseEvent) {
                tooltip
                  .style('left', (event.pageX + 10) + 'px')
                  .style('top', (event.pageY - 28) + 'px');
            });

            markers.on('mouseout', function (event: MouseEvent) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 4);

                tooltip.style('opacity', 0);
            });
        }
    }

    private createAxes(
        xScale: ScaleTime<number, number, never>,
        yScale: ScaleContinuousNumeric<number, number, never>,
        chartWidth: number,
        chartHeight: number
    ): void {
        // Add X Axis
        const axis = d3.axisBottom(xScale)
        .tickValues(this.data.map(d => d.date))
        .tickFormat(d3.timeFormat('%d/%m/%Y'));
        this.g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(axis);

        // Add Y Axis
        this.g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));

        // Add X axis label
        this.g.append('text')
            .attr('class', 'x-axis-label')
            .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 30})`)
            .style('text-anchor', 'middle')
            .text(this.xAxisLabel);

        // Add Y axis label
        this.g.append('text')
            .attr('class', 'y-axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -chartHeight / 2)
            .style('text-anchor', 'middle')
            .text(this.yAxisLabel);
    }
}
