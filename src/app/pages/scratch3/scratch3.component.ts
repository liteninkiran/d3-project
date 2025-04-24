import { Component } from '@angular/core';
import { ChartOptions2, defaultOptions } from 'src/app/components/d3/chart-settings-2/chart-settings-2.component';
import { dataset1 } from 'src/app/mocks/d3/data';
import { ChartData, ChartData2 } from 'src/app/types/d3/data';

const mapFn = (data: ChartData): ChartData2 => ({ date: new Date(data.date), value: data.value });
const filterFn = (data: ChartData2): boolean => data.date >= new Date('2023-01-01');

@Component({
    selector: 'app-scratch3',
    templateUrl: './scratch3.component.html',
    styleUrls: ['./scratch3.component.scss'],
})
export class Scratch3Component {

    public chartOptions: ChartOptions2 = defaultOptions;;
    public chartData = dataset1.map(mapFn).filter(filterFn);

    constructor() { }

    public ngOnInit(): void {
        
    }

    public chartOptionsUpdated(event: ChartOptions2): void {
        this.chartOptions = event;
    }
}
