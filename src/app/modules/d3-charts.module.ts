import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSeriesComponent } from '../components/d3/time-series/time-series.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartSettingsComponent } from '../components/d3/chart-settings/chart-settings.component';
import { DemoChartComponent } from '../components/d3/demo-chart/demo-chart.component';
import { DemoChart2Component } from '../components/d3/demo-chart-2/demo-chart-2.component';
import { ChartSettings2Component } from '../components/d3/chart-settings-2/chart-settings-2.component';

@NgModule({
    declarations: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        ChartSettings2Component,
        DemoChartComponent,
        DemoChart2Component,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        ChartSettings2Component,
        DemoChartComponent,
        DemoChart2Component,
    ],
    providers: [
    ],
})
export class D3ChartsModule { }
