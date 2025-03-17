import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CoinApiStore } from '../../stores/coin-api.store';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-coin-api',
    templateUrl: './coin-api.component.html',
    styleUrls: ['./coin-api.component.scss'],
})
export class CoinApiComponent implements OnInit, OnDestroy {

    public data$: Observable<Asset[]> = new Observable();
    public form!: FormGroup;
    public defaults = {
        nameFilter: 'US Dollar,Pound Sterling',
        assetIdFilter: 'USD,GBP',
    };
    public placeHolders = {
        nameFilter: `Comma separate search terms, e.g. ${this.defaults.nameFilter}`,
        assetIdFilter: `Comma separate search terms, e.g. ${this.defaults.assetIdFilter}`,
    };
    public nameFilter = this.fb.control(this.defaults.nameFilter);
    public assetIdFilter = this.fb.control(this.defaults.assetIdFilter);

    private subscriptions: Subscription[] = [];
    
    readonly panelOpenState = signal(false);

    constructor(
        private readonly store: CoinApiStore,
        private fb: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.store.getData({
            name: this.nameFilter.value?.split(',') ?? [],
            assetId: this.assetIdFilter.value?.split(',') ?? [],
            fuzzy: false,
        });
        this.setupForm();
    }

    private setupForm(): void {

        this.form = this.fb.group({
            nameFilter: this.nameFilter,
            assetIdFilter: this.assetIdFilter,
            // includeCrypto: true,
            // includeNonCrypto: true,
        });

        this.debounceTextFilter(this.nameFilter);
        this.debounceTextFilter(this.assetIdFilter);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    private debounceTextFilter(filter: any): void {
        const sub = filter.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value: string) => {
                const filters = {
                    name: this.nameFilter.value?.split(',') ?? [],
                    assetId: this.assetIdFilter.value?.split(',') ?? [],
                    fuzzy: false,
                }
                this.data$ = this.store.getData(filters);
            });
        this.subscriptions.push(sub);
    }
}
