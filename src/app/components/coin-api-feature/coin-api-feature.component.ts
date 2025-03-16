import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Asset } from 'src/app/interfaces/coin-api/asset';

@Component({
    selector: 'app-coin-api-feature',
    templateUrl: './coin-api-feature.component.html',
    styleUrls: ['./coin-api-feature.component.scss'],
})
export class CoinApiFeatureComponent implements OnInit, OnChanges {

    @Input() public data: Asset[] = [];

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {

    }
}
