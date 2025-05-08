import { ChartOptions } from './chart-controls';
import { ChartData, Group, Svg, XScale, YScale } from './data';

export type MarkerEnter = d3.Selection<d3.EnterElement, ChartData, SVGGElement, unknown>;
export type MarkerUpdate = d3.Selection<SVGCircleElement, ChartData, SVGGElement, unknown>;
export type MarkerExit = d3.Selection<SVGCircleElement, ChartData, SVGGElement, unknown>;

export type ChartContext = {
    svg: Svg;
    container: Group;
    x: XScale;
    y: YScale;
    innerHeight: number;
    innerWidth: number;
    data: ChartData[];
    chartOptions: ChartOptions;
    getLayer: (name: string) => Group;
}
