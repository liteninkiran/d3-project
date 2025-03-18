import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable } from 'rxjs';
import { MY_FORMATS } from 'src/app/config/dates';
import { TimePeriod } from 'src/app/interfaces/coin-api/time-period';
import { CoinApiStore } from 'src/app/stores/coin-api.store';

@Component({
    selector: 'app-coin-api-request-params',
    templateUrl: './request-params.component.html',
    styleUrls: ['./request-params.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
})
export class RequestParamsComponent implements OnInit {

    public data$: Observable<TimePeriod[]> = new Observable();

    public form!: FormGroup;
    public sourceAssetId = this.fb.control('BTC');
    public targetAssetId = this.fb.control('GBP');
    public timePeriod = this.fb.control('1DAY');
    public startDate = this.fb.control(new Date(2020, 0, 1));
    public endDate = this.fb.control(new Date(2023, 11, 31));

    readonly panelOpenState = signal(false);

    constructor(
        private readonly store: CoinApiStore,
        private fb: NonNullableFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.store.getTimePeriodData();
        this.form = this.fb.group({
            sourceAssetId: this.sourceAssetId,
            targetAssetId: this.targetAssetId,
            startDate: this.startDate,
            endDate: this.endDate,
            timePeriod: this.timePeriod,
        });
    }

    public onSubmit() {
        console.log(this.form.value);
    }
}

