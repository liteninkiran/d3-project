import { NgModule } from '@angular/core';
import { NhsApiComponent } from '../pages/nhs-api/nhs-api.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScratchComponent } from '../components/nhs-api/scratch/scratch.component';
import { LineChartComponent } from '../components/nhs-api/line-chart/line-chart.component';
import { RequestParamsComponent } from '../components/nhs-api/request-params/request-params.component';

@NgModule({
    declarations: [
        NhsApiComponent,
        ScratchComponent,
        LineChartComponent,
        RequestParamsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        NhsApiComponent,
        ScratchComponent,
        LineChartComponent,
        RequestParamsComponent,
    ],
    providers: [
    ],
})
export class NhsApiModule { }
