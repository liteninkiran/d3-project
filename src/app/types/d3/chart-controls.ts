export type ChartType = 'line' | 'bar';

export type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type ChartControl = {
    markers: boolean;
    markerSize: number;
    chartType: ChartType;
    margins: Margin;
    line: LineOptions;
    bar: BarOptions;
}

export type ChartDimensions = {
    height: number;
    width: number;
}

export type LineOptions = {
    stroke: number;
}

export type BarOptions = {
    width: number;
}

export type ChartSettings = {
    options: ChartControl;
    dimensions: ChartDimensions;
}

export const defaultChartMargins: Margin = {
    top: 20,
    bottom: 80,
    left: 80,
    right: 20,
}

export const defaultLineOptions: LineOptions = {
    stroke: 1,
}

export const defaultBarOptions: BarOptions = {
    width: 10,
}

export const defaultChartOptions: ChartControl = {
    markers: false,
    markerSize: 10,
    chartType: 'line',
    margins: defaultChartMargins,
    line: defaultLineOptions,
    bar: defaultBarOptions,
}

export const defaultChartDimensions: ChartDimensions = {
    height: 700,
    width: 1500,
}
