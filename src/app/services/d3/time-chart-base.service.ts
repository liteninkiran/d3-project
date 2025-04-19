import { Injectable } from '@angular/core';
import { ChartData, Group, Margin, Svg, XScale, YScale } from 'src/app/types/d3/data';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })
export class TimeChartBaseService {
    // SVG
    private svg: Svg;

    // Containers
    private container: Group;
    private groups: Map<string, Group> = new Map();

    // Scales
    private xScale: XScale;
    private yScale: YScale;

    // Data
    private data: ChartData[] = [];

    // Dimensions
    private width = 800;
    private height = 400;
    private margin: Margin = { top: 20, right: 20, bottom: 50, left: 50 };
    private innerWidth = 0;
    private innerHeight = 0;

    public init(
        svgEl: SVGSVGElement,
        data: ChartData[],
        width: number,
        height: number,
        margin: Margin,
    ) {
        console.log('init');
        this.data = data.map(d => ({ ...d, date: new Date(d.date) }));
        this.width = width;
        this.height = height;
        this.margin = margin;

        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;

        this.svg = d3.select(svgEl)
            .attr('width', this.width)
            .attr('height', this.height);

        this.createContainer();
        this.createScales();
    }

    public drawAxes(): void {
        console.log('drawAxes');
        const xAxis = d3.axisBottom(this.xScale).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat('%b %Y'));
        const yAxis = d3.axisLeft(this.yScale).ticks(6);

        const zeroY = this.yScale(0);

        this.getLayer('x-axis')
            .attr('transform', `translate(0, ${zeroY})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        this.getLayer('y-axis')
            .call(yAxis);
    }

    public getXScale(): XScale {
        console.log('getXScale');
        return this.xScale;
    }
    
    public getYScale(): YScale {
        console.log('getYScale');
        return this.yScale;
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
        console.log('getData');
        return this.data;
    }

    private createContainer(): void {
        console.log('createContainer');
        this.container = this.svg.select('g.chart-container');

        if (this.container.empty()) {
            this.container = this.svg.append('g')
                .attr('class', 'chart-container')
                .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        }
    }

    private createScales(): void {
        console.log('createScales');
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
