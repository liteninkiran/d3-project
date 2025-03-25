import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { ExchangeRate } from 'src/app/types/coin-api/exchange-rate';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';
// import { CoinApiStore } from 'src/app/stores/coin-api/coin-api.store';
import { Data } from 'src/app/types/d3/data';

import * as d3 from 'd3';
import { CurrencyPipe } from '@angular/common';

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
    public container: any; // d3.Selection<SVGGElement, {}, HTMLElement, any>;

    // Set dimensions
    public margin = {
        top: 70,
        right: 30,
        bottom: 40,
        left: 80,
    }
    public width = 1200 - this.margin.left - this.margin.right;
    public height = 500 - this.margin.top - this.margin.bottom;
    
    // Set up the x and y scales
    public x: d3.ScaleTime<number, number, never> = d3.scaleTime().range([0, this.width]);
    public y: d3.ScaleLinear<number, number, never> = d3.scaleLinear().range([this.height, 0]);
    public yMin = 0;

    // Date/time formatters
    public timeParse = d3.timeParse('%Y-%m-%dT%H:%M:%S');

    get lineData(): Data[] {
        return this.transformData();
    }

    constructor(
        // private readonly store: CoinApiStore,
        private currencyPipe: CurrencyPipe,
    ) { }

    public ngOnInit(): void {
        this.svg = this.createSvg();
        this.container = this.createContainer();
    }

    public ngOnDestroy(): void {
        console.log('Remove', this.subscriptions.length);
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.getData();
    }

    public getData() {
        this.data$ = from([]); // this.store.getExchangeRateData(this.options);
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
        return d3.select('#chart-container')
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom);
    }

    private createContainer() {
        return this.svg.append('g')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    private updateChart() {
        this.setDomains();
        this.addXAxis();
        this.addYAxis();
        this.addLine();
        this.addTooltip();
    }

    private setDomains() {
        // Define the x and y domains
        this.x.domain(d3.extent(this.lineData, d => d.x));
        this.y.domain([this.yMin, d3.max(this.lineData, d => d.y)]);
    }

    private addXAxis() {
        // Define the x-axis
        const xAxis = d3.axisBottom(this.x)
            .ticks(d3.timeMonth.every(6))
            .tickFormat(d3.timeFormat('%b %Y'));

        // Add the x-axis
        this.container.append('g')
            .attr('transform', `translate(0, ${this.height})`)
            .call(xAxis);
    }

    private addYAxis() {
        // Define the y-axis
        const yAxis = d3.axisLeft(this.y);

        // Add the y-axis
        this.container.append('g')
            .call(yAxis);
    }

    private addLine() {
        // Create the line generator
        const line: d3.Line<any> = d3.line()
            .x((d: any) => this.x(d.x))
            .y((d: any) => this.y(d.y));

        // Add the line path to the container element
        this.container.append('path')
            .datum(this.lineData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1)
            .attr('d', line);
    }

    // private xxxx(i: number, x0: Date) {
    //     const d0 = this.lineData[i - 1];
    //     const d1 = this.lineData[i];
    //     const diff0 = x0.valueOf() - d0.x.valueOf();
    //     const diff1 = d1.x.valueOf() - x0.valueOf();
    //     return diff0 > diff1 ? d1 : d0;
    // }

    private addTooltip() {
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
        const circle = this.container
            .append('circle')
            .attr('r', 0)
            .attr('fill', 'steelblue')
            .style('stroke', 'white')
            .attr('opacity', .70)
            .style('pointer-events', 'none');

        // Create a listening rectangle
        const listeningRect = this.container
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height)
            .style('pointer-events', 'all')
            .style('fill-opacity', 0)
            .style('stroke-opacity', 0)
            .style('z-index', 1);

        const mousemoveFn = (event: MouseEvent) => {
            // Find the closest data item
            const dAttribute = (event: MouseEvent) => {
                const data = this.lineData;
                const rect = this.container.select('rect')._groups[0][0];
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
                `<strong>Date:</strong> ${dataItem.x.toLocaleDateString()}<br><strong>`,
                `<strong>Value:</strong> ${this.currencyPipe.transform(dataItem.y, this.options.assetIdQuote)}`,
            ];

            // Add in our tooltip
            tooltip.style('display', 'block')
                .style('left', `${xPos + 100}px`)
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
