import { Component, OnInit, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
import { DatastoreSearch } from 'src/app/types/nhs-api/epd';
import { Observable } from 'rxjs';
import { NhsApiStore } from 'src/app/stores/nhs-api/nhs-api.store';
import { NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';
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

    public data$: Observable<DatastoreSearch[]> = new Observable();

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

    public onSubmit() {
        this.data$ = this.service.getMonthlyData(this.form.value);
    }
}
