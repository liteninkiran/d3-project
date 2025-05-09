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

    get xAxisGroup() {
        return this.form.get('axes.xAxis') as FormGroup;
    }

    get yAxisGroup() {
        return this.form.get('axes.yAxis') as FormGroup;
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

    public setColourFromChild(data: SetColour): void {
        this.form.patchValue({ [data.key]: { [data.colourKey]: data.colour } });
    }

    private setupForm(): void {
        this.form = this.fb.group({
            chartType: this.fb.group(this.chartTypeDef()),
            dimensions: this.fb.group(this.dimensionGroupDef()),
            margins: this.fb.group(this.marginGroupDef()),
            line: this.fb.group(this.lineGroupDef()),
            markers: this.fb.group(this.markerGroupDef()),
            bar: this.fb.group(this.barGroupDef()),
            axes: this.fb.group(this.axesGroupDef()),
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

    private axesGroupDef() {
        return {
            xAxis: this.fb.group(this.xAxisGroupDef()),
            yAxis: this.fb.group(this.yAxisGroupDef()),
        }
    }

    private xAxisGroupDef() {
        return {
            fontSize: this.fb.control(this.options.axes.xAxis.fontSize),
            rotation: this.fb.control(this.options.axes.xAxis.rotation),
            textAnchor: this.fb.control(this.options.axes.xAxis.textAnchor),
            dateFormat: this.fb.control(this.options.axes.xAxis.dateFormat),
        }
    }

    private yAxisGroupDef() {
        return {
            fontSize: this.fb.control(this.options.axes.yAxis.fontSize),
            ticks: this.fb.control(this.options.axes.yAxis.ticks),
            tickFormat: this.fb.control(this.options.axes.yAxis.tickFormat),
            gridLines: this.fb.group(this.yAxisGridlinesGroupDef()),
        }
    }

    private yAxisGridlinesGroupDef() {
        return {
            enabled: this.fb.control(this.options.axes.yAxis.gridLines.enabled),
        }
    }
}
