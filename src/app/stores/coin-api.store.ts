import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Asset } from '../interfaces/coin-api/asset';

const max = 100;

@Injectable({
    providedIn: 'root'
})
export class CoinApiStore {

    private subject = new BehaviorSubject<Asset[]>([]);

    private data$ : Observable<Asset[]> = this.subject.asObservable();

    constructor(private http: HttpClient) {
        this.data$ = this.getDataFromCoinApi();
    }

    public getData(includeCrypto = false): Observable<Asset[]> {
        return this.data$.pipe(
            map(assets => this.filterCrypto(assets, includeCrypto)),
            map(assets => this.sortAssets(assets)),
        );
    }

    public getFilteredData(value: string, includeCrypto = false): Observable<Asset[]> {
        return this.data$.pipe(
            map(assets => this.filterCrypto(assets, includeCrypto)),
            map(assets => this.filterName(assets, value)),
            map(assets => this.sortAssets(assets)),
        )
    }

    private filterCrypto(assets: Asset[], filter: boolean): Asset[] {
        return filter ? assets : assets.filter(asset => !asset.type_is_crypto);
    }

    private filterName(assets: Asset[], filter: string) {
        return filter ? assets : assets.filter(asset => asset.name?.toLocaleUpperCase().includes(filter));
    }

    private sortAssets(assets: Asset[]) {
        return assets.sort(this.assetSortFn).slice(0, max);
    }

    private getDataFromCoinApi(): Observable<Asset[]> {
        const key = process.env['API_KEY'];
        const url = `https://rest.coinapi.io/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url).pipe(shareReplay(1));
    }

    private assetSortFn(a1: Asset, a2: Asset) {
        return (a1.name ?? a1.asset_id).localeCompare((a2.name ?? a2.asset_id));
    }

}
