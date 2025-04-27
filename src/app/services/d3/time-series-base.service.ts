import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { ChartOptions2 } from "src/app/components/d3/chart-settings-2/chart-settings-2.component";
import { ChartData2 } from "src/app/types/d3/data";

@Injectable({ providedIn: 'root' })
export class TimeSeriesBaseService {
    private chartOptions: ChartOptions2;
    private chartData: ChartData2[] = [];

    private div: d3.Selection<HTMLDivElement, {}, HTMLElement, any>;
    private svg: d3.Selection<SVGElement, {}, HTMLElement, any>;

    private dataContainer: any;
    private xAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private yAxisContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private legendContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleContainer: d3.Selection<SVGGElement, {}, HTMLElement, any>;
    private titleText: d3.Selection<SVGGElement, {}, HTMLElement, any>;

    // Dimensions
    private innerWidth: number = 0;
    private innerHeight: number = 0;

    // Scales
    private x: d3.ScaleTime<number, number, never>;
    private y: d3.ScaleContinuousNumeric<number, number, never>;

    public init(
        data: ChartData2[],
        chartOptions: ChartOptions2,
        container = '.svg-container'
    ): void {
        this.chartData = data;
        this.chartOptions = chartOptions;

        this.setInnerDimensions();
        this.storeSvg(container);
    }

    private setInnerDimensions(): void {
        console.log('setInnerDimensions');
        const { left, right, top, bottom } = this.chartOptions.margin;
        const { height, width } = this.chartOptions.dimensions;
        this.innerWidth = width - left - right;
        this.innerHeight = height - top - bottom;
    }

    private storeSvg(container: string): void {
        console.log('storeSvg');
        this.div = d3.select(container);
        this.svg = this.div.select('svg');
    }
}
