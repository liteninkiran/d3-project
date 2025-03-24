import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { Asset } from '../interfaces/coin-api/asset';
import { CoinApiService, ExchangeRateOptions } from '../services/coin-api/coin-api.service';
import { TimePeriod } from '../interfaces/coin-api/time-period';
import { ExchangeRate } from '../interfaces/coin-api/exchange-rate';

export type Filter = {
    nameOrId: string,
    includeCrypto: boolean,
}

const max = 100;

@Injectable({
    providedIn: 'root'
})
export class CoinApiStore {

    private assetSubject = new BehaviorSubject<Asset[]>([]);
    private timePeriodSubject = new BehaviorSubject<TimePeriod[]>([]);
    private exchangeRateSubject = new BehaviorSubject<ExchangeRate[]>([]);

    private assetData$ : Observable<Asset[]> = this.assetSubject.asObservable();
    private timePeriodData$ : Observable<TimePeriod[]> = this.timePeriodSubject.asObservable();
    private exchangeRateData$ : Observable<ExchangeRate[]> = this.exchangeRateSubject.asObservable();

    private filter: Filter = {
        nameOrId: '',
        includeCrypto: false,
    };

    private options: ExchangeRateOptions = {} as ExchangeRateOptions;

    constructor(
        private readonly service: CoinApiService
    ) {
        this.assetData$ = this.service.getAssets().pipe(shareReplay());
        this.timePeriodData$ = this.service.getTimePeriods().pipe(shareReplay());
    }

    public getAssetData(filter: Filter): Observable<Asset[]> {
        this.filter = filter;
        this.filter.nameOrId = this.filter.nameOrId.toLowerCase();
        return this.assetData$.pipe(
            map(assets => this.filterAssets(assets).sort(this.sortAssets).slice(0, max))
        );
    }

    public getTimePeriodData(): Observable<TimePeriod[]> {
        return this.timePeriodData$;
    }

    public getExchangeRateData(options: ExchangeRateOptions): Observable<ExchangeRate[]> {
        this.options = options;
        this.exchangeRateData$ = this.service.getExchangeRates(this.options).pipe(shareReplay());
        return this.exchangeRateData$;
    }

    private filterAssets(assets: Asset[]) {
        return assets.filter(asset => this.filterAsset(asset));
    }

    private filterAsset(asset: Asset): boolean {
        const nameOrId = this.filter.nameOrId === '' ? true : (this.filterByAssetId(asset) || this.filterByAssetName(asset));
        const includeCrypto = this.filter.includeCrypto ? true : !asset.type_is_crypto;
        return nameOrId && includeCrypto;
    }

    private filterByAssetName(asset: Asset): boolean {
        if (!asset.name) {
            return false;
        }

        const assetName = asset.name.toLowerCase();
        return assetName.includes(this.filter.nameOrId);
    }

    private filterByAssetId(asset: Asset): boolean {
        const assetId = asset.asset_id.toLowerCase();
        return assetId.includes(this.filter.nameOrId);
    }

    private sortAssets(a1: Asset, a2: Asset) {
        return (a1.name ?? a1.asset_id).localeCompare((a2.name ?? a2.asset_id));
    }
}
