import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { NhsService } from 'src/app/services/nhs/nhs.service';
import { DatastoreSearch, DatastoreSearchSql } from 'src/app/types/nhs/epd';

@Injectable({
    providedIn: 'root'
})
export class NhsStore {

    private datastoreSearchSubject = new BehaviorSubject<DatastoreSearch[]>([]);
    private datastoreSearchSqlSubject = new BehaviorSubject<DatastoreSearchSql[]>([]);

    private datastoreSearch$ : Observable<DatastoreSearch[]> = this.datastoreSearchSubject.asObservable();
    private datastoreSearchSql$ : Observable<DatastoreSearchSql[]> = this.datastoreSearchSqlSubject.asObservable();

    constructor(
        private readonly service: NhsService
    ) { }

    public getDatastoreSearch(options: string): Observable<DatastoreSearch[]> {
        this.datastoreSearch$ = this.service.getDatastoreSearch(options).pipe(shareReplay());
        return this.datastoreSearch$;
    }

    public getDatastoreSearchSql(sql: string): Observable<DatastoreSearchSql[]> {
        this.datastoreSearchSql$ = this.service.getDatastoreSearchSql(sql).pipe(shareReplay());
        return this.datastoreSearchSql$;
    }
}
