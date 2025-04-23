import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSeriesComponent } from '../components/d3/time-series/time-series.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartSettingsComponent } from '../components/d3/chart-settings/chart-settings.component';
import { DemoChartComponent } from '../components/d3/demo-chart/demo-chart.component';

@NgModule({
    declarations: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        DemoChartComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        DemoChartComponent,
    ],
    providers: [
    ],
})
export class D3ChartsModule { }
