import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSeriesComponent } from '../components/d3/time-series/time-series.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartSettingsComponent } from '../components/d3/chart-settings/chart-settings.component';

@NgModule({
    declarations: [
        TimeSeriesComponent,
        ChartSettingsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        TimeSeriesComponent,
        ChartSettingsComponent,
    ],
    providers: [
    ],
})
export class D3ChartsModule { }
