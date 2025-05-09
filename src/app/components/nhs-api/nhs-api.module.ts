import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material.module';
import { NhsApiComponent } from 'src/app/pages/nhs-api/nhs-api.component';
import { LineChartSettingsComponent } from './line-chart-settings/line-chart-settings.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { RequestParamsComponent } from './request-params/request-params.component';

@NgModule({
    declarations: [
        NhsApiComponent,
        LineChartComponent,
        LineChartSettingsComponent,
        RequestParamsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        NhsApiComponent,
        LineChartComponent,
        LineChartSettingsComponent,
        RequestParamsComponent,
    ],
    providers: [
        DatePipe,
        DecimalPipe,
    ],
})
export class NhsApiModule { }
