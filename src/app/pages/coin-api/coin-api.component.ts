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
        nameOrId: 'Dollar,Pound',
    };
    public placeHolder = `Comma separate search terms, e.g. ${this.defaults.nameOrId}`;
    public nameOrId = this.fb.control(this.defaults.nameOrId);

    private subscriptions: Subscription[] = [];
    
    readonly panelOpenState = signal(false);

    constructor(
        private readonly store: CoinApiStore,
        private fb: FormBuilder,
    ) { }

    public ngOnInit(): void {
        this.data$ = this.store.getData(this.defaults.nameOrId.split(','));
        this.setupForm();
    }

    private setupForm(): void {

        this.form = this.fb.group({
            nameOrId: this.nameOrId,
            // includeCrypto: true,
            // includeNonCrypto: true,
        });

        const sub = this.nameOrId.valueChanges
            .pipe(debounceTime(500))
            .subscribe(value => {
                this.data$ = this.store.getData(value?.split(','));
            });
        this.subscriptions.push(sub);
        
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }
}
