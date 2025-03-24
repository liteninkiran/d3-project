import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatastoreSearch, DatastoreSearchSql } from 'src/app/types/nhs-api/epd';

const baseUrl = 'https://opendata.nhsbsa.net/api/3/action/datastore_search';

@Injectable({
    providedIn: 'root'
})
export class NhsApiService {

    constructor(private http: HttpClient) { }

    public getDatastoreSearch(options: string): Observable<DatastoreSearch[]> {
        const url = `${baseUrl}?${options}`;
        return this.http.get<DatastoreSearch[]>(url);
    }

    public getDatastoreSearchSql(sql: string): Observable<DatastoreSearchSql[]> {
        const url = `${baseUrl}_sql?${sql}`;
        return this.http.get<DatastoreSearchSql[]>(url);
    }
}
