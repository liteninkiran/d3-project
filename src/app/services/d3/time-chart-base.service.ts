import { Injectable } from '@angular/core';
import { ChartData, Div, Group, Svg, XScale, YScale } from 'src/app/types/d3/data';
import { ChartControl, ChartDimensions } from 'src/app/types/d3/chart-controls';
import * as d3 from 'd3';
import { ChartContext } from 'src/app/types/d3/services';

@Injectable({ providedIn: 'root' })
export class TimeChartBaseService {
    // SVG
    private div: Div;
    private svg: Svg;

    // Containers
    private container: Group;
    private groups: Map<string, Group> = new Map();

    // Scales
    private x: XScale;
    private y: YScale;

    // Data
    private data: ChartData[] = [];

    // Dimensions
    private chartOptions: ChartControl;
    private chartDimensions: ChartDimensions;
    private innerWidth = 0;
    private innerHeight = 0;

    public init(
        divEl: HTMLDivElement,
        data: ChartData[],
        chartOptions: ChartControl,
        chartDimensions: ChartDimensions,
    ) {
        console.log('init', chartOptions, chartDimensions);
        this.data = data;
        this.chartOptions = chartOptions;
        this.chartDimensions = chartDimensions;

        const { margins: { top, left, right, bottom } } = this.chartOptions;
        const { height, width } = this.chartDimensions;

        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;

        this.div = d3.select(divEl);
        this.svg = this.div.select('svg');

        this.resizeSvg();
        this.createContainer();
        this.createScales();
    }

    public resizeSvg(): void {
        const { height, width } = this.chartDimensions;
        this.div
            .style('max-width', `${width}px`)
            .style('max-height', `${height}px`);
        this.svg.attr('viewBox', [0, 0, width, height]);
    }

    public drawAxes(): void {
        console.log('drawAxes');
        const xAxis = d3.axisBottom(this.x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b %Y'));
        const yAxis = d3.axisLeft(this.y).ticks(6);

        this.getLayer('x-axis')
            .attr('transform', `translate(0, ${this.innerHeight})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        this.getLayer('y-axis')
            .call(yAxis);
    }

    public getXScale(): XScale {
        console.log('getXScale');
        return this.x;
    }

    public getYScale(): YScale {
        console.log('getYScale');
        return this.y;
    }

    public getLayer(name: string): Group {
        console.log('getLayer', name);
        if (!this.groups.has(name)) {
            const g = this.container.append('g').attr('class', name);
            this.groups.set(name, g);
        }
        return this.groups.get(name);
    }

    public getData(): ChartData[] {
        console.log('getData', this.data);
        return this.data;
    }

    public getContext(): ChartContext {
        if (!this.x || !this.y || !this.svg || !this.container) {
            throw new Error('Chart not initialized');
        }

        return {
            svg: this.svg,
            container: this.container,
            x: this.x,
            y: this.y,
            getLayer: (name: string) => this.getLayer(name),
            getData: () => this.getData()
        };
    }

    private createContainer(): void {
        console.log('createContainer');
        this.container = this.svg.select('g.chart-container');

        if (this.container.empty()) {
            this.container = this.svg
                .append('g')
                .attr('class', 'chart-container');
        }
        this.updateMargins();
    }

    private updateMargins() {
        const { margins: { top, left } } = this.chartOptions;
        d3.select('.chart-container')
            .attr('transform', `translate(${left}, ${top})`);
    }

    private createScales(): void {
        console.log('createScales');
        this.x = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date) as [Date, Date])
            .range([0, this.innerWidth]);

        const yMin = Math.min(0, d3.min(this.data, d => d.value)!);
        const yMax = d3.max(this.data, d => d.value)!;

        this.y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.innerHeight, 0]);
    }
}
