import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Asset } from '../interfaces/coin-api/asset';

export type Filter = {
    nameOrId: string,
    includeCrypto: boolean,
}

const max = 100;

@Injectable({
    providedIn: 'root'
})
export class CoinApiStore {

    private subject = new BehaviorSubject<Asset[]>([]);

    private data$ : Observable<Asset[]> = this.subject.asObservable();

    private filter: Filter = {
        nameOrId: '',
        includeCrypto: false,
    };

    constructor(private http: HttpClient) {
        this.data$ = this.getDataFromCoinApi();
    }

    public getData(filter: Filter): Observable<Asset[]> {
        this.filter = filter;
        this.filter.nameOrId = this.filter.nameOrId.toLowerCase();
        return this.data$.pipe(
            map(assets => this.filterAssets(assets).sort(this.sortAssets).slice(0, max))
        );
    }

    private getDataFromCoinApi(): Observable<Asset[]> {
        const key = process.env['API_KEY'];
        const url = `https://rest.coinapi.io/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url).pipe(shareReplay(1));
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
