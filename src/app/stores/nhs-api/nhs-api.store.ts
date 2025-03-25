import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';
import { DatastoreSearch, DatastoreSearchSql } from 'src/app/types/nhs-api/epd';

@Injectable({
    providedIn: 'root'
})
export class NhsApiStore {

    private datastoreSearchSubject = new BehaviorSubject<DatastoreSearch>({} as DatastoreSearch);
    private datastoreSearchSqlSubject = new BehaviorSubject<DatastoreSearchSql>({} as DatastoreSearchSql);
    private datastoreSearchSqlArraySubject = new BehaviorSubject<DatastoreSearchSql[]>([]);

    private datastoreSearch$: Observable<DatastoreSearch> = this.datastoreSearchSubject.asObservable();
    private datastoreSearchSql$: Observable<DatastoreSearchSql> = this.datastoreSearchSqlSubject.asObservable();
    private datastoreSearchSqlArray$: Observable<DatastoreSearchSql[]> = this.datastoreSearchSqlArraySubject.asObservable();

    constructor(
        private readonly service: NhsApiService
    ) { }

    public getDatastoreSearch(options: string): Observable<DatastoreSearch> {
        this.datastoreSearch$ = this.service.getDatastoreSearch(options).pipe(shareReplay());
        return this.datastoreSearch$;
    }

    public getDatastoreSearchSql(sql: string): Observable<DatastoreSearchSql> {
        this.datastoreSearchSql$ = this.service.getDatastoreSearchSql(sql).pipe(shareReplay());
        return this.datastoreSearchSql$;
    }

    public getDatastoreSearchSqlTest(): Observable<DatastoreSearchSql[]> {
        this.datastoreSearchSqlArray$ = this.service.getDatastoreSearchSqlTest().pipe(shareReplay());
        return this.datastoreSearchSqlArray$;
    }
}
