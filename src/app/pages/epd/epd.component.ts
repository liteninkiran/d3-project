import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ChartSettingsComponent } from 'src/app/components/d3/chart-settings/chart-settings.component';
import { RequestParamsComponent } from 'src/app/components/nhs-api/request-params/request-params.component';
import { NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';
import { SpineService } from 'src/app/services/nhs-api/spine.service';
import { defaultChartOptions } from 'src/app/types/d3/chart-control-defaults';
import { ChartOptions } from 'src/app/types/d3/chart-controls';
import { ChartData } from 'src/app/types/d3/data';
import { DatastoreSearchSql, defaultOptions, FilterOptions, MonthData, Record } from 'src/app/types/nhs-api/epd';

@Component({
    selector: 'app-epd',
    templateUrl: './epd.component.html',
    styleUrls: ['./epd.component.scss'],
})
export class EpdComponent implements OnInit, OnDestroy {

    public requestOptions = defaultOptions;
    public chartOptions = defaultChartOptions;
    public data$: Observable<DatastoreSearchSql[]> = new Observable();
    public lineData: ChartData[] = [];
    private data: DatastoreSearchSql[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        private readonly spineService: SpineService,
        private readonly nhsService: NhsApiService,
        private dialog: MatDialog,
    ) { }

    public ngOnInit(): void {

    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    public getGpData() {
        const confirmation = confirm('Would you like to fetch GP data? This will take about 2 mins.');
        if (confirmation) {
            this.spineService.fetchAllOrganisations('RO177').subscribe({
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
                this.getEpdData();
            }
        });
    }

    public getEpdData() {
        this.data$ = this.nhsService.getMonthlyData(this.requestOptions);
        this.subscribeToData();
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

    private subscribeToData() {
        const sub = this.data$.subscribe(data => {
            this.data = data;
            this.transformData();
        });
        this.subscriptions.push(sub);
    }

    private transformData() {
        const initObj = (item: Record) => ({
            YEAR_MONTH: item.YEAR_MONTH,
            TOTAL_QUANTITY: 0,
        })
        const reducer = (acc: any, item: Record) => {
            if (!acc[item.YEAR_MONTH]) {
                acc[item.YEAR_MONTH] = initObj(item);
            }
            acc[item.YEAR_MONTH].TOTAL_QUANTITY += item.TOTAL_QUANTITY;
            return acc;
        }
        const getDatePart = (num: number, start: number, end: number) => parseInt(num.toString().slice(start, end), 10);
        const getMonth = (num: number) => getDatePart(num, 4, 6) - 1;
        const getYear = (num: number) => getDatePart(num, 0, 4);
        const getDate = (num: number) => new Date(getYear(num), getMonth(num));
        const mapData = (month: MonthData): ChartData => ({
            date: getDate(month.YEAR_MONTH),
            value: month.TOTAL_QUANTITY,
        });

        const records = this.data.flatMap(month => month.result.result.records);
        const reduced = records.reduce(reducer, {});
        const months: MonthData[] = Object.values(reduced);
        this.lineData = months.map(mapData);
    }
}
