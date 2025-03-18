import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';
import { TimePeriod } from 'src/app/interfaces/coin-api/time-period';

const key = process.env['API_KEY'];

@Injectable({
    providedIn: 'root'
})
export class CoinApiService {

    constructor(private http: HttpClient) { }

    public getAssets(): Observable<Asset[]> {
        const url = `https://rest.coinapi.io/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url);
    }

    public getTimePeriods(): Observable<TimePeriod[]> {
        const url = `https://rest.coinapi.io/v1/exchangerate/history/periods?apikey=${key}`;
        return this.http.get<TimePeriod[]>(url);
    }
}
