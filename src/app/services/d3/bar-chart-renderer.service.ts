import { Injectable } from '@angular/core';
import { ChartContext } from 'src/app/types/d3/services';

@Injectable({ providedIn: 'root' })
export class BarChartRendererService {
    constructor() { }

    public removeBars(context: ChartContext): void {
        this.removeLayer(context, 'bar-layer');
    }

    private removeLayer(context: ChartContext, layer: string): void {
        context.getLayer(layer).selectAll('*').remove();
    }

    public drawBar(context: ChartContext): void {
        console.log('drawBar');
        const { x, y, data, getLayer } = context;
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
