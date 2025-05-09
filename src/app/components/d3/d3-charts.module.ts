import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { MaterialModule } from 'src/app/modules/material.module';
import { ChartSettingsComponent } from './chart-settings/chart-settings.component';
import { LineOptionsComponent } from './chart-settings/line-options/line-options.component';
import { TimeSeriesComponent } from './time-series/time-series.component';
import { MarkerOptionsComponent } from './chart-settings/marker-options/marker-options.component';
import { BarOptionsComponent } from './chart-settings/bar-options/bar-options.component';
import { DimensionOptionsComponent } from './chart-settings/dimension-options/dimension-options.component';
import { ChartTypeOptionsComponent } from './chart-settings/chart-type-options/chart-type-options.component';
import { XAxisOptionsComponent } from './chart-settings/axes-options/x-axis-options/x-axis-options.component';
import { YAxisOptionsComponent } from './chart-settings/axes-options/y-axis-options/y-axis-options.component';

@NgModule({
    declarations: [
        TimeSeriesComponent,
        ChartSettingsComponent,
        LineOptionsComponent,
        MarkerOptionsComponent,
        BarOptionsComponent,
        DimensionOptionsComponent,
        ChartTypeOptionsComponent,
        XAxisOptionsComponent,
        YAxisOptionsComponent,
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
    ],
    providers: [
    ],
})
export class D3ChartsModule { }
