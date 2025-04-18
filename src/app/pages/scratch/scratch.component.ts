import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Line, ScaleContinuousNumeric, ScaleTime } from 'd3';
import { Axis } from 'd3-axis';
import { Data } from 'src/app/types/d3/data';

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit {
    // Data
    private lineData: Data[] = [];

    // Main elements
    public host: any;
    public svg: any;

    // Dimensions
    public dimensions: DOMRect;
    public innerWidth: number = 0;
    public innerHeight: number = 0;
    public margins = {
        left: 50,
        top: 40,
        right: 20,
        bottom: 80,
    };

    // Containers
    public dataContainer: any;
    public xAxisContainer: any;
    public yAxisContainer: any;
    public legendContainer: any;
    public titleContainer: any;
    public tooltipContainer: any;

    // Axes
    public xAxis: Axis<Date | d3.NumberValue>;
    public yAxis: Axis<d3.NumberValue>;

    // Scales
    public x: ScaleTime<number, number, never>;
    public y: ScaleContinuousNumeric<number, number, never>;

    // Line generator
    public line: Line<any>;

    constructor(
        public element: ElementRef,
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.setupChart();
    }
    
    private setupChart() {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setContainers();
        this.setChartTitle('Chart Title');
    }

    private setDimensions(): void {
        console.log('setDimensions');
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    private setContainers(): void {
        console.log('setContainers');
        this.xAxisContainer = this.svg
            .append('g')
            .attr('class', 'x-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);

        this.yAxisContainer = this.svg
            .append('g')
            .attr('class', 'y-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.titleContainer = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${0.5 * this.margins.top})`)
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');

        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${this.margins.left}, ${this.dimensions.height - 0.5 * this.margins.bottom + 10})`);

        this.tooltipContainer = this.svg
            .append('g')
            .attr('class', 'tooltip-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);
    }

    private setChartTitle(title: string): void {
        console.log('setChartTitle', title);
        this.titleContainer
            .text(title)
            .style('font-size', '20px')
            .attr('transform', `translate(0, 10)`);
    }
}
