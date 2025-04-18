import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSeriesComponent } from '../components/d3/time-series/time-series.component';

@NgModule({
    declarations: [
        TimeSeriesComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        TimeSeriesComponent,
    ],
    providers: [
    ],
})
export class D3ChartsModule { }
