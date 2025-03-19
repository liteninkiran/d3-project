import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Observable, Subscription } from 'rxjs';
import { MY_FORMATS } from 'src/app/config/dates';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { TimePeriod } from 'src/app/interfaces/coin-api/time-period';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';
import { CoinApiStore } from 'src/app/stores/coin-api.store';

@Component({
    selector: 'app-coin-api-request-params',
    templateUrl: './request-params.component.html',
    styleUrls: ['./request-params.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class RequestParamsComponent implements OnInit, OnDestroy {

    @Input() public defaultOptions!: ExchangeRateOptions;

    @Output() userOptions = new EventEmitter<ExchangeRateOptions>();

    public timePeriods$: Observable<TimePeriod[]> = new Observable();

    public exchangeRates$: Observable<ExchangeRate[]> = new Observable();

    public form!: FormGroup;

    readonly panelOpenState = signal(false);

    private subscriptions: Subscription[] = [];

    constructor(
        private readonly store: CoinApiStore,
        private fb: NonNullableFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.timePeriods$ = this.store.getTimePeriodData();
        this.form = this.fb.group({
            baseAssetId: this.fb.control(this.defaultOptions.assetIdBase),
            quoteAssetId: this.fb.control(this.defaultOptions.assetIdQuote),
            startDate: this.fb.control(new Date(this.defaultOptions.startTime)),
            endDate: this.fb.control(new Date(this.defaultOptions.endTime)),
            timePeriod: this.fb.control(this.defaultOptions.periodId),
        });
        this.form.controls['timePeriod'].disable();
        const sub = this.form.valueChanges.subscribe(values =>
            this.userOptions.emit({
                assetIdBase: values.baseAssetId,
                assetIdQuote: values.quoteAssetId,
                startTime: values.startDate.toISOString().slice(0, 10),
                endTime: values.endDate.toISOString().slice(0, 10),
                periodId: this.form.getRawValue().timePeriod, // Remove getRawValue() when enabled
                limit: 1000,
            })
        );
        this.subscriptions.push(sub);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }
}
