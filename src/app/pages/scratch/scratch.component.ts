import { Component, OnInit } from '@angular/core';
import { dataset1 } from 'src/app/mocks/d3/data';

@Component({
    selector: 'app-scratch',
    templateUrl: './scratch.component.html',
    styleUrls: ['./scratch.component.scss'],
})
export class ScratchComponent implements OnInit {

    public chartData = dataset1;
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
