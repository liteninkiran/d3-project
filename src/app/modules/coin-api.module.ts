import { NgModule } from '@angular/core';
import { CoinApiComponent } from '../pages/coin-api/coin-api.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@NgModule({
    declarations: [
        CoinApiComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        CoinApiComponent,
    ],
})
export class CoinApiModule { }
