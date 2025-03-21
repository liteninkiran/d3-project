import { NgModule } from '@angular/core';
import { CoinApiComponent } from '../pages/coin-api/coin-api.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AssetListComponent } from '../components/coin-api/asset-list/asset-list.component';
import { RequestParamsComponent } from '../components/coin-api/request-params/request-params.component';
import { ChartComponent } from '../components/coin-api/chart/chart.component';
import { Chart2Component } from '../components/coin-api/chart2/chart.component';

@NgModule({
    declarations: [
        CoinApiComponent,
        AssetListComponent,
        RequestParamsComponent,
        ChartComponent,
        Chart2Component,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        CoinApiComponent,
        AssetListComponent,
        RequestParamsComponent,
        ChartComponent,
        Chart2Component,
    ],
})
export class CoinApiModule { }
