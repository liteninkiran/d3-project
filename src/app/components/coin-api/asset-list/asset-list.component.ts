import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CoinApiStore, Filter } from '../../../stores/coin-api.store';
import { Observable, Subscription, debounceTime } from 'rxjs';
import { Asset } from 'src/app/interfaces/coin-api/asset';
import { FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-coin-api-asset-list',
    templateUrl: './asset-list.component.html',
    styleUrls: ['./asset-list.component.scss'],
})
export class AssetListComponent implements OnInit, OnDestroy {

    public data$: Observable<Asset[]> = new Observable();
    public form!: FormGroup;
    public defaults: Filter = {
        nameOrId: 'Pound',
        includeCrypto: false,
    };
    public placeHolder = 'Type to search';
    public nameOrId = this.fb.control(this.defaults.nameOrId);
    public includeCrypto = this.fb.control(this.defaults.includeCrypto);
    public options: {[k: string]: string | boolean} = {} = this.defaults;
    public imgUrl = 'https://s3.eu-central-1.amazonaws.com/bbxt-static-icons/type-id/png_512/';

    private subscriptions: Subscription[] = [];
    
    readonly panelOpenState = signal(false);

    constructor(
        private readonly store: CoinApiStore,
        private fb: NonNullableFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.store.getAssetData(this.options as Filter);
        this.setupForm();
    }

    private setupForm(): void {
        this.form = this.fb.group({
            nameOrId: this.nameOrId,
            includeCrypto: this.includeCrypto,
        });
        this.addSubscription(this.nameOrId, 500);
        this.addSubscription(this.includeCrypto);
    }

    private addSubscription(control: FormControl, debounce: number = 0) {
        const name = this.getName(control);
        const sub = control.valueChanges
            .pipe(debounceTime(debounce))
            .subscribe((value: string | boolean) => {
                this.options[name as keyof Filter] = value
                this.data$ = this.store.getAssetData(this.options as Filter);
            });
        this.subscriptions.push(sub);
    }

    private getName(control: FormControl): string {
        return Object.entries(control.parent?.controls ?? []).find(([_, value]) => value === control)?.[0] ?? '';
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }
}
