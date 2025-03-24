import { NgModule } from '@angular/core';
import { NhsApiComponent } from '../pages/nhs-api/nhs-api.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        NhsApiComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        NhsApiComponent,
    ],
    providers: [
    ],
})
export class NhsApiModule { }
