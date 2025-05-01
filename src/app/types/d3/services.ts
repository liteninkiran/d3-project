import { ChartOptions } from './chart-controls';
import { ChartData, Group, Svg, XScale, YScale } from './data';

export type LineEnter = d3.Selection<d3.EnterElement, ChartData[], SVGGElement, unknown>;
export type LineUpdate = d3.Selection<SVGPathElement, ChartData[], SVGGElement, unknown>;
export type LineExit = d3.Selection<SVGPathElement, ChartData[], SVGGElement, unknown>;

export type MarkerEnter = d3.Selection<d3.EnterElement, ChartData, SVGGElement, unknown>;
export type MarkerUpdate = d3.Selection<SVGCircleElement, ChartData, SVGGElement, unknown>;
export type MarkerExit = d3.Selection<SVGCircleElement, ChartData, SVGGElement, unknown>;

export type ChartContext = {
    svg: Svg;
    container: Group;
    x: XScale;
    y: YScale;
    data: ChartData[];
    chartOptions: ChartOptions;
    getLayer: (name: string) => Group;
}
