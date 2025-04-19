import { Injectable } from '@angular/core';
import { ChartData } from 'src/app/types/d3/data';
import { TimeChartBaseService } from './time-chart-base.service';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })
export class LineChartRendererService {
    constructor(
        private baseService: TimeChartBaseService
    ) { }

    public draw(showMarkers: boolean = true): void {
        const data = this.baseService.getData();
        const x = this.baseService.getXScale();
        const y = this.baseService.getYScale();
        const lineLayer = this.baseService.getLayer('line-layer');
        const markerLayer = this.baseService.getLayer('marker-layer');

        const line = d3.line<ChartData>()
            .x(d => x(d.date))
            .y(d => y(d.value));

        lineLayer.selectAll('*').remove();
        lineLayer.append('path')
            .datum(data)
            .attr('d', line)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2);

        markerLayer.selectAll('*').remove();
        if (showMarkers) {
            markerLayer.selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', d => x(d.date))
                .attr('cy', d => y(d.value))
                .attr('r', 4)
                .attr('fill', 'steelblue')
                .attr('class', 'marker')
                .style('cursor', 'pointer');

            markerLayer
                .selectAll('circle')
                .on('mouseover', function (_event: MouseEvent, _d: ChartData) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', 8);
                });
        
            markerLayer
                .selectAll('circle')
                .on('mouseout', function (_event: MouseEvent) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r', 4);
                });
        }
    }
}
