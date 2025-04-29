import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ChartSettingsComponent } from 'src/app/components/d3/chart-settings/chart-settings.component';
import { dataset1 } from 'src/app/mocks/d3/data';
import { defaultChartOptions, defaultChartDimensions, ChartSettings } from 'src/app/types/d3/chart-controls';
import { ChartData, ChartData2 } from 'src/app/types/d3/data';

const mapFn = (data: ChartData): ChartData2 => ({ date: new Date(data.date), value: data.value });
const filterFn = (data: ChartData2, date: string): boolean => data.date >= new Date(date);
const filteredData = (date: string) => dataset1.map(mapFn).filter((data) => filterFn(data, date));
const filter2025 = filteredData('2025-01-01');
const filter2024 = filteredData('2024-01-01');

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit, OnDestroy {

    public chartData = filter2025;
    public chartOptions = defaultChartOptions;
    public chartDimensions = defaultChartDimensions;
    private subscriptions: Subscription[] = [];

    constructor(
        private dialog: MatDialog
    ) { }

    public ngOnInit(): void {
        // setTimeout(() => this.chartData = filter2024, 2000);
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
