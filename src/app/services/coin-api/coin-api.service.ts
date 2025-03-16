import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Injectable()
export class CoinApiService {

    constructor(private http: HttpClient) { }

    public loadDataFromApi(): Observable<Asset[]> {
        const url = 'https://rest.coinapi.io/v1/assets?apikey=';
        return this.http.get<Asset[]>(url);
    }
}
