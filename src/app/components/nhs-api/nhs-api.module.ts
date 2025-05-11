import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material.module';
import { RequestParamsComponent } from './request-params/request-params.component';

@NgModule({
    declarations: [
        RequestParamsComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        RequestParamsComponent,
    ],
    providers: [
        DatePipe,
        DecimalPipe,
    ],
})
export class NhsApiModule { }
