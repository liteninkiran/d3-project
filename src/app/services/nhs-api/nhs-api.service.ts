import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { DatastoreSearch, DatastoreSearchSql } from 'src/app/types/nhs-api/epd';

const baseUrl = 'https://opendata.nhsbsa.net/api/3/action/datastore_search';

@Injectable({
    providedIn: 'root'
})
export class NhsApiService {

    private urls: string[] = [
        'https://opendata.nhsbsa.net/api/3/action/datastore_search_sql?resource_id=EPD_202401&sql=SELECT * from `EPD_202401` WHERE BNF_CODE = "0410030C0AAAFAF" AND PRACTICE_CODE="Y03641" LIMIT 5',
        'https://opendata.nhsbsa.net/api/3/action/datastore_search_sql?resource_id=EPD_202402&sql=SELECT * from `EPD_202402` WHERE BNF_CODE = "0410030C0AAAFAF" AND PRACTICE_CODE="Y03641" LIMIT 5',
        'https://opendata.nhsbsa.net/api/3/action/datastore_search_sql?resource_id=EPD_202403&sql=SELECT * from `EPD_202403` WHERE BNF_CODE = "0410030C0AAAFAF" AND PRACTICE_CODE="Y03641" LIMIT 5',
    ];

    constructor(private http: HttpClient) { }

    public getDatastoreSearch(options: string): Observable<DatastoreSearch> {
        const url = `${baseUrl}?${options}`;
        return this.http.get<DatastoreSearch>(url);
    }

    public getDatastoreSearchSql(sql: string): Observable<DatastoreSearchSql> {
        const url = `${baseUrl}_sql?${sql}`;
        return this.http.get<DatastoreSearchSql>(url);
    }

    // Example of looping through array and making multiple requests
    public getDatastoreSearchSqlTest(): Observable<DatastoreSearchSql[]> {
        const reducer = (arr: DatastoreSearchSql[], r: DatastoreSearchSql) => arr.concat(r);
        const combineArrays = (results: DatastoreSearchSql[]) => results.reduce(reducer, []);
        const requestFn = (url: string) => this.http.get<DatastoreSearchSql>(url);
        const getRequests = this.urls.map(requestFn);
        return forkJoin(getRequests).pipe(map(combineArrays));
    }
}
