import { Component, OnInit, signal } from '@angular/core';
import { CoinApiStore } from '../../stores/coin-api.store';
import { Observable, of, startWith, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-coin-api',
    templateUrl: './coin-api.component.html',
    styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit {

    public data$: Observable<Asset[]> = new Observable();
    public form!: FormGroup;

    public sourceAsset = new FormControl('');
    public sourceAssetCrypto = new FormControl(true);
    public filteredSourceAssets$!: Observable<Asset[]>;

    readonly panelOpenState = signal(false);

    constructor(
        private readonly store: CoinApiStore,
        private fb: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this.filteredSourceAssets$ = this.getSourceSubscription();
        this.data$ = this.store.getData();
        this.setupForm();
    }

    private setupForm(): void {
        this.form = this.fb.group({
            sourceAsset: this.sourceAsset,
            sourceAssetCrypto: this.sourceAssetCrypto,
        });
    }

    private getSourceSubscription() {
        return this.sourceAsset.valueChanges.pipe(
            debounceTime(300), // Wait 300ms before making a request
            distinctUntilChanged(), // Avoid unnecessary calls
            startWith(''), // Ensure it starts with an empty value
            switchMap(value => this.store.getFilteredData(value?.toUpperCase() || '')) // Fetch filtered data
        )
    }
}
