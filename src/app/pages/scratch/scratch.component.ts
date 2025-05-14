import { Component, OnInit } from '@angular/core';
import { dataset1 } from 'src/app/mocks/d3/data';
import { ChartMockData, ChartData } from 'src/app/types/d3/data';

type DateRange = {
    start: string;
    end: string;
}

const getDates = (year: number) => ({ start: `${year}-01-01`, end: `${year}-12-31` })
const mapFn = (data: ChartMockData): ChartData => ({ date: new Date(data.date), value: data.value });
const filterBetween = (data: ChartData, dates: DateRange): boolean => data.date >= new Date(dates.start) && data.date <= new Date(dates.end);
const filterTo = (data: ChartData, dates: DateRange): boolean => data.date <= new Date(dates.end);
const filterFrom = (data: ChartData, dates: DateRange): boolean => data.date >= new Date(dates.start);
const filteredDataBetween = (dates: DateRange) => dataset1.map(mapFn).filter((data) => filterBetween(data, dates));
const filteredDataFrom = (dates: DateRange) => dataset1.map(mapFn).filter((data) => filterFrom(data, dates));
const filteredDataTo = (dates: DateRange) => dataset1.map(mapFn).filter((data) => filterTo(data, dates));

const filter2016 = filteredDataTo(getDates(2016));
const filter2018 = filteredDataTo(getDates(2018));
const filter2024 = filteredDataBetween(getDates(2024));
const filter2023 = filteredDataTo(getDates(2023));

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit {

    public chartData = filter2024;

    constructor() { }

    public ngOnInit(): void {
        // setTimeout(() => this.chartData = filter2018, 2000);
    }
}
