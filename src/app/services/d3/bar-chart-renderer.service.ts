import { Injectable } from '@angular/core';
import { TimeChartBaseService } from './time-chart-base.service';
import { ChartContext } from 'src/app/types/d3/services';

@Injectable({ providedIn: 'root' })
export class BarChartRendererService {
    constructor(
        private baseService: TimeChartBaseService
    ) { }

    public removeBars(): void {
        this.removeLayer('bar-layer');
    }

    private removeLayer(layer: string): void {
        this.baseService.getLayer(layer).selectAll('*').remove();
    }

    public drawBar(context: ChartContext): void {
        console.log('drawBar');
        const { x, y, getLayer, getData } = context;
        const data = getData();
        const barLayer = getLayer('bar-layer');
        const barWidth = 10;

        barLayer.selectAll('*').remove();

        barLayer.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => x(d.date) - barWidth / 2)
            .attr('y', d => y(d.value))
            .attr('width', barWidth)
            .attr('height', d => y(0) - y(d.value))
            .attr('fill', 'tomato');
    }
}
