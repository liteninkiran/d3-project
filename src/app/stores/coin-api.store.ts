import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Asset } from '../interfaces/coin-api/asset';


@Injectable({
    providedIn: 'root'
})
export class CoinApiStore {

    private subject = new BehaviorSubject<Asset[]>([]);

    private data$ : Observable<Asset[]> = this.subject.asObservable();

    private filters: string[] | null = null;

    constructor(private http: HttpClient) {
        this.data$ = this.getDataFromCoinApi();
    }

    public getData(filters: string[] | null = null): Observable<Asset[]> {
        this.filters = filters === null ? null : filters.filter(f => f !== '').map(f => f.toLowerCase());
        return this.data$.pipe(
            map(assets => this.filterAssets(assets).sort(this.sortAssets))
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
        return this.filterByAssetId(asset) || this.filterByAssetName(asset);
    }

    private filterByAssetName(asset: Asset): boolean {
        if (this.filters === null) {
            return true;
        }

        if (!asset.name) {
            return false;
        }

        const assetName = asset.name.toLowerCase();
        return this.filters.filter(filter => assetName.includes(filter)).length > 0;
    }

    private filterByAssetId(asset: Asset): boolean {
        if (this.filters === null) {
            return true;
        }

        const assetId = asset.asset_id.toLowerCase();
        return this.filters.filter(filter => assetId.includes(filter)).length > 0;
    }

    private sortAssets(a1: Asset, a2: Asset) {
        return (a1.name ?? a1.asset_id).localeCompare((a2.name ?? a2.asset_id));
    }
}
