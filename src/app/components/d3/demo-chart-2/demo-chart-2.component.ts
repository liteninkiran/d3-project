import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartOptions2 } from '../chart-settings-2/chart-settings-2.component';
import { ChartData2 } from 'src/app/types/d3/data';
import * as d3 from 'd3';

@Component({
    selector: 'app-demo-chart-2',
    templateUrl: './demo-chart-2.component.html',
    styleUrls: ['./demo-chart-2.component.scss'],
})
export class DemoChart2Component implements OnInit, OnChanges {

    @Input() chartOptions: ChartOptions2;
    @Input() chartData: ChartData2[] = [];

    private div: d3.Selection<SVGElement, {}, HTMLElement, any>;
    private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;

    private dataContainer: any;
    private xAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private yAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private legendContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleText: d3.Selection<SVGGElement, {}, HTMLElement, any>;

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
        console.log('ngOnChanges', changes);
        if (this.firstChange(changes, 'chartOptions')) {
            console.log('ngOnChanges', 'Returning on first change');
            return;
        }
        this.updateChart();
    }

    private firstChange(changes: SimpleChanges, key: string): boolean {
        return changes[key] && changes[key].firstChange;
    }

    private updateChart() {
        this.setInnerDimensions();
        this.resizeSvg();
        this.repositionContainers();
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
        this.div = d3.select('.svg-container');
        this.svg = this.div.select('#chart');
    }

    private resizeSvg(): void {
        console.log('resizeSvg');
        const { height, width } = this.chartOptions.dimensions;
        this.div
            .style('max-width', `${width}px`)
            .style('max-height', `${height}px`);
        this.svg.attr('viewBox', [0, 0, width, height]);
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
        this.storeContainer('xAxisContainer', 'x-axis-container');
        this.storeContainer('yAxisContainer', 'y-axis-container');
        this.storeContainer('titleContainer', 'title-container');
        this.storeContainer('dataContainer', 'data-container');
        this.storeContainer('legendContainer', 'legend-container');
        this.storeText();
    }

    private storeContainer(container: string, className: string): void {
        // console.log('storeContainer', container);
        this[container] = this.svg.append('g').attr('class', className);
    }

    private storeText(): void {
        this.titleText = this.titleContainer
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');
    }

    private repositionContainers(): void {
        console.log('repositionContainers');
        const { left, top, bottom } = this.chartOptions.margin;
        const { height } = this.chartOptions.dimensions;
        this.repositionContainer('xAxisContainer', left, top + this.innerHeight);
        this.repositionContainer('yAxisContainer', left, top);
        this.repositionContainer('titleContainer', left + 0.5 * this.innerWidth, top * 0.5);
        this.repositionContainer('dataContainer', left, top);
        this.repositionContainer('legendContainer', left, (bottom * -0.5) + height + 10);
    }

    private repositionContainer(container: string, left: number, top: number): void {
        // console.log('repositionContainer', `${container} | ${left} | ${top}`);
        this[container].attr('transform', `translate(${left}, ${top})`);
    }
}
