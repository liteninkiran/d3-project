import { Component, OnInit, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
import { DatastoreSearchSql } from 'src/app/types/nhs-api/epd';
import { Observable, Subject, switchMap } from 'rxjs';
import { NhsApiService, Options } from 'src/app/services/nhs-api/nhs-api.service';
import * as moment from 'moment';

@Component({
    selector: 'app-nhs-api-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS },
    ],
})
export class ScratchComponent implements OnInit {

    public form!: FormGroup;

    private fetchData$ = new Subject<Options>();

    private getData = switchMap((params: Options) => this.service.getMonthlyData(params));

    public data$: Observable<DatastoreSearchSql[]> = this.fetchData$.pipe(this.getData);

    readonly panelOpenState = signal(false);

    constructor(
        private fb: NonNullableFormBuilder,
        private readonly service: NhsApiService,
    ) { }

    public ngOnInit(): void {
        this.setupForm();
    }

    public onSubmit() {
        this.fetchData$.next(this.form.value);
    }

    private setupForm(): void {
        this.form = this.fb.group({
            practiceCode: this.fb.control('Y03641'),
            bnfCode: this.fb.control('0410030C0AAAFAF'),
            startDate: this.fb.control(moment('2023-01-01')),
            endDate: this.fb.control(moment('2023-12-01')),
        });
    }
}
