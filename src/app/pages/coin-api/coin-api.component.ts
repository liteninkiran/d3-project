import { Component, OnInit } from '@angular/core';
import { CoinApiStore } from '../../stores/coin-api.store';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Component({
    selector: 'app-coin-api',
    templateUrl: './coin-api.component.html',
    styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit {

    public data$: Observable<Asset[]> = new Observable();

    constructor(
        readonly store: CoinApiStore,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.store.getData(['dollar', 'pound']);
    }
}
