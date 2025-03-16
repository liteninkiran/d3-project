import { NgModule } from '@angular/core';
import { CoinApiComponent } from '../pages/coin-api/coin-api.component';
import { CoinApiFeatureComponent } from '../components/coin-api-feature/coin-api-feature.component';

@NgModule({
    declarations: [
        CoinApiComponent,
        CoinApiFeatureComponent,
    ],
    exports: [
        CoinApiComponent,
        CoinApiFeatureComponent,
    ],
})
export class CoinApiModule { }
