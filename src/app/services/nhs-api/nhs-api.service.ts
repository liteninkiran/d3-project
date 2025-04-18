import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, mergeMap, Observable, of, scan } from 'rxjs';
import { DatastoreSearch, DatastoreSearchSql, FilterOptions } from 'src/app/types/nhs-api/epd';
import { allData } from 'src/app/mocks/nhs-api/prescribingData';
import * as moment from 'moment';

const baseUrl1 = 'https://opendata.nhsbsa.net/api/3/action/datastore_search';
const baseUrl2 = 'https://opendata.nhsbsa.net/api/3/action/datastore_search_sql';

export const defaultOptions: FilterOptions = {
    startDate: moment('2024-01-01'),
    endDate: moment('2024-12-01'),
    practiceCode: 'J83601',
    bnfCode: '0407010H0AAAMAM',
    concurrent: 3,
}

@Injectable({
    providedIn: 'root'
})
export class NhsApiService {

    constructor(private http: HttpClient) { }

    public getDatastoreSearch(options: string): Observable<DatastoreSearch> {
        const url = `${baseUrl1}?${options}`;
        return this.http.get<DatastoreSearch>(url);
    }

    public getDatastoreSearchSql(resourceId: string, sql: string): Observable<DatastoreSearchSql> {
        const url = `${baseUrl2}?resource_id=${resourceId}&sql=${sql}`;
        return this.http.get<DatastoreSearchSql>(url);
    }

    private getDatastoreSearchMonthly(url: string): Observable<DatastoreSearchSql> {
        return this.http.get<DatastoreSearchSql>(url);
    }

    private getUrls(options: FilterOptions): string[] {
        // Ensure first day of month is selected
        const startDate = options.startDate.startOf('month').clone();
        const endDate = options.endDate.startOf('month').clone();

        const urls = [];

        const includeSearchTerm = (key: string, field: string) => options[key] ? `${field} = '${options[key]}' AND ` : '';
        const removeJoiningTerm = (sql: string, term: string) => sql.endsWith(term) ? sql.substring(0, sql.length - term.length).trim() : sql;

        const getSql = (resourceId: string): string => {
            const tableName = '`' + resourceId + '`';
            const limit = 1000;
            let sql = `SELECT * from ${tableName} WHERE `;
            sql += includeSearchTerm('bnfCode', 'BNF_CODE');
            sql += includeSearchTerm('practiceCode', 'PRACTICE_CODE');
            sql = sql.trim();
            sql = removeJoiningTerm(sql, 'AND');
            sql = removeJoiningTerm(sql, 'WHERE');
            sql = `${sql} LIMIT ${limit}`
            return sql;
        }

        for (const m = startDate; m.isSameOrBefore(endDate); m.add(1, 'month')) {
            const dt = m.format('YYYYMM');
            const resourceId = `EPD_${dt}`;
            const sql = getSql(resourceId);
            const url = `${baseUrl2}?resource_id=${resourceId}&sql=${sql}`;
            urls.push(url);
        }

        return urls;
    }

    public getMonthlyData(options: FilterOptions): Observable<DatastoreSearchSql[]> {
        const useMocks = true;
        const urls = this.getUrls(options);
        const merged = mergeMap((url: string) => this.getDatastoreSearchMonthly(url), options.concurrent);
        const scanned = scan((acc, data) => [...acc, data], []);
        return useMocks
            ? of(allData)
            : from(urls).pipe(merged, scanned);
    }
}
