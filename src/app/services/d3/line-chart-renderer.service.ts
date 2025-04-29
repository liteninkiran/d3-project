import { Injectable } from '@angular/core';
import { ChartData, XScale, YScale } from 'src/app/types/d3/data';
import { TimeChartBaseService } from './time-chart-base.service';
import * as d3 from 'd3';

type LineEnter = d3.Selection<d3.EnterElement, ChartData[], SVGGElement, unknown>;
type LineUpdate = d3.Selection<SVGPathElement, ChartData[], SVGGElement, unknown>;
type LineExit = d3.Selection<SVGPathElement, ChartData[], SVGGElement, unknown>;

type MarkerEnter = d3.Selection<d3.EnterElement, ChartData, SVGGElement, unknown>;
type MarkerUpdate = d3.Selection<SVGCircleElement, ChartData, SVGGElement, unknown>;
type MarkerExit = d3.Selection<SVGCircleElement, ChartData, SVGGElement, unknown>;

@Injectable({ providedIn: 'root' })
export class LineChartRendererService {

    private x: XScale;
    private y: YScale;

    constructor(
        private baseService: TimeChartBaseService
    ) { }

    public setScales() {
        this.x = this.baseService.getXScale();
        this.y = this.baseService.getYScale();
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
        this.baseService.getLayer(layer).selectAll('*').remove();
    }

    public draw(showMarkers: boolean = true): void {
        this.drawLine();
        this.drawMarkers(showMarkers);
    }

    private drawLine(): void {
        console.log('drawLine');
        const data = this.baseService.getData();
        const lineLayer = this.baseService.getLayer('line-layer');

        const line = d3.line<ChartData>()
            .x(d => this.x(d.date))
            .y(d => this.y(d.value));

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

    private drawMarkers(showMarkers: boolean = true): void {
        console.log('drawMarkers');
        const data = this.baseService.getData();
        const markerLayer = this.baseService.getLayer('marker-layer');

        if (showMarkers) {
            const enterFn = (enter: MarkerEnter) => enter.append('circle')
                .attr('r', 4)
                .attr('fill', 'steelblue')
                .attr('class', 'marker')
                .attr('cx', d => this.x(d.date))
                .attr('cy', d => this.y(d.value));

            const updateFn = (update: MarkerUpdate) => update
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr('cx', d => this.x(d.date))
                .attr('cy', d => this.y(d.value));

            const exitFn = (exit: MarkerExit) => exit.remove();

            markerLayer.selectAll<SVGCircleElement, ChartData>('circle')
                .data(data)
                .join(enterFn, updateFn, exitFn);
        } else {
            markerLayer.selectAll('circle').remove();
        }
    }
}
