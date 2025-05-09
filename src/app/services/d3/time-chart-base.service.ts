import { Injectable } from '@angular/core';
import { ChartData, Div, Group, Svg, XScale, YScale } from 'src/app/types/d3/data';
import { ChartContext } from 'src/app/types/d3/services';
import * as d3 from 'd3';
import { ChartOptions } from 'src/app/types/d3/chart-controls';

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
    private chartOptions: ChartOptions;
    private innerWidth = 0;
    private innerHeight = 0;

    public init(
        divEl: HTMLDivElement,
        data: ChartData[],
        chartOptions: ChartOptions,
    ) {
        console.log('Chart Options', chartOptions);
        this.data = data;
        this.chartOptions = chartOptions;

        const {
            margins: { top, left, right, bottom },
            dimensions: { height, width },
        } = this.chartOptions;

        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;

        this.div = d3.select(divEl);
        this.svg = this.div.select('svg');

        this.resizeSvg();
        this.createContainer();
        this.createScales();
    }

    public drawAxes(): void {
        this.drawXAxis();
        this.drawYAxis();
    }

    public drawXAxis(): void {
        const { rotation, fontSize, textAnchor, dateFormat } = this.chartOptions.axes.xAxis;

        const xAxis = d3.axisBottom(this.x)
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat(dateFormat));

        this.getLayer('x-axis')
            .attr('transform', `translate(0, ${this.innerHeight})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', `rotate(${rotation})`)
            .style('text-anchor', textAnchor)
            .attr('x', 0)
            .attr('font-size', fontSize);
    }

    public drawYAxis(): void {
        const { fontSize, ticks, tickFormat } = this.chartOptions.axes.yAxis;

        const yAxis = d3.axisLeft(this.y)
            .ticks(ticks)
            .tickFormat(d3.format(tickFormat));

        this.getLayer('y-axis')
            .call(yAxis)
            .attr('font-size', fontSize);

        this.drawYGrid();
    }

    public drawYGrid(): void {
        const { ticks, gridLines: { enabled } } = this.chartOptions.axes.yAxis;

        const yGrid = d3.axisLeft(this.y)
            .ticks(ticks)
            .tickSize(-this.innerWidth);

        const gridLayer = this.getLayer('y-grid');

        gridLayer.selectAll('*').remove();

        if (enabled) {
            gridLayer
                .call(yGrid)
                .call(g => {
                    g.selectAll('line').attr('stroke', '#ccc').attr('stroke-opacity', 0.7);
                    g.select('.domain').remove();
                    g.selectAll('text').remove();
                });
        }
    }

    public getContext(): ChartContext {
        return {
            svg: this.svg,
            container: this.container,
            x: this.x,
            y: this.y,
            innerHeight: this.innerHeight,
            innerWidth: this.innerWidth,
            data: this.data,
            chartOptions: this.chartOptions,
            getLayer: (name: string) => this.getLayer(name),
        };
    }

    private resizeSvg(): void {
        const { dimensions: { height, width } } = this.chartOptions;
        this.div
            .style('max-width', `${width}px`)
            .style('max-height', `${height}px`);
        this.svg.attr('viewBox', [0, 0, width, height]);
    }

    private getLayer(name: string): Group {
        if (!this.groups.has(name)) {
            const g = this.container.append('g').attr('class', name);
            this.groups.set(name, g);
        }
        return this.groups.get(name);
    }

    private createContainer(): void {
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
        this.x = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([0, this.innerWidth]);

        const yMin = Math.min(0, d3.min(this.data, d => d.value));
        const yMax = d3.max(this.data, d => d.value)!;

        this.y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.innerHeight, 0]);
    }
}
