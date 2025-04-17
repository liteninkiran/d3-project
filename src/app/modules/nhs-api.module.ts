import { NgModule } from '@angular/core';
import { NhsApiComponent } from '../pages/nhs-api/nhs-api.component';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LineChartComponent } from '../components/nhs-api/line-chart/line-chart.component';
import { RequestParamsComponent } from '../components/nhs-api/request-params/request-params.component';
import { LineChartSettingsComponent } from '../components/nhs-api/line-chart-settings/line-chart-settings.component';

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
