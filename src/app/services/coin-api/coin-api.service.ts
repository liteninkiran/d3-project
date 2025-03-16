import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Injectable()
export class CoinApiService {

    constructor(private http: HttpClient) { }

    public loadDataFromApi(): Observable<Asset[]> {
        const key = process.env['API_KEY'];
        const url = `https://rest.coinapi.io/v1/assets?apikey=${key}`;
        return this.http.get<Asset[]>(url);
    }
}
