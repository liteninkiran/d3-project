import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ChartSettingsComponent } from 'src/app/components/d3/chart-settings/chart-settings.component';
import { dataset1 } from 'src/app/mocks/d3/data';
import { defaultChartOptions } from 'src/app/types/d3/chart-control-defaults';
import { ChartOptions } from 'src/app/types/d3/chart-controls';
import { ChartData, ChartData2 } from 'src/app/types/d3/data';

type DateRange = {
    start: string;
    end: string;
}

const getDates = (year: number) => ({ start: `${year}-01-01`, end: `${year}-12-31` })
const mapFn = (data: ChartData): ChartData2 => ({ date: new Date(data.date), value: data.value });
const filterFn = (data: ChartData2, dates: DateRange): boolean => data.date >= new Date(dates.start) && data.date <= new Date(dates.end);
const filteredData = (dates: DateRange) => dataset1.map(mapFn).filter((data) => filterFn(data, dates));
const filter2024 = filteredData(getDates(2024));
const filter2023 = filteredData(getDates(2023));

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit, OnDestroy {

    public chartData = filter2024;
    public chartOptions = defaultChartOptions;
    private subscriptions: Subscription[] = [];

    constructor(
        private dialog: MatDialog
    ) { }

    public ngOnInit(): void {
        setTimeout(() => this.chartData = filter2023, 2000);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public openChartSettingsModal() {
        const dialogConfig = new MatDialogConfig<ChartOptions>();
        dialogConfig.data = this.chartOptions;
        const dialogRef = this.dialog.open(ChartSettingsComponent, dialogConfig);
        const dialogOpen = dialogRef.afterOpened();

        const formChangedFn = (data?: ChartOptions) => {
            if (data) {
                this.chartOptions = data;
            }
        }
        const dialogOpenFn = () => this.subscribeTo(dialogRef.componentInstance.form.valueChanges, formChangedFn);

        this.subscribeTo(dialogOpen, dialogOpenFn);
    }

    private subscribeTo(obs: Observable<any>, fn: () => void): void {
        const sub = obs.subscribe(fn);
        this.subscriptions.push(sub);
    }
}
