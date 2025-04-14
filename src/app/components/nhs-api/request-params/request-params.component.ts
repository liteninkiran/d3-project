import { Component, OnInit, signal, Input, Output, EventEmitter } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
import { NhsApiService, FilterOptions } from 'src/app/services/nhs-api/nhs-api.service';

@Component({
    selector: 'app-nhs-api-request-params',
    templateUrl: './request-params.component.html',
    styleUrls: ['./request-params.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS },
    ],
})
export class RequestParamsComponent implements OnInit {

    @Input() public defaultOptions!: FilterOptions;

    @Output() userOptions = new EventEmitter<FilterOptions>();

    public form!: FormGroup;

    readonly panelOpenState = signal(false);

    constructor(
        private fb: NonNullableFormBuilder,
        private readonly service: NhsApiService,
    ) { }

    public ngOnInit(): void {
        this.setupForm();
    }

    public onSubmit() {
        const values = this.form.value;
        this.userOptions.emit({
            practiceCode: values.practiceCode,
            bnfCode: values.bnfCode,
            startDate: values.startDate,
            endDate: values.endDate,
        });
    }

    private setupForm(): void {
        this.form = this.fb.group({
            practiceCode: this.fb.control(this.defaultOptions.practiceCode),
            bnfCode: this.fb.control(this.defaultOptions.bnfCode),
            startDate: this.fb.control(this.defaultOptions.startDate),
            endDate: this.fb.control(this.defaultOptions.endDate),
        });
    }
}
