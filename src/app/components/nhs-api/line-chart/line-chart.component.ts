// Angular | RxJS
import { Component, ElementRef, OnInit, OnDestroy, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DatePipe, DecimalPipe } from '@angular/common';

// Local Imports
import { NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';
import { DatastoreSearchSql, FilterOptions, Record } from 'src/app/types/nhs-api/epd';

// D3 Imports
import * as d3 from 'd3';
import { Axis } from 'd3-axis';
import { Selection } from 'd3-selection';
import { ScaleTime, ScaleContinuousNumeric } from 'd3-scale';
import { Line } from 'd3-shape';
import { Data, LineDataItem } from 'src/app/types/d3/data';
import { ChartControl } from 'src/app/types/nhs-api/chart';

type MonthData = {
    YEAR_MONTH: number;
    TOTAL_QUANTITY: number;
}

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public requestOptions: FilterOptions = {} as FilterOptions;
    @Input() public chartOptions: ChartControl = {} as ChartControl;

    // Data
    public data$: Observable<DatastoreSearchSql[]> = new Observable();
    private data: DatastoreSearchSql[] = [];
    private lineData: LineDataItem[] = [];
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
    public tooltipContainer: any;

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

    constructor(
        private readonly service: NhsApiService,
        public element: ElementRef,
        private decimalPipe: DecimalPipe,
        private datePipe: DatePipe,
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        console.log('ngOnInit');
        this.setupChart();
        this.getData();
    }

    public ngOnDestroy(): void {
        console.log('ngOnDestroy');
        // console.log('Remove', this.subscriptions.length);
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges');
        const reqChanges = changes['requestOptions'];
        const firstReqChange = reqChanges && reqChanges.firstChange;
        if (reqChanges && !firstReqChange) {
            this.getData();
        }
    }

    public getData() {
        console.log('getData');
        this.data$ = this.service.getMonthlyData(this.requestOptions);
        this.subscribeToData();
    }

    private setupChart() {
        console.log('setupChart');
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setContainers();
    }

    private subscribeToData() {
        console.log('subscribeToData');
        const sub = this.data$.subscribe(data => {
            this.data = data;
            this.transformData();
            this.updateChart();
        });
        this.subscriptions.push(sub);
    }

    private transformData() {
        console.log('transformData');
        const initObj = (item: Record) => ({
            YEAR_MONTH: item.YEAR_MONTH,
            TOTAL_QUANTITY: 0,
        })
        const reducer = (acc: any, item: Record) => {
            if (!acc[item.YEAR_MONTH]) {
                acc[item.YEAR_MONTH] = initObj(item);
            }
            acc[item.YEAR_MONTH].TOTAL_QUANTITY += item.TOTAL_QUANTITY;
            return acc;
        }
        const getDatePart = (num: number, start: number, end: number) => parseInt(num.toString().slice(start, end), 10);
        const getMonth = (num: number) => getDatePart(num, 4, 6) - 1;
        const getYear = (num: number) => getDatePart(num, 0, 4);
        const getDate = (num: number) => new Date(getYear(num), getMonth(num));
        const mapData = (month: MonthData) => ({
            x: getDate(month.YEAR_MONTH),
            y: month.TOTAL_QUANTITY,
        });

        const records = this.data.flatMap(month => month.result.result.records);
        const reduced = records.reduce(reducer, {});
        const months: MonthData[] = Object.values(reduced);
        const data = months.map(mapData);
        const name = 'Data';
        this.lineData = [{ name, data }];
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

    private updateChart(): void {
        console.log('updateChart');
        this.setParams();
        this.setLabels();
        this.setAxis();
        this.setLegend();
        this.draw();
        this.addTooltip();
    }

    private setParams(): void {
        console.log('setParams');
        // Helper Functions
        const dataItemMap = (dataItem: Data) => dataItem.x
        const lineDataItemMap = (lineDataItem: LineDataItem) => lineDataItem.data.map(dataItemMap);
        const minReducer = (min: number, point: Data) => Math.min(min, point.y);
        const maxReducer = (max: number, point: Data) => Math.max(max, point.y);
        const minMap = (item: LineDataItem) => item.data.reduce(minReducer, Infinity);
        const maxMap = (item: LineDataItem) => item.data.reduce(maxReducer, -Infinity);

        // Parse dates / values
        const parsedDates = this.lineData.map(lineDataItemMap).flat();
        const minValues = this.lineData.map(minMap);
        const maxValues = this.lineData.map(maxMap);
        // const min = d3.min(minValues);
        const min = 0;
        const max = d3.max(maxValues);

        // Set Domains
        const xDomain = d3.extent(parsedDates);
        const yDomain = [min, max];

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
        console.log('setLabels');
        const title = 'Prescribing Data';
        this.titleContainer
            .text(title)
            .style('font-size', '20px')
            .attr('transform', `translate(0, 10)`);
    }

    private setAxis(): void {
        console.log('setAxis');
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
        console.log('draw');
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

    private addTooltip() {
        console.log('addTooltip');
        // Add a DIV element
        const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background-color', 'steelblue')
            .style('color', 'white')
            .style('border', '1px solid white')
            .style('border-radius', '10px')
            .style('display', 'none')
            .style('opacity', 0.75)
            .style('z-index', 5);

        // Add a circle element
        const circle = this.tooltipContainer
            .append('circle')
            .attr('r', 0)
            .attr('fill', 'steelblue')
            .style('stroke', 'white')
            .attr('opacity', .70)
            .style('pointer-events', 'none');

        // Create a listening rectangle
        const listeningRect = this.tooltipContainer
            .append('rect')
            .attr('width', this.innerWidth - 1)
            .attr('height', this.innerHeight)
            .style('pointer-events', 'all')
            .style('fill-opacity', 0)
            .style('stroke-opacity', 0)
            .style('z-index', 1);

        const mousemoveFn = (event: MouseEvent) => {
            // Find the closest data item
            const dAttribute = (event: MouseEvent) => {
                const data = this.lineData[0].data;
                const rect = this.tooltipContainer.select('rect')._groups[0][0];
                const [xCoord] = d3.pointer(event, rect);
                const bisectDate = d3.bisector((d: Data) => d.x).left;
                const x0 = this.x.invert(xCoord);
                const i = bisectDate(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const diff0 = x0.valueOf() - d0.x.valueOf();
                const diff1 = d1.x.valueOf() - x0.valueOf();
                return diff0 > diff1 ? d1 : d0;
            }

            // Store the closest data item
            const dataItem = dAttribute(event);

            // Calculate x, y positions
            const xPos = this.x(dataItem.x);
            const yPos = this.y(dataItem.y);

            // Update the circle position
            circle.attr('cx', xPos).attr('cy', yPos);

            // Add transition for the circle radius
            circle.transition().duration(50).attr('r', 5);

            const htmlLines = [
                `<strong>DATE:</strong> ${this.datePipe.transform(dataItem.x, 'LLLL y')}`,
                `<strong>VALUE:</strong> ${this.decimalPipe.transform(dataItem.y)}`,
            ];

            // Add in our tooltip
            tooltip.style('display', 'block')
                .style('left', `${xPos + 175}px`)
                .style('top', `${yPos + 50}px`)
                .html(htmlLines.join('<br>'));
        }

        const mouseleaveFn = () => {
            circle.transition().duration(50).attr('r', 0);
            tooltip.style('display', 'none');
        }

        listeningRect.on('mousemove', mousemoveFn);
        listeningRect.on('mouseleave', mouseleaveFn);
    }
}
