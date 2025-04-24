import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartOptions2 } from '../chart-settings-2/chart-settings-2.component';
import * as d3 from 'd3';

@Component({
    selector: 'app-demo-chart-2',
    templateUrl: './demo-chart-2.component.html',
    styleUrls: ['./demo-chart-2.component.scss'],
})
export class DemoChart2Component implements OnInit, OnChanges {

    @Input() chartOptions: ChartOptions2;

    private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;

    private dataContainer: any;
    private xAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private yAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private legendContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;

    // Dimensions
    public innerWidth: number = 0;
    public innerHeight: number = 0;

    // Axes
    public xAxis: d3.Axis<Date | d3.NumberValue>;
    public yAxis: d3.Axis<d3.NumberValue>;

    // Scales
    public x: d3.ScaleTime<number, number, never>;
    public y: d3.ScaleContinuousNumeric<number, number, never>;

    // Line generator
    public line: d3.Line<any>;

    public ngOnInit(): void {
        console.log('ngOnInit');
        this.setupChart();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // Ignore the first change as this will be triggered before 
        // ngOnInit() and we need to setup the chart first
        if (this.firstChange(changes, 'chartOptions')) {
            console.log('ngOnChanges', 'Returning on first change');
            return;
        }
        console.log('ngOnChanges', changes);
        this.setInnerDimensions();
        this.resizeSvg();
        this.repositionContainers();
    }

    private firstChange(changes: SimpleChanges, key: string): boolean {
        return changes[key] && changes[key].firstChange;
    }

    private setupChart(): void {
        console.log('setupChart');
        this.storeSvg();
        this.setInnerDimensions();
        this.resizeSvg();
        this.storeContainers();
        this.repositionContainers();
    }

    private storeSvg(): void {
        console.log('storeSvg');
        this.svg = d3.select("#chart");
    }

    private resizeSvg(): void {
        console.log('resizeSvg');
        const { left, right, top, bottom } = this.chartOptions.margin;
        this.svg
            .attr("width", this.innerWidth + left + right)
            .attr("height", this.innerHeight + top + bottom);
    }

    private setInnerDimensions(): void {
        console.log('setInnerDimensions');
        const { left, right, top, bottom } = this.chartOptions.margin;
        const { height, width } = this.chartOptions.dimensions;
        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;
    }

    private storeContainers(): void {
        console.log('storeContainers');
        this.xAxisContainer = this.svg
            .append('g')
            .attr('class', 'x-axis-container')

        this.yAxisContainer = this.svg
            .append('g')
            .attr('class', 'y-axis-container')

        this.titleContainer = this.svg
            .append('g')
            .attr('class', 'title-container');

        this.titleContainer
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');

        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container');

        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container');
    }

    private repositionContainers(): void {
        console.log('setContainerAttributes');
        const { left, top, bottom } = this.chartOptions.margin;
        const legendTop = this.innerHeight - 0.5 * bottom + 10;
        const titleLeft = left + 0.5 * this.innerWidth;
        this.xAxisContainer.attr('transform', `translate(${left}, ${top + this.innerHeight})`);
        this.yAxisContainer.attr('transform', `translate(${left}, ${top})`);
        this.titleContainer.attr('transform', `translate(${titleLeft}, ${0.5 * top})`);
        this.dataContainer.attr('transform', `translate(${left}, ${top})`);
        this.legendContainer.attr('transform', `translate(${left}, ${legendTop})`);
    }
}
