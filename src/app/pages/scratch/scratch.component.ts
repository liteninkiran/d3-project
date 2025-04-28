import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChartSettingsComponent } from 'src/app/components/d3/chart-settings/chart-settings.component';
import { dataset1 } from 'src/app/mocks/d3/data';
import { defaultChartOptions, defaultChartDimensions, ChartSettings } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit, OnDestroy {

    public chartData = dataset1.filter(data => Date.parse(data.date) >= Date.parse('2025-01-01'));
    private subscriptions: Subscription[] = [];
    public chartOptions = defaultChartOptions;
    public chartDimensions = defaultChartDimensions;

    constructor(
        private dialog: MatDialog
    ) { }

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public openChartSettingsModal() {
        const dialogConfig = new MatDialogConfig<ChartSettings>();
        dialogConfig.data = {
            options: this.chartOptions,
            dimensions: this.chartDimensions,
        };
        const dialogRef = this.dialog.open(ChartSettingsComponent, dialogConfig);

        dialogRef.afterOpened().subscribe(() => {
            const form = dialogRef.componentInstance.form;
            const subFunction = (data?: ChartSettings) => {
                if (data) {
                    this.chartOptions = data.options;
                    this.chartDimensions = data.dimensions;
                }
            }
            const sub = form.valueChanges
                //.pipe(debounceTime(300))
                .subscribe(subFunction);
            this.subscriptions.push(sub);
        });
    }
}
