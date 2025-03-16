import { NgModule } from '@angular/core';
import { CoinApiComponent } from '../pages/coin-api/coin-api.component';
import { CoinApiFeatureComponent } from '../components/coin-api-feature/coin-api-feature.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';

@NgModule({
    declarations: [
        CoinApiComponent,
        CoinApiFeatureComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
    ],
    exports: [
        CoinApiComponent,
        CoinApiFeatureComponent,
    ],
})
export class CoinApiModule { }
