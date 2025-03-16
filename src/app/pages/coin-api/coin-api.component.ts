import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoinApiService } from '../../services/coin-api/coin-api.service';
import { Observable, Subscription } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Component({
    selector: 'app-coin-api',
    templateUrl: './coin-api.component.html',
    styleUrls: ['./coin-api.component.scss'],
    providers: [CoinApiService],
})
export class CoinApiComponent implements OnInit, OnDestroy {

    public data$: Observable<Asset[]> = new Observable();
    public subscriptions: Subscription[] = [];

    constructor(
        readonly service: CoinApiService,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.service.loadDataFromApi();
        const sub: Subscription = this.data$.subscribe(this.showData);
        this.subscriptions.push(sub);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
    }

    private showData(data: Asset[]): void {
        console.log(data);
    }
}
