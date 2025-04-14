import { Component, OnInit } from '@angular/core';
import { defaultOptions, FilterOptions } from 'src/app/services/nhs-api/nhs-api.service';

@Component({
    selector: 'app-nhs-api',
    templateUrl: './nhs-api.component.html',
    styleUrls: ['./nhs-api.component.scss'],
})
export class NhsApiComponent implements OnInit {

    public options = defaultOptions;
    
    constructor( ) { }

    public ngOnInit(): void {

    }

    public storeUserOptions(options: FilterOptions) {
        this.options = options;
    }
}
