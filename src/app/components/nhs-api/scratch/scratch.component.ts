import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
import { DatastoreSearchSql } from 'src/app/types/nhs-api/epd';
import { Observable, Subscription } from 'rxjs';
import { NhsApiStore } from 'src/app/stores/nhs-api/nhs-api.store';
import * as moment from 'moment';

const testSql = 'resource_id=EPD_202401&sql=SELECT * from `EPD_202401` WHERE BNF_CODE = "0410030C0AAAFAF" AND PRACTICE_CODE="Y03641" LIMIT 5';

@Component({
    selector: 'app-nhs-api-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS },
    ],
})
export class ScratchComponent implements OnInit, OnDestroy {

    public form!: FormGroup;

    public test1$: Observable<DatastoreSearchSql> = new Observable();
    public test2$: Observable<DatastoreSearchSql[]> = new Observable();

    private subscriptions: Subscription[] = [];

    readonly panelOpenState = signal(false);

    constructor(
        private fb: FormBuilder,
        private readonly store: NhsApiStore,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            practiceCode: this.fb.control('Y03641'),
            bnfCode: this.fb.control('0410030C0AAAFAF'),
            startDate: this.fb.control(moment('2023-01-01')),
            endDate: this.fb.control(moment('2023-12-01')),
        });
        this.test1$ = this.store.getDatastoreSearchSql(testSql);
        this.test2$ = this.store.getDatastoreSearchSqlTest();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public onSubmit() {
        const values = this.form.value;
        const startDate = values.startDate.startOf('month');
        const endDate = values.endDate.startOf('month');

        if (! startDate || !endDate) {
            return;
        }

        this.subscribeToData();

        // for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'month')) {
        //     // Make requests for data month-by-month
        //     // console.log(moment(m).format('YYYY-MM-DD'));
        // }
    }

    private subscribeToData() {
        const sub = this.test2$.subscribe(data => console.log('Component data', data));
        this.subscriptions.push(sub);
    }
}
