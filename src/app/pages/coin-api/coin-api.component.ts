import { Component, OnInit } from '@angular/core';
import { CoinApiService } from '../../services/coin-api/coin-api.service';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Component({
    selector: 'app-coin-api',
    templateUrl: './coin-api.component.html',
    styleUrls: ['./coin-api.component.scss'],
    providers: [CoinApiService],
})
export class CoinApiComponent implements OnInit {

    public data$: Observable<Asset[]> = new Observable();

    constructor(
        readonly service: CoinApiService,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.service.loadDataFromApi();
    }
}
