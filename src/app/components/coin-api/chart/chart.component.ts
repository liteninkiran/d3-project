import { Component, Input, OnChanges, OnInit, OnDestroy, SimpleChanges, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';
import { CoinApiStore } from 'src/app/stores/coin-api.store';
import * as d3 from "d3";

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
    public svg: any;

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
    public xAxisContainer: any;
    public yAxisContainer: any;
    public legendContainer: any;
    public title: any;

    constructor(
        private readonly store: CoinApiStore,
        element: ElementRef
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
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

    private setElements(): void {
        this.xAxisContainer = this.svg
        .append('g')
        .attr('class', 'x-axis-container')
        .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);

        this.yAxisContainer = this.svg
            .append('g')
            .attr('class', 'y-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.title = this.svg
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

    private setParams(): void { }

    private setLabels(): void { }

    private setAxis(): void { }

    private setLegend(): void { }

    private draw(): void { }
}
