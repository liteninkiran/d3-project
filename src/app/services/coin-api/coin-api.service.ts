import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Injectable()
export class CoinApiService {

    private data$: Observable<Asset[]> = new Observable();

    constructor(private http: HttpClient) {
        this.data$ = this.getData().pipe(shareReplay(1));
    }

    private getData(): Observable<Asset[]> {
        const key = process.env['API_KEY'];
        const url = `https://rest.coinapi.io/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url);
    }

    public loadDataFromApi(): Observable<Asset[]> {
        return this.data$;
    }
}
