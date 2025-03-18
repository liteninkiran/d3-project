import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRate } from 'src/app/interfaces/coin-api/exchange-rate';
import { ExchangeRateOptions } from 'src/app/services/coin-api/coin-api.service';

@Component({
    selector: 'app-coin-api-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {

    @Input() public options: ExchangeRateOptions = {} as ExchangeRateOptions;

    public data$: Observable<ExchangeRate[]> = new Observable();

    public ngOnInit(): void {
        // Get data
    }

    public ngOnChanges(changes: SimpleChanges): void {
        // Get data
    }
}
