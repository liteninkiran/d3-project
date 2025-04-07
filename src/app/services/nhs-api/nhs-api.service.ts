import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, mergeMap, Observable, scan, toArray } from 'rxjs';
import { DatastoreSearch, DatastoreSearchSql } from 'src/app/types/nhs-api/epd';
import * as moment from 'moment';

const baseUrl = 'https://opendata.nhsbsa.net/api/3/action/datastore_search';
export type Options = {
    startDate: moment.Moment,
    endDate: moment.Moment,
    practiceCode: string,
    bnfCode: string,
}

@Injectable({
    providedIn: 'root'
})
export class NhsApiService {

    constructor(private http: HttpClient) { }

    public getDatastoreSearch(options: string): Observable<DatastoreSearch> {
        const url = `${baseUrl}?${options}`;
        return this.http.get<DatastoreSearch>(url);
    }

    public getDatastoreSearchSql(resourceId: string, sql: string): Observable<DatastoreSearchSql> {
        const url = `${baseUrl}?resource_id=${resourceId}&sql=${sql}`;
        return this.http.get<DatastoreSearchSql>(url);
    }

    private getDatastoreSearchMonthly(url: string): Observable<DatastoreSearch> {
        return this.http.get<DatastoreSearch>(url);
    }

    private getUrls(options: Options): string[] {
        // Ensure first day of month is selected
        const startDate = options.startDate.startOf('month').clone();
        const endDate = options.endDate.startOf('month').clone();

        const urls = [];

        const includeSearchTerm = (key: string, field: string) => options[key] ? `${field} = '${options[key]}' AND ` : '';
        const removeJoiningTerm = (sql: string, term: string) => sql.endsWith(term) ? sql.substring(0, sql.length - term.length).trim() : sql;

        const getSql = (resourceId: string): string => {
            const tableName = '`' + resourceId + '`';
            const limit = 5;
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
            const url = `${baseUrl}?resource_id=${resourceId}&sql=${sql}`;
            urls.push(url);
        }

        return urls;
    }

    public getMonthlyData(options: Options): Observable<DatastoreSearch[]> {
        const urls = this.getUrls(options);
        return from(urls).pipe(
            mergeMap((url: string) => this.getDatastoreSearchMonthly(url), 4),
            scan((acc, data) => [...acc, data], []),
        );
    }
}
