import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Asset } from '../interfaces/coin-api/asset';

export type Filters = {
    name: string[];
    assetId: string[];
    fuzzy: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class CoinApiStore {

    private subject = new BehaviorSubject<Asset[]>([]);

    private data$ : Observable<Asset[]> = this.subject.asObservable();

    private filters: Filters = {
        name: [],
        assetId: [],
        fuzzy: false,
    }

    constructor(private http: HttpClient) {
        this.data$ = this.getDataFromCoinApi();
    }

    public getData(filters: Filters): Observable<Asset[]> {
        this.filters = filters;
        this.filters.name = this.parseFilter(this.filters.name);
        this.filters.assetId = this.parseFilter(this.filters.assetId);
        return this.data$.pipe(
            map(assets => this.filterAssets(assets).sort(this.sortAssets).slice(0, 10))
        );
    }

    private parseFilter(filter: any): any {
        return filter ? filter.filter((x: string) => x !== '').map((x: string) => x.toLowerCase()) : filter;
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
        return this.filterByAssetId(asset) && this.filterByAssetName(asset);
    }

    private filterByAssetName(asset: Asset): boolean {
        if (this.filters.name.length === 0) {
            return true;
        }

        if (!asset.name) {
            return false;
        }

        const assetName = asset.name.toLowerCase();
        return this.filters.fuzzy
            ? this.filters.name.filter(filter => assetName.includes(filter)).length > 0
            : this.filters.name.filter(filter => assetName === filter.toLowerCase()).length > 0;
    }

    private filterByAssetId(asset: Asset): boolean {
        if (this.filters.assetId.length === 0) {
            return true;
        }

        const assetId = asset.asset_id.toLowerCase();
        return this.filters.fuzzy
            ? this.filters.assetId.filter(filter => assetId.includes(filter)).length > 0
            : this.filters.assetId.filter(filter => assetId === filter).length > 0;
    }

    private sortAssets(a1: Asset, a2: Asset) {
        return (a1.name ?? a1.asset_id).localeCompare((a2.name ?? a2.asset_id));
    }
}
