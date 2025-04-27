import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { ChartOptions2 } from "src/app/components/d3/chart-settings-2/chart-settings-2.component";
import { ChartData2 } from "src/app/types/d3/data";

@Injectable({ providedIn: 'root' })
export class TimeSeriesBaseService {
    private chartOptions: ChartOptions2;
    private chartData: ChartData2[] = [];

    private div: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;

    private dataContainer: any;
    private xAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private yAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private legendContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleText: d3.Selection<SVGGElement, {}, HTMLElement, any>;

    // Dimensions
    private innerWidth: number = 0;
    private innerHeight: number = 0;

    // Scales
    private x: d3.ScaleTime<number, number, never>;
    private y: d3.ScaleContinuousNumeric<number, number, never>;

    public setupChart(
        divEl: HTMLDivElement,
        svgEl: SVGSVGElement,
        chartData: ChartData2[],
        chartOptions: ChartOptions2,
    ): void {
        this.chartData = chartData;
        this.chartOptions = chartOptions;
        this.div = d3.select(divEl);
        this.svg = d3.select(svgEl);

        this.setInnerDimensions();
        this.resizeSvg();
        this.storeContainers();
        this.repositionContainers();
    }

    public updateChart(
        chartData: ChartData2[],
        chartOptions: ChartOptions2,
    ) {
        this.chartData = chartData;
        this.chartOptions = chartOptions;
        this.setInnerDimensions();
        this.resizeSvg();
        this.repositionContainers();
    }

    private setInnerDimensions(): void {
        console.log('setInnerDimensions');
        const { left, right, top, bottom } = this.chartOptions.margin;
        const { height, width } = this.chartOptions.dimensions;
        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;
    }

    private resizeSvg(): void {
        console.log('resizeSvg');
        const { height, width } = this.chartOptions.dimensions;
        this.div
            .style('max-width', `${width}px`)
            .style('max-height', `${height}px`);
        this.svg.attr('viewBox', [0, 0, width, height]);
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
