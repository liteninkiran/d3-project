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
import { Data, LineDataItem } from 'src/app/interfaces/d3/data';

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
            
        });
        this.subscriptions.push(sub);
    }
}
