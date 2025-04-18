import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartControl } from 'src/app/types/nhs-api/chart';

@Component({
    selector: 'app-nhs-api-line-chart-settings',
    templateUrl: './line-chart-settings.component.html',
    styleUrls: ['./line-chart-settings.component.scss'],
})
export class LineChartSettingsComponent implements OnInit {

    private data: ChartControl;
    public form: FormGroup;

    constructor(
        private fb: NonNullableFormBuilder,
        private dialogRef: MatDialogRef<LineChartSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) data: ChartControl,
    ) {
        console.log(data);
        this.data = data;
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
            markers: this.fb.control(this.data.markers),
            markerSize: this.fb.control(this.data.markerSize),
        });
    }
}
