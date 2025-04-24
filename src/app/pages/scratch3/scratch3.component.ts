import { Component } from '@angular/core';
import { ChartOptions2, defaultOptions } from 'src/app/components/d3/chart-settings-2/chart-settings-2.component';

@Component({
    selector: 'app-scratch3',
    templateUrl: './scratch3.component.html',
    styleUrls: ['./scratch3.component.scss'],
})
export class Scratch3Component {

    public chartOptions: ChartOptions2 = defaultOptions;;

    constructor() { }

    public ngOnInit(): void {

    }

    public chartOptionsUpdated(event: ChartOptions2): void {
        this.chartOptions = event;
    }
}
