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
        this.data = data;
        this.chartControl = chartControl;

        this.setMargins();
        this.createSvg(divEl);
        this.resizeSvg();
        this.createContainer();
        this.createScales();
        this.drawAxes();
        this.chartTitle();
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
            chartControl: this.chartControl,
            getLayer: (name: string) => this.getLayer(name),
        };
    }

    public reset(): void {
        this.groups.clear();
        this.data = [];
        this.svg = null;
        this.container = null;
    }

    private drawAxes(): void {
        this.drawXAxis();
        this.xAxisTitle();
        this.drawYAxis();
        this.yAxisTitle();
        this.drawYGrid();
    }

    private chartTitle(): void {
        const leftMargin = this.chartControl.margins.left;
        const offset = leftMargin + (this.innerWidth * 0.5);
        const title = this.chartControl.chart.title;
        if (title) {
            this.titleContainer = this.svg
                .append('g')
                .attr('class', 'chart-title-container')
                .attr('transform', `translate(${offset}, 40)`)
                .append('text')
                .attr('class', 'label')
                .style('text-anchor', 'middle')
                .style('font-size', 30)
                .text(title);
        }
    }

    private xAxisTitle(): void {
        const offset = this.innerWidth * 0.5;
        const title = this.chartControl.axes.xAxis.title;
        const radians = Math.abs(this.chartControl.axes.xAxis.rotation) * Math.PI / 180;
        const fontSize = 20;
        const padding = 80;
        const labelHeight = fontSize * Math.sin(radians);
        const yOffset = labelHeight + padding;

        if (title) {
            this.getLayer('x-axis')
                .append('g')
                .attr('class', 'x-axis-title-container')
                .attr('transform', `translate(${offset}, ${yOffset})`)
                .append('text')
                .attr('class', 'label')
                .style('fill', 'black')
                .style('text-anchor', 'middle')
                .style('font-size', fontSize)
                .text(title);
        }
    }

    private yAxisTitle(): void {
        const title = this.chartControl.axes.yAxis.title;
        const layer = this.getLayer('y-axis');
        const yTickLabels = layer.selectAll('.tick text');
        let maxLabelWidth = 0;

        yTickLabels.each(function () {
            const width = layer.node().getBBox().width;
            if (width > maxLabelWidth) maxLabelWidth = width;
        });

        const padding = 10;
        const labelX = -(maxLabelWidth + padding);

        if (title) {
            this.getLayer('y-axis')
                .append('g')
                .attr('class', 'y-label-container')
                .attr('transform', `translate(${labelX}, ${this.innerHeight * 0.5})`)
                .append('text').attr('class', 'yLabel')
                .style('text-anchor', 'middle')
                .style('fill', 'black')
                .attr('transform', 'rotate(-90)')
                .style('font-size', 20)
                .text(title);
        }
    }

    private drawXAxis(): void {
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
        const { fontSize, ticks, tickFormat } = this.chartControl.axes.yAxis;

        const yAxis = d3.axisLeft(this.y)
            .ticks(ticks)
            .tickFormat(d3.format(tickFormat));

        this.getLayer('y-axis')
            .call(yAxis)
            .attr('font-size', fontSize);
    }

    private drawYGrid(): void {
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
        const { dimensions: { height, width } } = this.chartControl;
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
        const { margins: { top, left } } = this.chartControl;
        this.container.attr('transform', `translate(${left}, ${top})`);
    }

    private createScales(): void {
        this.createXScale();
        this.createYScale();
    }

    private createXScale(): void {
        this.x = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([0, this.innerWidth]);
    }

    private createYScale(): void {
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
        const {
            margins: { top, left, right, bottom },
            dimensions: { height, width },
        } = this.chartControl;

        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;
    }

    private createSvg(divEl: HTMLDivElement): void {
        this.div = d3.select(divEl);
        this.svg = this.div.select('svg');
        this.svg.selectAll('*').remove();
        this.groups.clear();
    }

    private getBaseUnit(unit: Unit): d3.CountableTimeInterval {
        if (unit === 'day') return d3.timeDay;
        if (unit === 'week') return d3.timeWeek;
        if (unit === 'month') return d3.timeMonth;
        if (unit === 'year') return d3.timeYear;
        return d3.timeMonth;
    }

    private customTicks(): Date[] {
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
