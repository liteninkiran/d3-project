import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartOptions } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit {

    public options: ChartOptions;
    public form: FormGroup;

    get lineGroup() {
        return this.form.get('line') as FormGroup;
    }

    constructor(
        private fb: NonNullableFormBuilder,
        private dialogRef: MatDialogRef<ChartSettingsComponent>,
        @Inject(MAT_DIALOG_DATA) data: ChartOptions,
    ) {
        this.options = data;
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

    public setColour(key: string, colour: string): void {
        this.form.patchValue({ [key]: { colour } });
        console.log(this.form.value);
    }

    private setupForm(): void {
        this.form = this.fb.group(this.getOptions());
    }

    private getDimensions() {
        return {
            width: this.fb.control(this.options.dimensions.width),
            height: this.fb.control(this.options.dimensions.height),
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
            colour: this.fb.control(this.options.line.colour),
        }
    }

    private getMarkers() {
        return {
            enabled: this.fb.control(this.options.markers.enabled),
            size: this.fb.control(this.options.markers.size),
            colour: this.fb.control(this.options.markers.colour),
            opacity: this.fb.control(this.options.markers.opacity),
            stroke: this.fb.control(this.options.markers.stroke),
            strokeColour: this.fb.control(this.options.markers.strokeColour),
            strokeOpacity: this.fb.control(this.options.markers.strokeOpacity),
        }
    }

    private getBar() {
        return {
            width: this.fb.control(this.options.bar.width),
            colour: this.fb.control(this.options.bar.colour),
        }
    }

    private getOptions() {
        return {
            chartType: this.fb.control(this.options.chartType),
            dimensions: this.fb.group(this.getDimensions()),
            margins: this.fb.group(this.getMargins()),
            line: this.fb.group(this.getLine()),
            markers: this.fb.group(this.getMarkers()),
            bar: this.fb.group(this.getBar()),
        }
    }
}
