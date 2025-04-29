import { Injectable } from '@angular/core';
import { ChartData } from 'src/app/types/d3/data';
import { LineEnter, LineUpdate, LineExit, MarkerEnter, MarkerUpdate, MarkerExit, ChartContext } from 'src/app/types/d3/services';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })
export class LineChartRendererService {

    constructor() { }

    public removeLineAndMarkers(context: ChartContext): void {
        this.removeLine(context);
        this.removeMarkers(context);
    }

    public removeLine(context: ChartContext): void {
        this.removeLayer(context, 'line-layer');
    }

    public removeMarkers(context: ChartContext): void {
        this.removeLayer(context, 'marker-layer');
    }

    private removeLayer(context: ChartContext, layer: string): void {
        context.getLayer(layer).selectAll('*').remove();
    }

    public draw(context: ChartContext, showMarkers: boolean = true): void {
        this.drawLine(context);
        this.drawMarkers(context, showMarkers);
    }

    private drawLine(context: ChartContext): void {
        console.log('drawLine');
        const { x, y, getLayer, getData } = context;
        const data = getData();
        const lineLayer = getLayer('line-layer');

        const line = d3.line<ChartData>()
            .x(d => x(d.date))
            .y(d => y(d.value));

        const enterFn = (enter: LineEnter) => enter.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        const updateFn = (update: LineUpdate) => update
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('d', line);

        const exitFn = (exit: LineExit) => exit.remove();

        lineLayer.selectAll<SVGPathElement, ChartData[]>('path')
            .data([data])
            .join(enterFn, updateFn, exitFn);
    }

    private drawMarkers(context: ChartContext, showMarkers: boolean = true): void {
        console.log('drawMarkers');
        const { x, y, getLayer, getData } = context;
        const data = getData();
        const markerLayer = getLayer('marker-layer');

        if (showMarkers) {
            const enterFn = (enter: MarkerEnter) => enter.append('circle')
                .attr('r', 4)
                .attr('fill', 'steelblue')
                .attr('class', 'marker')
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
                .join(enterFn, updateFn, exitFn);
        } else {
            markerLayer.selectAll('circle').remove();
        }
    }
}
