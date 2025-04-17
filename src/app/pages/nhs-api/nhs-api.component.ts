import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LineChartSettingsComponent } from 'src/app/components/nhs-api/line-chart-settings/line-chart-settings.component';
import { RequestParamsComponent } from 'src/app/components/nhs-api/request-params/request-params.component';
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
        private dialog: MatDialog
    ) { }

    public ngOnInit(): void {

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

    public openRequestParamsModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = this.options;
        const dialogRef = this.dialog.open(RequestParamsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((options?: FilterOptions) => {
            if (options) {
                this.options = options;
            }
        });
    }

    public openChartSettingsModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = { settingOne: 'Howdy' };
        const dialogRef = this.dialog.open(LineChartSettingsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((data?: any) => {
            if (data) {
                console.log(data);
            }
        });
    }
}
