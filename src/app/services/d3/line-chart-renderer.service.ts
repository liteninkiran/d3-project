import { Injectable } from '@angular/core';
import { ChartData } from 'src/app/types/d3/data';
import { MarkerEnter, MarkerUpdate, MarkerExit, ChartContext } from 'src/app/types/d3/services';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })
export class LineChartRendererService {

    private context: ChartContext;

    constructor() { }

    public setContext(context: ChartContext): void {
        this.context = context;
    }

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
        this.context.getLayer(layer).selectAll('*').remove();
    }

    public draw(): void {
        this.drawLine();
        this.drawMarkers();
    }

    private drawLine(): void {
        const { x, y, data, getLayer, chartControl } = this.context;
        const lineLayer = getLayer('line-layer');

        const line = d3.line<ChartData>()
            .x(d => x(d.date))
            .y(d => y(d.value));

        lineLayer.selectAll<SVGPathElement, ChartData[]>('path')
            .data([data])
            .join(
                enter => enter.append('path'),
                update => update,
                exit => exit.remove(),
            )
            .attr('fill', 'none')
            .attr('stroke', chartControl.line.colour)
            .attr('stroke-width', chartControl.line.stroke)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('d', line);
    }

    private drawMarkers(): void {
        const { x, y, data, getLayer, chartControl } = this.context;
        const markerLayer = getLayer('marker-layer');

        if (chartControl.markers.enabled) {
            const enterFn = (enter: MarkerEnter) => enter.append('circle')
                .attr('cx', d => x(d.date))
                .attr('cy', d => y(d.value));

            const updateFn = (update: MarkerUpdate) => update
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr('cx', d => x(d.date))
                .attr('cy', d => y(d.value));

            const exitFn = (exit: MarkerExit) => exit.remove();

            markerLayer.selectAll<SVGCircleElement, ChartData>('circle')
                .data(data)
                .join(enterFn, updateFn, exitFn)
                .attr('fill-opacity', chartControl.markers.opacity)
                .attr('stroke-opacity', chartControl.markers.strokeOpacity)
                .attr('fill', chartControl.markers.colour)
                .attr('class', 'marker')
                .attr('stroke', chartControl.markers.strokeColour)
                .attr('stroke-width', chartControl.markers.stroke)
                .attr('r', chartControl.markers.size);
        } else {
            markerLayer.selectAll('circle').remove();
        }
    }
}
