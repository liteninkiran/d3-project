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

    public getData(): Observable<Asset[]> {
        return this.data$.pipe(
            map(assets => assets.sort(this.sortAssets).slice(0, max))
        );
    }

    public getFilteredData(value: string): Observable<Asset[]> {
        return this.data$.pipe(
            map(assets => assets.filter(asset => asset.name?.toLocaleUpperCase().includes(value)).sort(this.sortAssets).slice(0, max))
        );
    }

    private getDataFromCoinApi(): Observable<Asset[]> {
        const key = process.env['API_KEY'];
        const url = `https://rest.coinapi.io/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url).pipe(shareReplay(1));
    }

    private sortAssets(a1: Asset, a2: Asset) {
        return (a1.name ?? a1.asset_id).localeCompare((a2.name ?? a2.asset_id));
    }

}
