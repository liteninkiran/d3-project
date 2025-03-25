import { Component, OnInit, signal } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MONTH_YEAR_FORMATS } from 'src/app/config/dates';
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

    readonly panelOpenState = signal(false);

    constructor(
        private fb: FormBuilder,
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
        const values = this.form.value;
        const startDate = values.startDate.startOf('month');
        const endDate = values.endDate.startOf('month');

        for (let m = moment(startDate); m.isSameOrBefore(endDate); m.add(1, 'month')) {
            // Make requests for data month-by-month
            // console.log(moment(m).format('YYYY-MM-DD'));
        }
    }
}
