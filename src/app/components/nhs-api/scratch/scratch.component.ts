import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, FormBuilder, NonNullableFormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
import { DatastoreSearchSql } from 'src/app/types/nhs-api/epd';
import { Observable, Subscription } from 'rxjs';
import { NhsApiStore } from 'src/app/stores/nhs-api/nhs-api.store';
import * as moment from 'moment';
import { NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';

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

    public data$: Observable<DatastoreSearchSql> = new Observable();

    public data: DatastoreSearchSql[] = [];

    private subscriptions: Subscription[] = [];

    readonly panelOpenState = signal(false);

    constructor(
        private fb: NonNullableFormBuilder,
        private readonly store: NhsApiStore,
        private readonly service: NhsApiService,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            practiceCode: this.fb.control('Y03641'),
            bnfCode: this.fb.control('0410030C0AAAFAF'),
            startDate: this.fb.control(moment('2023-01-01')),
            endDate: this.fb.control(moment('2023-12-01')),
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public onSubmit() {
        this.data$ = this.service.getMonthlyData(this.form.value);
        const sub = this.data$.subscribe(data => this.data.push(data));
        this.subscriptions.push(sub);
    }
}
