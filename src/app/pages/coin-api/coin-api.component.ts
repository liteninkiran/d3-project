import { Component, OnInit } from '@angular/core';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';

@Component({
    selector: 'app-coin-api',
    templateUrl: './coin-api.component.html',
    styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit {

    public defaultOptions: ExchangeRateOptions = {
        assetIdBase: 'BTC',
        assetIdQuote: 'GBP',
        startTime: '2020-04-01',
        endTime: '2025-03-01',
        periodId: '1DAY',
        limit: 10000,
    };
    public options = this.defaultOptions;

    constructor( ) { }

    public ngOnInit(): void {

    }

    public storeUserOptions(options: ExchangeRateOptions) {
        this.options = options;
    }
}
