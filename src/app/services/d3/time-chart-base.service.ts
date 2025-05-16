import { Injectable } from '@angular/core';
import { ChartData, Div, Group, Svg, XScale, YScale } from 'src/app/types/d3/data';
import { ChartContext } from 'src/app/types/d3/services';
import { ChartControl, XAxisOptions } from 'src/app/types/d3/chart-controls';
import * as d3 from 'd3';

type Unit = XAxisOptions['baseUnit'];

@Injectable({ providedIn: 'root' })
export class TimeChartBaseService {
    // SVG
    private div: Div;
    private svg: Svg;

    // Containers
    private container: Group;
    private titleContainer: Group;
    private groups: Map<string, Group> = new Map();

    // Scales
    private x: XScale;
    private y: YScale;

    // Data
    private data: ChartData[] = [];

    // Dimensions
    private chartControl: ChartControl;
    private innerWidth = 0;
    private innerHeight = 0;

    public init(
        divEl: HTMLDivElement,
        data: ChartData[],
        chartControl: ChartControl,
    ) {
        console.log('init', data, chartControl);
        this.data = data;
        this.chartControl = chartControl;

        this.setMargins();
        this.createSvg(divEl);
        this.resizeSvg();
        this.createContainer();
        this.createScales();
        this.chartTitle();
    }

    public drawAxes(): void {
        console.log('drawAxes');
        this.drawXAxis();
        this.drawYAxis();
    }

    public getContext(): ChartContext {
        console.log('getContext');
        return {
            svg: this.svg,
            container: this.container,
            x: this.x,
            y: this.y,
            innerHeight: this.innerHeight,
            innerWidth: this.innerWidth,
            data: this.data,
            chartControl: this.chartControl,
            getLayer: (name: string) => this.getLayer(name),
        };
    }

    public reset(): void {
        console.log('reset');
        this.groups.clear();
        this.data = [];
        this.svg = null;
        this.container = null;
    }

    private chartTitle(): void {
        const leftMargin = this.chartControl.margins.left;
        const offset = leftMargin + (this.innerWidth * 0.5);
        this.titleContainer = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${offset}, 40)`)
            .append('text')
            .attr('class', 'label')
            .style('text-anchor', 'middle')
            .style('font-size', 30)
            .text(this.chartControl.chart.title);
    }

    private drawXAxis(): void {
        console.log('drawXAxis');
        const x = this.chartControl.axes.xAxis;

        const xAxis = d3.axisBottom(this.x)
            .tickValues(this.customTicks())
            .tickFormat(d3.timeFormat(x.dateFormat));

        this.getLayer('x-axis')
            .attr('transform', `translate(0, ${this.innerHeight})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', `rotate(${x.rotation})`)
            .style('text-anchor', x.textAnchor)
            .attr('x', 0)
            .attr('font-size', x.fontSize);
    }

    private drawYAxis(): void {
        console.log('drawYAxis');
        const { fontSize, ticks, tickFormat } = this.chartControl.axes.yAxis;

        const yAxis = d3.axisLeft(this.y)
            .ticks(ticks)
            .tickFormat(d3.format(tickFormat));

        this.getLayer('y-axis')
            .call(yAxis)
            .attr('font-size', fontSize);

        this.drawYGrid();
    }

    private drawYGrid(): void {
        console.log('drawYGrid');
        const { ticks, gridLines: { enabled } } = this.chartControl.axes.yAxis;

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

    private resizeSvg(): void {
        console.log('resizeSvg');
        const { dimensions: { height, width } } = this.chartControl;
        this.div
            .style('max-width', `${width}px`)
            .style('max-height', `${height}px`);
        this.svg.attr('viewBox', [0, 0, width, height]);
    }

    private getLayer(name: string): Group {
        console.log('getLayer', name);
        if (!this.groups.has(name)) {
            const g = this.container.append('g').attr('class', name);
            this.groups.set(name, g);
        }
        return this.groups.get(name);
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
        console.log('updateMargins');
        const { margins: { top, left } } = this.chartControl;
        this.container.attr('transform', `translate(${left}, ${top})`);
    }

    private createScales(): void {
        console.log('createScales');
        this.createXScale();
        this.createYScale();
    }

    private createXScale(): void {
        console.log('createXScale');
        this.x = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([0, this.innerWidth]);
    }

    private createYScale(): void {
        console.log('createYScale');
        const { min, max, minAuto, maxAuto } = this.chartControl.axes.yAxis;
        const minValue = Math.min(0, d3.min(this.data, d => d.value));
        const maxValue = d3.max(this.data, d => d.value)!;

        const yMin = minAuto ? minValue : min;
        const yMax = maxAuto ? maxValue : max;

        this.y = d3.scaleLinear()
            .domain([yMin, yMax])
            .range([this.innerHeight, 0]);
    }

    private setMargins(): void {
        console.log('setMargins');
        const {
            margins: { top, left, right, bottom },
            dimensions: { height, width },
        } = this.chartControl;

        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;
    }

    private createSvg(divEl: HTMLDivElement): void {
        console.log('createSvg');
        this.div = d3.select(divEl);
        this.svg = this.div.select('svg');
        this.svg.selectAll('*').remove();
        this.groups.clear();
    }

    private getBaseUnit(unit: Unit): d3.CountableTimeInterval {
        console.log('getBaseUnit', unit);
        if (unit === 'day') return d3.timeDay;
        if (unit === 'week') return d3.timeWeek;
        if (unit === 'month') return d3.timeMonth;
        if (unit === 'year') return d3.timeYear;
        return d3.timeMonth;
    }

    private customTicks(): Date[] {
        console.log('customTicks');
        const { baseUnit, every } = this.chartControl.axes.xAxis;
        const [startDate, endDate] = this.x.domain();
        const d3BaseUnit = this.getBaseUnit(baseUnit);
        const customTicks = [];
        let current = new Date(startDate);

        while (current <= endDate) {
            customTicks.push(new Date(current));
            current = d3BaseUnit.offset(current, every);
        }

        return customTicks;
    }
}
