import { Injectable } from '@angular/core';
import { ChartData } from 'src/app/types/d3/data';
import { TimeChartBaseService } from './time-chart-base.service';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })
export class LineChartRendererService {
    constructor(
        private baseService: TimeChartBaseService
    ) { }

    public removeLineAndMarkers(): void {
        this.removeLine();
        this.removeMarkers();
    }

    public removeLine(): void {
        this.removeLayer('line-layer');
    }

    public removeMarkers(): void {
        this.removeLayer('marker-layer');
    }

    private removeLayer(layer: string): void {
        this.baseService.getLayer(layer).selectAll('*').remove();
    }

    public drawLine(showMarkers: boolean = true): void {
        console.log('drawLine');
        const data = this.baseService.getData();
        const x = this.baseService.getXScale();
        const y = this.baseService.getYScale();
        const lineLayer = this.baseService.getLayer('line-layer');
        const markerLayer = this.baseService.getLayer('marker-layer');
    
        const line = d3.line<ChartData>()
            .x(d => x(d.date))
            .y(d => y(d.value));
    
        lineLayer.selectAll<SVGPathElement, ChartData[]>('path')
            .data([data])
            .join(
                enter => enter.append('path')
                    .attr('fill', 'none')
                    .attr('stroke', 'steelblue')
                    .attr('stroke-width', 2)
                    .attr('d', line),
                update => update.attr('d', line),
                exit => exit.remove()
            );
    
        if (showMarkers) {
            markerLayer.selectAll<SVGCircleElement, ChartData>('circle')
                .data(data, d => (d as ChartData).date.toString())
                .join(
                    enter => enter.append('circle')
                        .attr('r', 4)
                        .attr('fill', 'steelblue')
                        .attr('class', 'marker')
                        .attr('cx', d => x(d.date))
                        .attr('cy', d => y(d.value)),
                    update => update
                        .attr('cx', d => x(d.date))
                        .attr('cy', d => y(d.value)),
                    exit => exit.remove()
                );
        } else {
            markerLayer.selectAll('circle').remove();
        }
    }
}
