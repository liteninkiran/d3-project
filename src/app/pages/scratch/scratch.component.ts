import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit {

    public chartData = [
        { date: '2025-04-01', value: 30 },
        { date: '2025-04-02', value: 80 },
        { date: '2025-04-03', value: 45 },
        { date: '2025-04-04', value: 60 },
    ];
    public dimensions = {
        width: 1500,
        height: 700,
    }
    public labels = {
        x: 'Date',
        y: 'Value',
    }

    constructor( ) { }

    public ngOnInit(): void {

    }

}
