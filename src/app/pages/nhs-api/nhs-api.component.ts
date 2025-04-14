import { Component, OnInit } from '@angular/core';
import { defaultOptions } from 'src/app/services/nhs-api/nhs-api.service';

@Component({
    selector: 'app-nhs-api',
    templateUrl: './nhs-api.component.html',
    styleUrls: ['./nhs-api.component.scss'],
})
export class NhsApiComponent implements OnInit {

    public defaultOptions = defaultOptions;
    public options = this.defaultOptions;
    
    constructor( ) { }

    public ngOnInit(): void {

    }

    public storeUserOptions(options: any) {
        this.options = options;
        console.log(this.options);
    }
}
