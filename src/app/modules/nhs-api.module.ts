import { NgModule } from '@angular/core';
import { NhsApiComponent } from '../pages/nhs-api/nhs-api.component';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScratchComponent } from '../components/nhs-api/scratch/scratch.component';
import { LineChartComponent } from '../components/nhs-api/line-chart/line-chart.component';

@NgModule({
    declarations: [
        NhsApiComponent,
        ScratchComponent,
        LineChartComponent,
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
    ],
    providers: [
        DatePipe,
        DecimalPipe,
    ],
})
export class NhsApiModule { }
