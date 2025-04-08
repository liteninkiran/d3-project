// Angular | RxJS
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

// Local Imports
import { defaultOptions, NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';
import { DatastoreSearchSql } from 'src/app/types/nhs-api/epd';

// D3 Imports
import * as d3 from 'd3';
import { Axis } from 'd3-axis';
import { Selection } from 'd3-selection';
import { ScaleTime, ScaleContinuousNumeric } from 'd3-scale';
import { Line } from 'd3-shape';
import { Data, LineDataItem } from 'src/app/types/d3/data';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnDestroy {

    // Data
    public data$: Observable<DatastoreSearchSql[]> = new Observable();
    private data: DatastoreSearchSql[] = [];
    private subscriptions: Subscription[] = [];

    // Main elements
    public host: any;
    public svg: Selection<SVGElement, {}, HTMLElement, any>;

    // Dimensions
    public dimensions!: DOMRect;
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
    public xAxisContainer: Selection<SVGGElement, {}, HTMLElement, any>;
    public yAxisContainer: Selection<SVGGElement, {}, HTMLElement, any>;
    public legendContainer: Selection<SVGGElement, {}, HTMLElement, any>;
    public titleContainer: Selection<SVGGElement, {}, HTMLElement, any>;

    // Date/time formatters
    public timeParse = d3.timeParse('%Y-%m-%dT%H:%M:%S');

    // Axes
    public xAxis: Axis<Date | d3.NumberValue>;
    public yAxis: Axis<d3.NumberValue>;

    // Scales
    public x: ScaleTime<number, number, never>;
    public y: ScaleContinuousNumeric<number, number, never>;

    // Line generator
    public line: Line<any>;

    private testData: LineDataItem[] = [
        {
            name: 'Test',
            data: [
                { x: new Date(2025, 3, 1), y: 10 },
                { x: new Date(2025, 3, 2), y: 15 },
                { x: new Date(2025, 3, 3), y: 20 },
                { x: new Date(2025, 3, 4), y: 30 },
            ]
        }
    ];

    get lineData(): LineDataItem[] {
        return this.testData;
    }

    constructor(
        private readonly service: NhsApiService,
        element: ElementRef
    ) {
        this.host = d3.select(element.nativeElement);
        console.log(this.testData);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setContainers();
        this.getData();
    }

    public ngOnDestroy(): void {
        console.log('Remove', this.subscriptions.length);
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public getData() {
        this.data$ = this.service.getMonthlyData(defaultOptions);
        this.subscribeToData();
    }

    private subscribeToData() {
        const sub = this.data$.subscribe(data => {
            this.data = data;
            console.log(this.data);
            this.updateChart();
        });
        this.subscriptions.push(sub);
    }

    private setDimensions(): void {
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    private setContainers(): void {
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
    }

    private updateChart(): void {
        this.setParams();
        this.setLabels();
        this.setAxis();
        this.setLegend();
        this.draw();
    }

    private setParams(): void {
        // Helper Functions
        const dataItemMap = (dataItem: Data) => dataItem.x
        const lineDataItemMap = (lineDataItem: LineDataItem) => lineDataItem.data.map(dataItemMap);
        const reducer = (max: number, point: Data) => Math.max(max, point.y);
        const maxMap = (item: LineDataItem) => item.data.reduce(reducer, -Infinity);

        // Parse dates / values
        const parsedDates = this.lineData.map(lineDataItemMap).flat();
        const maxValues = this.testData.map(maxMap);

        // Set Domains
        const xDomain = d3.extent(parsedDates);
        const yDomain = [0, d3.max(maxValues)];

        // Set Ranges
        const xRange = [0, this.innerWidth];
        const yRange = [this.innerHeight, 0];

        // Set scales
        this.x = d3.scaleTime()
            .domain(xDomain)
            .range(xRange);

        this.y = d3.scaleLinear()
            .domain(yDomain)
            .range(yRange);

        this.line = d3.line()
            .x((d: any) => this.x(d.x))
            .y((d: any) => this.y(d.y))
    }

    private setLabels(): void {
        const title = 'Update This Label';
        this.titleContainer
            .text(title)
            .style('font-size', '20px')
            .attr('transform', `translate(0, 10)`);
    }

    private setAxis(): void {
        this.xAxis = d3
            .axisBottom(this.x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat('%b %Y'))
            .tickSizeOuter(0);

        this.xAxisContainer
            .transition()
            .duration(500)
            .call(this.xAxis);

        this.yAxis = d3.axisLeft(this.y)
            .ticks(5)
            .tickSizeOuter(0)
            .tickSizeInner(-this.innerWidth)
            .tickFormat(d3.format('~s'));

        this.yAxisContainer
            .transition()
            .duration(500)
            .call(this.yAxis);

        // Apply dashes to all horizontal lines except the x-axis
        this.yAxisContainer
            .selectAll('.tick:not(:nth-child(2)) line')
            .style('stroke', '#aaa')
            .style('stroke-dasharray', '2 2');
    }

    private setLegend(): void { }

    private draw(): void {
        // Bind data
        const lines = this.dataContainer
            .selectAll('path.data')
            .data(this.lineData);

        // Enter and merge
        lines.enter()
            .append('path')
            .attr('class', 'data')
            .style('fill', 'none')
            .style('stroke-width', '1px')
            .style('stroke', 'black')
            .merge(lines)
            .transition()
            .duration(500)
            .attr('d', (d: LineDataItem) => this.line(d.data));

        // Exit
        lines.exit().remove();
    }
}
