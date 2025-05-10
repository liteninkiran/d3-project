import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { RequestParamsComponent } from 'src/app/components/nhs-api/request-params/request-params.component';
import { NhsApiService } from 'src/app/services/nhs-api/nhs-api.service';
import { SpineService } from 'src/app/services/nhs-api/spine.service';
import { LineDataItem } from 'src/app/types/d3/data';
import { DatastoreSearchSql, defaultOptions, FilterOptions, Record } from 'src/app/types/nhs-api/epd';

type MonthData = {
    YEAR_MONTH: number;
    TOTAL_QUANTITY: number;
}

@Component({
    selector: 'app-epd',
    templateUrl: './epd.component.html',
    styleUrls: ['./epd.component.scss'],
})
export class EpdComponent {

    public requestOptions = defaultOptions;
    public data$: Observable<DatastoreSearchSql[]> = new Observable();
    private data: DatastoreSearchSql[] = [];
    private lineData: LineDataItem[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        private readonly spineService: SpineService,
        private readonly nhsService: NhsApiService,
        private dialog: MatDialog,
    ) { }

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

    private subscribeToData() {
        const sub = this.data$.subscribe(data => {
            this.data = data;
            this.transformData();
            console.log(this.data, this.lineData);
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
        const mapData = (month: MonthData) => ({
            x: getDate(month.YEAR_MONTH),
            y: month.TOTAL_QUANTITY,
        });

        const records = this.data.flatMap(month => month.result.result.records);
        const reduced = records.reduce(reducer, {});
        const months: MonthData[] = Object.values(reduced);
        const data = months.map(mapData);
        const name = 'Data';
        this.lineData = [{ name, data }];
    }
}
