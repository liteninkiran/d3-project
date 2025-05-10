import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RequestParamsComponent } from 'src/app/components/nhs-api/request-params/request-params.component';
import { SpineService } from 'src/app/services/nhs-api/spine.service';
import { defaultOptions, FilterOptions } from 'src/app/types/nhs-api/epd';

@Component({
    selector: 'app-epd',
    templateUrl: './epd.component.html',
    styleUrls: ['./epd.component.scss'],
})
export class EpdComponent {

    public requestOptions = defaultOptions;

    constructor(
        private readonly service: SpineService,
        private dialog: MatDialog
    ) { }

    public getGpData() {
        const confirmation = confirm('Would you like to fetch GP data? This will take about 2 mins.');
        if (confirmation) {
            this.service.fetchAllOrganisations('RO177').subscribe({
                next: (data) => console.log('Total organisations:', data),
                error: (err) => console.error('Error fetching organisations:', err)
            });
        }
    }

    public openRequestParamsModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = this.requestOptions;
        const dialogRef = this.dialog.open(RequestParamsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((options?: FilterOptions) => {
            if (options) {
                this.requestOptions = options;
            }
        });
    }
}
