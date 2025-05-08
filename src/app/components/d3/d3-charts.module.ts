import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { MaterialModule } from 'src/app/modules/material.module';
import { ChartSettingsComponent } from './chart-settings/chart-settings.component';
import { LineOptionsComponent } from './chart-settings/line-options/line-options.component';
import { TimeSeriesComponent } from './time-series/time-series.component';

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
