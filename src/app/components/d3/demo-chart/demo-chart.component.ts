import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as d3 from 'd3';

type Data = {
    date: any;
    value: number;
}

@Component({
    selector: 'app-demo-chart',
    templateUrl: './demo-chart.component.html',
    styleUrls: ['./demo-chart.component.scss'],
})
export class DemoChartComponent implements OnInit, OnChanges {
    @Input() public width = 800;
    @Input() public height = 400;
    @Input() public margin = { top: 50, right: 50, bottom: 50, left: 50 };

    private innerWidth = 0;
    private innerHeight = 0;

    private data: Data[] = [
        { date: "2023-01-01", value: 54 },
        { date: "2023-02-01", value: 62 },
        { date: "2023-03-01", value: 12 },
        { date: "2023-04-01", value: 85 },
        { date: "2023-05-01", value: 42 },
        { date: "2023-06-01", value: 64 },
    ];

    private parseDate = d3.timeParse("%Y-%m-%d");

    public ngOnInit(): void {

    }

    public ngOnChanges(): void {
        this.createChart();
    }

    private createChart() {
        this.data.forEach(d => {
            if (typeof d.date === 'string') {
                d.date = this.parseDate(d.date);
            }
        });

        this.innerWidth = this.width - this.margin.left - this.margin.right;
        this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    
        // Create SVG container
        const svg = d3.select("#chart")
            .attr("width", this.innerWidth + this.margin.left + this.margin.right)
            .attr("height", this.innerHeight + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        
        // Scales
        const x = d3.scaleTime()
            .domain(d3.extent(this.data, d => d.date))
            .range([0, this.innerWidth]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.value)]).nice()
            .range([this.innerHeight, 0]);
        
        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${this.innerHeight})`)
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));
        
        svg.append("g")
            .call(d3.axisLeft(y));
        
        // Line generator
        const line = d3.line<Data>()
            .x(d => x(d.date))
            .y(d => y(d.value));
        
        // Append the path
        svg.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", "2px")
            .attr("d", line);
    }
}
