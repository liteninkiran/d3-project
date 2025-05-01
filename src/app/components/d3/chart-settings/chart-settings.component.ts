import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartOptions, ChartDimensions, ChartSettings } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit {

    private options: ChartOptions;
    public dimensions: ChartDimensions;
    public form: FormGroup;

    constructor(
        private fb: NonNullableFormBuilder,
        private dialogRef: MatDialogRef<ChartSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) data: ChartSettings,
    ) {
        this.options = data.options;
        this.dimensions = data.options.dimensions;
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
        this.form = this.fb.group({
            options: this.fb.group(this.getOptions()),
            dimensions: this.fb.group(this.getDimensions()),
        });
    }

    private getDimensions() {
        return {
            width: this.fb.control(this.dimensions.width),
            height: this.fb.control(this.dimensions.height),
        }
    }

    private getOptions() {
        const margins = this.getMargins();
        return {
            line: this.fb.group(this.getLine()),
            bar: this.fb.group(this.getBar()),
            markers: this.fb.control(this.options.markers),
            markerSize: this.fb.control(this.options.markerSize),
            chartType: this.fb.control(this.options.chartType),
            margins: this.fb.group(margins),
        }
    }

    private getMargins() {
        return {
            top: this.fb.control(this.options.margins.top),
            bottom: this.fb.control(this.options.margins.bottom),
            left: this.fb.control(this.options.margins.left),
            right: this.fb.control(this.options.margins.right),
        }
    }

    private getLine() {
        return {
            stroke: this.fb.control(this.options.line.stroke),
        }
    }

    private getBar() {
        return {
            width: this.fb.control(this.options.bar.width),
        }
    }
}
