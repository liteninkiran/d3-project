import { Injectable } from '@angular/core';
import { TimeChartBaseService } from './time-chart-base.service';

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

    public drawBar(): void {
        console.log('drawBar');
        const data = this.baseService.getData();
        const x = this.baseService.getXScale();
        const y = this.baseService.getYScale();
        const barLayer = this.baseService.getLayer('bar-layer');
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
