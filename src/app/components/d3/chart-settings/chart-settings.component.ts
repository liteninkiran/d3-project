import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartControl, ChartDimensions, ChartSettings } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit {

    private options: ChartControl;
    public dimensions: ChartDimensions;
    public form: FormGroup;

    constructor(
        private fb: NonNullableFormBuilder,
        private dialogRef: MatDialogRef<ChartSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) data: ChartSettings,
    ) {
        this.options = data.options;
        this.dimensions = data.dimensions;
    }

    public ngOnInit(): void {
        this.setupForm();
    }

    public handleClose() {
        this.dialogRef.close();
    }

    public onRadioClick(event: Event): void {
        const el = event.target as HTMLOptionElement;
        el.blur();
    }

    private setupForm(): void {
        const margins = {
            top: this.fb.control(this.options.margins.top),
            bottom: this.fb.control(this.options.margins.bottom),
            left: this.fb.control(this.options.margins.left),
            right: this.fb.control(this.options.margins.right),
        }
        const dimensions = {
            width: this.fb.control(this.dimensions.width),
            height: this.fb.control(this.dimensions.height),
        }
        const options = {
            markers: this.fb.control(this.options.markers),
            markerSize: this.fb.control(this.options.markerSize),
            chartType: this.fb.control(this.options.chartType),
            margins: this.fb.group(margins),
        }
        const formGroup = {
            options: this.fb.group(options),
            dimensions: this.fb.group(dimensions),
            line: this.fb.group({
                stroke: this.fb.control(1),
            }),
            bar: this.fb.group({
                width: this.fb.control(10),
            }),
        }
        this.form = this.fb.group(formGroup);
    }
}
