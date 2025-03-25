import { NgModule } from '@angular/core';
import { NhsApiComponent } from '../pages/nhs-api/nhs-api.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ScratchComponent } from '../components/nhs-api/scratch/scratch.component';

@NgModule({
    declarations: [
        NhsApiComponent,
        ScratchComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        NhsApiComponent,
        ScratchComponent,
    ],
    providers: [
    ],
})
export class NhsApiModule { }
