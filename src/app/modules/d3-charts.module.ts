import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSeriesComponent } from '../components/d3/time-series/time-series.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartSettingsComponent } from '../components/d3/chart-settings/chart-settings.component';
import { NgxColorsModule } from 'ngx-colors';
import { LineOptionsComponent } from '../components/d3/chart-settings/line-options/line-options.component';

@NgModule({
    declarations: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        LineOptionsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxColorsModule,
    ],
    exports: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        LineOptionsComponent,
    ],
    providers: [
    ],
})
export class D3ChartsModule { }
