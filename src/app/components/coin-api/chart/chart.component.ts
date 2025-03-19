import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';
import { CoinApiStore } from 'src/app/stores/coin-api.store';

import * as d3 from 'd3';
import { Axis } from 'd3-axis';
import { Selection } from 'd3-selection';
import { ScaleTime, ScaleContinuousNumeric } from 'd3-scale';
import { Line } from 'd3-shape';

@Component({
    selector: 'app-coin-api-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges {

    @Input() public options: ExchangeRateOptions = {} as ExchangeRateOptions;

    private subscriptions: Subscription[] = [];

    // Data
    public data$: Observable<ExchangeRate[]> = new Observable();
    private data: ExchangeRate[] = [];

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
    public dataContainer: any; // Selection<SVGGElement, {}, HTMLElement, any>;
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

    constructor(
        private readonly store: CoinApiStore,
        element: ElementRef
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setContainers();
    }

    public ngOnDestroy(): void {
        console.log('Remove', this.subscriptions.length);
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.getData();
    }

    public getData() {
        this.data$ = this.store.getExchangeRateData(this.options);
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
        if (this.data.length > 0) {
            this.setParams();
            this.setLabels();
            this.setAxis();
            this.setLegend();
            this.draw();
        }
    }

    private setParams(): void {
        // Parse dates / values
        const parsedDates = this.data.map((d: ExchangeRate) => this.timeParse(d.time_period_start.substring(0, 19)));
        const maxValues = [
            Math.max(...this.data.map(o => o.rate_open)),
            Math.max(...this.data.map(o => o.rate_high)),
            Math.max(...this.data.map(o => o.rate_low)),
            Math.max(...this.data.map(o => o.rate_close)),
        ];

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
        const title = 'BTC to GBP between 01/01/2024 and 31/12/2024';
        this.titleContainer
            .text(title)
            .style('font-size', '20px')
            .attr('transform', `translate(0, 10)`);;
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
            .selectAll('path.rate_open')
            .data(this.data);

        // Enter and merge
        lines.enter()
            .append('path')
            .attr('class', 'data')
            .style('fill', 'none')
            .style('stroke-width', '2px')
            .style('stroke', 'black')
            .merge(lines)
            .transition()
            .duration(500)
            .attr('d', (d) => this.line(d.rate_open));

        // Exit
        lines.exit().remove();
    }
}
