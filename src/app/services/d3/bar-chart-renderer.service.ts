import { Injectable } from '@angular/core';
import { ChartContext } from 'src/app/types/d3/services';
import * as d3 from 'd3';

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
        const barWidth = context.chartOptions.bar.width;

        barLayer.selectAll('rect')
            .data(data)
            .join(
                enter => enter.append('rect')
                .attr('x', d => x(d.date) - barWidth / 2)
                .attr('y', d => y(d.value))
                .attr('width', barWidth)
                .attr('height', d => y(0) - y(d.value)),
                update => update
                    .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .attr('x', d => x(d.date) - barWidth / 2)
                    .attr('y', d => y(d.value))
                    .attr('width', barWidth)
                    .attr('height', d => y(0) - y(d.value)),
                exit => exit.remove(),
            )
            .attr('fill', context.chartOptions.bar.colour);
    }
}
