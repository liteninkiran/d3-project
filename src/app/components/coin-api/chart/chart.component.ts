import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';
import { CoinApiStore } from 'src/app/stores/coin-api.store';

@Component({
    selector: 'app-coin-api-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {

    @Input() public options: ExchangeRateOptions = {} as ExchangeRateOptions;

    public data$: Observable<ExchangeRate[]> = new Observable();

    constructor(
        private readonly store: CoinApiStore,
    ) { }

    public ngOnInit(): void {
        this.getData();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.getData();
    }

    public getData() {
        this.data$ = this.store.getExchangeRateData(this.options)
        // this.data$.subscribe(x => {
        //     console.log(x);
        // });
    }
}
