import { Injectable } from '@angular/core';
import { ChartData } from 'src/app/types/d3/data';
import * as d3 from 'd3';

type XScale = d3.ScaleTime<number, number>;
type YScale = d3.ScaleLinear<number, number>;
type Svg = d3.Selection<SVGSVGElement, unknown, null, undefined>;
type Group = d3.Selection<SVGGElement, unknown, null, undefined>;

export type ChartMargins = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

@Injectable({
    providedIn: 'root'
})
export class TimeSeriesChartService {
    // SVG
    private svg: Svg;

    // Containers
    private container: Group;
    private gXAxis: Group;
    private gYAxis: Group;
    private gLine: Group;
    private gMarkers: Group;

    // Scales
    private xScale: XScale;
    private yScale: YScale;

    // Data
    private data: ChartData[] = [];

    // Dimensions
    private width = 800;
    private height = 400;
    private margin: ChartMargins = { top: 20, right: 20, bottom: 50, left: 50 };
    private innerWidth = 0;
    private innerHeight = 0;

    initChart(
        svgElement: SVGSVGElement,
        data: ChartData[],
        width: number,
        height: number,
        margin: ChartMargins,
    ): void {
        this.data = data.map(d => ({ ...d, date: new Date(d.date) }));
        this.width = width;
        this.height = height;
        this.margin = margin;

        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;

        this.svg = d3.select(svgElement)
            .attr('width', this.width)
            .attr('height', this.height);

        this.container = this.svg.select('g.chart-container');

        if (this.container.empty()) {
            this.container = this.svg.append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

            this.gXAxis = this.container.append('g').attr('class', 'x-axis');
            this.gYAxis = this.container.append('g').attr('class', 'y-axis');
            this.gLine = this.container.append('g').attr('class', 'line-group');
            this.gMarkers = this.container.append('g').attr('class', 'marker-group');
        }

        this.createScales();
    }

    public drawAxes(): void {
        const xAxis = d3.axisBottom(this.xScale)
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat('%b %Y'));

        const yAxis = d3.axisLeft(this.yScale).ticks(6);

        this.gXAxis
            .attr('transform', `translate(0, ${this.yScale(0)})`)
            .call(xAxis);

        this.gYAxis.call(yAxis);
    }

    public drawLine(): void {
        const line = d3.line<ChartData>()
            .x(d => this.xScale(d.date))
            .y(d => this.yScale(d.value));

        this.gLine.selectAll('path').remove();

        this.gLine.append('path')
            .datum(this.data)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2);
    }

    public drawMarkers(showMarkers: boolean): void {
        this.gMarkers.selectAll('*').remove();

        if (!showMarkers) return;

        const markers = this.gMarkers.selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('cx', d => this.xScale(d.date))
            .attr('cy', d => this.yScale(d.value))
            .attr('r', 4)
            .attr('fill', 'steelblue')
            .attr('class', 'marker')
            .style('cursor', 'pointer');

        markers.on('mouseover', function (_event: MouseEvent, _d: ChartData) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 8);
        });
    
        markers.on('mouseout', function (_event: MouseEvent) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 4);
        });
    }

    public clear(): void {
        this.gLine.selectAll('*').remove();
        this.gMarkers.selectAll('*').remove();
    }

    private createScales(): void {
        this.xScale = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date) as [Date, Date])
            .range([0, this.innerWidth]);

        const yMin = Math.min(0, d3.min(this.data, d => d.value)!);
        const yMax = d3.max(this.data, d => d.value)!;

        this.yScale = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.innerHeight, 0]);
    }
}
