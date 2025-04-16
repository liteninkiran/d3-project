import { Component, OnInit } from '@angular/core';
import { defaultOptions, FilterOptions } from 'src/app/services/nhs-api/nhs-api.service';
import { SpineService } from 'src/app/services/nhs-api/spine.service';

@Component({
    selector: 'app-nhs-api',
    templateUrl: './nhs-api.component.html',
    styleUrls: ['./nhs-api.component.scss'],
})
export class NhsApiComponent implements OnInit {

    public options = defaultOptions;

    constructor(
        private readonly service: SpineService,
    ) { }

    public ngOnInit(): void {

    }

    public storeUserOptions(options: FilterOptions) {
        this.options = options;
    }

    public getGpData() {
        const confirmation = confirm('Would you like to fetch GP data? This will take about 2 mins.');
        if (confirmation) {
            this.service.fetchAllOrganisations('RO177').subscribe({
                next: (data) => console.log('Total organisations:', data),
                error: (err) => console.error('Error fetching organisations:', err)
            });
        }
    }
}
