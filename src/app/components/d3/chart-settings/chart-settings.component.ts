import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChartOptions, SetColour } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-chart-settings',
    templateUrl: './chart-settings.component.html',
    styleUrls: ['./chart-settings.component.scss'],
})
export class ChartSettingsComponent implements OnInit {

    public options: ChartOptions;
    public form: FormGroup;

    get chartTypeGroup() {
        return this.form.get('chartType') as FormGroup;
    }

    get lineGroup() {
        return this.form.get('line') as FormGroup;
    }

    get markerGroup() {
        return this.form.get('markers') as FormGroup;
    }

    get barGroup() {
        return this.form.get('bar') as FormGroup;
    }

    get dimensionGroup() {
        return this.form.get('dimensions') as FormGroup;
    }

    get marginGroup() {
        return this.form.get('margins') as FormGroup;
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

    public setColour(key: string, colour: string, colourKey: string = 'colour'): void {
        this.form.patchValue({ [key]: { [colourKey]: colour } });
        console.log(this.form.value);
    }

    public setColourFromChild(data: SetColour): void {
        this.setColour(data.key, data.colour, data.colourKey);
    }

    private setupForm(): void {
        this.form = this.fb.group({
            chartType: this.fb.group(this.chartTypeDef()),
            dimensions: this.fb.group(this.dimensionGroupDef()),
            margins: this.fb.group(this.marginGroupDef()),
            line: this.fb.group(this.lineGroupDef()),
            markers: this.fb.group(this.markerGroupDef()),
            bar: this.fb.group(this.barGroupDef()),
        });
    }

    private chartTypeDef() {
        return {
            type: this.fb.control(this.options.chartType.type),
        }
    }

    private dimensionGroupDef() {
        return {
            width: this.fb.control(this.options.dimensions.width),
            height: this.fb.control(this.options.dimensions.height),
        }
    }

    private marginGroupDef() {
        return {
            top: this.fb.control(this.options.margins.top),
            bottom: this.fb.control(this.options.margins.bottom),
            left: this.fb.control(this.options.margins.left),
            right: this.fb.control(this.options.margins.right),
        }
    }

    private lineGroupDef() {
        return {
            stroke: this.fb.control(this.options.line.stroke),
            colour: this.fb.control(this.options.line.colour),
        }
    }

    private markerGroupDef() {
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

    private barGroupDef() {
        return {
            width: this.fb.control(this.options.bar.width),
            colour: this.fb.control(this.options.bar.colour),
        }
    }
}
