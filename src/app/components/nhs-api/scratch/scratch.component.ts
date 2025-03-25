import { Component, OnInit, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';

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

    readonly panelOpenState = signal(false);

    constructor(
        private fb: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            practiceCode: this.fb.control('Y03641'),
            bnfCode: this.fb.control('0410030C0AAAFAF'),
            startDate: this.fb.control(new Date('2023-01-01')),
            endDate: this.fb.control(new Date('2024-12-01')),
        });
    }

    public onSubmit() {
        const values = this.form.value;
        console.log(values);
    }
}
