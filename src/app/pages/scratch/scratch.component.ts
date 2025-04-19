import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChartSettingsComponent } from 'src/app/components/d3/chart-settings/chart-settings.component';
import { dataset1 } from 'src/app/mocks/d3/data';
import { ChartControl, defaultChartOptions } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit {

    public chartData = dataset1.filter(data => Date.parse(data.date) >= Date.parse('2023-01-01'));
    public dimensions = {
        width: 1500,
        height: 700,
    }

    public chartOptions = defaultChartOptions;

    constructor(
        private dialog: MatDialog
    ) { }

    public ngOnInit(): void {

    }

    public openChartSettingsModal() {
        const dialogConfig = new MatDialogConfig<ChartControl>();
        dialogConfig.data = this.chartOptions;
        const dialogRef = this.dialog.open(ChartSettingsComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((options?: ChartControl) => {
            if (options) {
                this.chartOptions = options;
                console.log(options);
            }
        });
    }

}
