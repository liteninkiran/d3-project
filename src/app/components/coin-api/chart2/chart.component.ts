import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';
import { CoinApiStore } from 'src/app/stores/coin-api.store';
import { Data } from 'src/app/interfaces/d3/data';

import * as d3 from 'd3';

@Component({
    selector: 'app-coin-api-chart2',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})
export class Chart2Component implements OnInit, OnDestroy, OnChanges {

    @Input() public options: ExchangeRateOptions = {} as ExchangeRateOptions;

    private subscriptions: Subscription[] = [];

    // Data
    public data$: Observable<ExchangeRate[]> = new Observable();
    private data: ExchangeRate[] = [];

    // SVG
    public svg: d3.Selection<SVGElement, {}, HTMLElement, any>;

    // Set dimensions
    public margin = {
        top: 70,
        right: 30,
        bottom: 40,
        left: 80
    }
    public width = 1200 - this.margin.left - this.margin.right;
    public height = 500 - this.margin.top - this.margin.bottom;

    // Set up the x and y scales
    public x: d3.ScaleTime<number, number, never> = d3.scaleTime().range([0, this.width]);
    public y: d3.ScaleContinuousNumeric<number, number, never> = d3.scaleLinear().range([this.height, 0]);

    // Date/time formatters
    public timeParse = d3.timeParse('%Y-%m-%dT%H:%M:%S');

    get lineData(): Data[] {
        return this.transformData();
    }

    constructor(
        private readonly store: CoinApiStore,
    ) { }

    public ngOnInit(): void {
        this.svg = this.createSvg();
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

    private transformData(): Data[] {
        return this.data.map(d => ({
            x: this.getParsedDate(d.time_period_start),
            y: d.rate_close,
        }));
    }

    private getParsedDate(date: string) {
        return this.timeParse(date.substring(0, 19));
    }

    private subscribeToData() {
        const sub = this.data$.subscribe(data => {
            this.data = data;
            this.updateChart();
        });
        this.subscriptions.push(sub);
    }

    private createSvg() {
        const svg = d3.select('#chart-container')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
        svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        return svg;
    }

    private updateChart() {
        this.setDomains();
        this.addXAxis();
        this.addYAxis();
        this.addLine();
    }

    private setDomains() {
        // Define the x and y domains
        this.x.domain(d3.extent(this.lineData, d => d.x));
        this.y.domain([0, d3.max(this.lineData, d => d.y)]);
    }

    private addXAxis() {
        // Define the x-axis
        const axisBottom = d3.axisBottom(this.x)
        .ticks(d3.timeMonth.every(6))
        .tickFormat(d3.timeFormat('%b %Y'));

        // Add the x-axis
        this.svg.append('g')
            .attr('transform', `translate(0,${this.height})`)
            .call(axisBottom);
    }

    private addYAxis() {
        this.svg.append('g').call(d3.axisLeft(this.y))
    }

    private addLine() {
        // Create the line generator
        const line: d3.Line<any> = d3.line()
            .x((d: any) => this.x(d.x))
            .y((d: any) => this.y(d.y));

        // Add the line path to the SVG element
        this.svg.append('path')
            .datum(this.lineData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1)
            .attr('d', line);
    }
}
