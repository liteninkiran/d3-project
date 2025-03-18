import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { TimePeriod } from 'src/app/interfaces/coin-api/time-period';

const baseUrl = 'https://rest.coinapi.io';
const key = process.env['API_KEY'];

export interface ExchangeRateOptions {
    startTime: string;
    endTime: string;
    periodId: string;
    limit: number;
    assetIdBase: string;
    assetIdQuote: string;
}

@Injectable({
    providedIn: 'root'
})
export class CoinApiService {

    constructor(private http: HttpClient) { }

    public getAssets(): Observable<Asset[]> {
        const url = `${baseUrl}/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url);
    }

    public getTimePeriods(): Observable<TimePeriod[]> {
        const url = `${baseUrl}/v1/exchangerate/history/periods?apikey=${key}`;
        return this.http.get<TimePeriod[]>(url);
    }

    public getExchangeRates(options: ExchangeRateOptions): Observable<ExchangeRate[]> {
        const path = `${baseUrl}/v1/exchangerate/${options.assetIdBase}/${options.assetIdQuote}/history`;
        const params = `apikey=${key}&period_id=${options.periodId}&time_start=${options.startTime}&time_end=${options.endTime}&limit=${options.limit}`;
        const url = `${path}?${params}`;
        return this.http.get<ExchangeRate[]>(url);
    }
}
