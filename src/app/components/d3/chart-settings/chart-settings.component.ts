import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartControl } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit {

    private data: ChartControl;
    public form: FormGroup;

    constructor(
        private fb: NonNullableFormBuilder,
        private dialogRef: MatDialogRef<ChartSettingsComponent>,
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
            chartType: this.fb.control(this.data.chartType),
            chartWidth: this.fb.control(this.data.chartWidth),
            chartHeight: this.fb.control(this.data.chartHeight),
            margins: this.fb.group({
                top: this.fb.control(this.data.margins.top),
                bottom: this.fb.control(this.data.margins.bottom),
                left: this.fb.control(this.data.margins.left),
                right: this.fb.control(this.data.margins.right),
            }),
        });
    }
}
