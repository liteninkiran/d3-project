import { NgModule } from '@angular/core';
import { CoinApiComponent } from '../pages/coin-api/coin-api.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AssetListComponent } from '../components/coin-api/asset-list/asset-list.component';

@NgModule({
    declarations: [
        CoinApiComponent,
        AssetListComponent,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        CoinApiComponent,
        AssetListComponent,
    ],
})
export class CoinApiModule { }
