import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from 'src/app/config/dates';

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

    public form!: FormGroup;
    public sourceAssetId = this.fb.control('');
    public targetAssetId = this.fb.control('');
    public startDate = this.fb.control(new Date());
    public endDate = this.fb.control(new Date());

    readonly panelOpenState = signal(false);

    constructor(
        private fb: NonNullableFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            sourceAssetId: this.sourceAssetId,
            targetAssetId: this.targetAssetId,
            startDate: this.startDate,
            endDate: this.endDate,
        });
    }
}

