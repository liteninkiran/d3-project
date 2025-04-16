import { Component, OnInit, Inject } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
import { FilterOptions } from 'src/app/services/nhs-api/nhs-api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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

    public defaultOptions: FilterOptions;
    public form: FormGroup;

    constructor(
        private fb: NonNullableFormBuilder,
        private dialogRef: MatDialogRef<RequestParamsComponent>,
        @Inject(MAT_DIALOG_DATA) data: FilterOptions,
    ) {
        this.defaultOptions = data;
    }

    public ngOnInit(): void {
        this.setupForm();
    }

    public handleSubmit() {
        this.dialogRef.close(this.form.value);
    }

    public handleClose() {
        this.dialogRef.close();
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
